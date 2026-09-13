const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");

const registerUser = async (req, res) => {
  const {
    organisationName,
    organisationType,
    name,
    email,
    password,
  } = req.body;

  try {
    // Validate required fields
    if (
      !organisationName ||
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields.",
      });
    }

    // Check if organisation already exists
    const organisationResult = await pool.query(
      "SELECT id FROM organizations WHERE name = $1",
      [organisationName]
    );

    if (organisationResult.rows.length > 0) {
      return res.status(400).json({
        message: "Organisation already exists.",
      });
    }

    // Create organisation
    const organisation = await pool.query(
      `INSERT INTO organizations
       (name, type)
       VALUES ($1, $2)
       RETURNING id, name, type`,
      [organisationName, organisationType || "Other"]
    );

    const organisationId = organisation.rows[0].id;

    // Email has to be unique across the whole system, not just within this
    // organisation — loginUser looks a user up by email alone with no
    // organisation filter, so two orgs sharing an email would make login
    // ambiguous (it would always find whichever row Postgres happens to
    // return first). A DB-level UNIQUE constraint on users.email backs
    // this up as a safety net against race conditions; see
    // add-email-unique-constraint.js.
    const existingUser = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await pool.query(
      `INSERT INTO users
       (organization_id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role`,
      [
        organisationId,
        name,
        email,
        passwordHash,
        "admin",
      ]
    );

    res.status(201).json({
      message: "Registration successful 🎉",
      organisation: organisation.rows[0],
      user: user.rows[0],
    });

  } catch (error) {

    console.error("Registration error:", error);

    // 23505 = unique_violation. Backstops the SELECT-then-INSERT check
    // above against a race between two near-simultaneous registrations
    // with the same email, once the UNIQUE constraint exists on the
    // column (see add-email-unique-constraint.js).
    if (error.code === "23505") {
      return res.status(400).json({
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      message: "Server error during registration.",
    });
  }
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const result = await pool.query(
      `SELECT
        u.id,
        u.organization_id,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        o.name AS organization_name,
        o.type AS organization_type
       FROM users u
       JOIN organizations o
         ON u.organization_id = o.id
       WHERE u.email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        organizationId: user.organization_id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful 🎉",
      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organization_id,
        organizationName: user.organization_name,
        organizationType: user.organization_type,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Server error during login.",
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const result = await pool.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email]
    );

    // Respond the same way whether or not the email exists,
    // so this endpoint can't be used to discover registered emails.
    if (result.rows.length === 0) {
      return res.status(200).json({
        message: "If that email is registered, a reset link has been sent.",
      });
    }

    const user = result.rows[0];

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    await pool.query(
      `UPDATE users
       SET reset_password_token = $1,
           reset_password_expires = $2
       WHERE id = $3`,
      [hashedToken, expires, user.id]
    );

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await transporter.sendMail({
      from: `"ONEHUB" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset your ONEHUB password",
      html: `
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your ONEHUB password. This link expires in 1 hour.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: "If that email is registered, a reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      message: "Server error while processing password reset.",
    });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    if (!password) {
      return res.status(400).json({
        message: "New password is required.",
      });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const result = await pool.query(
      `SELECT id FROM users
       WHERE reset_password_token = $1
       AND reset_password_expires > NOW()`,
      [hashedToken]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired.",
      });
    }

    const userId = result.rows[0].id;
    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      `UPDATE users
       SET password_hash = $1,
           reset_password_token = NULL,
           reset_password_expires = NULL
       WHERE id = $2`,
      [passwordHash, userId]
    );

    res.status(200).json({
      message: "Password updated successfully. You can now log in.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      message: "Server error while resetting password.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};