const pool = require("../config/db");

// Bridges the frontend — which sends department as a free text NAME —
// onto the department_id foreign key.
//
// Behavior:
//  1. If a departmentId was sent directly, use it as-is.
//  2. Otherwise, try to find an existing department for this
//     organisation with that name (case-insensitive, so "hr" / "HR" /
//     "Hr" all match the same department instead of missing each other
//     over capitalization).
//  3. If nothing matches, create a new department with that name on the
//     spot instead of silently falling back to "Unassigned" — this is
//     what lets the Members/Tasks forms stay free-text instead of
//     requiring you to pre-create every department first. The new
//     department shows up on the Departments page too, with a
//     placeholder manager you can fill in later.
async function resolveDepartmentId(organizationId, { departmentId, department }) {
  if (departmentId) return departmentId;

  const trimmedName = department && department.trim();

  if (!trimmedName || trimmedName.toLowerCase() === "unassigned") {
    return null;
  }

  const existing = await pool.query(
    `SELECT id FROM departments WHERE organization_id = $1 AND LOWER(name) = LOWER($2)`,
    [organizationId, trimmedName]
  );

  if (existing.rows[0]) {
    return existing.rows[0].id;
  }

  try {
    const created = await pool.query(
      `INSERT INTO departments (organization_id, name, description, manager, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [organizationId, trimmedName, "No description yet.", "Unassigned", "Active"]
    );

    return created.rows[0].id;
  } catch (error) {
    // Two requests creating the same brand-new department name at the
    // same instant would collide on the UNIQUE(organization_id, name)
    // constraint — in that case it now exists, so just look it up.
    if (error.code === "23505") {
      const retry = await pool.query(
        `SELECT id FROM departments WHERE organization_id = $1 AND LOWER(name) = LOWER($2)`,
        [organizationId, trimmedName]
      );
      return retry.rows[0]?.id ?? null;
    }

    // Anything else unexpected — don't let this crash the member save,
    // just fall back to the old "Unassigned" behavior.
    console.error("Could not auto-create department:", trimmedName, error);
    return null;
  }
}

const MEMBER_SELECT = `
  SELECT
    m.id,
    m.name,
    m.email,
    m.role,
    m.department_id AS "departmentId",
    COALESCE(d.name, 'Unassigned') AS department,
    m.status,
    m.created_at,
    m.updated_at
  FROM members m
  LEFT JOIN departments d ON d.id = m.department_id
`;

const getMembers = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const result = await pool.query(
      `${MEMBER_SELECT} WHERE m.organization_id = $1 ORDER BY m.created_at DESC`,
      [organizationId]
    );

    res.status(200).json({ members: result.rows });
  } catch (error) {
    console.error("Get members error:", error);
    res.status(500).json({ message: "Server error while fetching members." });
  }
};

const createMember = async (req, res) => {
  const { organizationId } = req.user;
  const { name, email, role, department, departmentId, status } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const resolvedDepartmentId = await resolveDepartmentId(organizationId, { departmentId, department });

    const inserted = await pool.query(
      `INSERT INTO members (organization_id, name, email, role, department_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        organizationId,
        name.trim(),
        email.trim(),
        role || "Member",
        resolvedDepartmentId,
        status || "Active",
      ]
    );

    const result = await pool.query(`${MEMBER_SELECT} WHERE m.id = $1`, [inserted.rows[0].id]);

    res.status(201).json({
      message: "Member added successfully.",
      member: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "A member with this email already exists." });
    }
    console.error("Create member error:", error);
    res.status(500).json({ message: "Server error while creating member." });
  }
};

const updateMember = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;
  const { name, email, role, department, departmentId, status } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }

    const resolvedDepartmentId = await resolveDepartmentId(organizationId, { departmentId, department });

    const updated = await pool.query(
      `UPDATE members
       SET name = $1, email = $2, role = $3, department_id = $4, status = $5, updated_at = NOW()
       WHERE id = $6 AND organization_id = $7
       RETURNING id`,
      [
        name.trim(),
        email.trim(),
        role || "Member",
        resolvedDepartmentId,
        status || "Active",
        id,
        organizationId,
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Member not found." });
    }

    const result = await pool.query(`${MEMBER_SELECT} WHERE m.id = $1`, [id]);

    res.status(200).json({
      message: "Member updated successfully.",
      member: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "A member with this email already exists." });
    }
    console.error("Update member error:", error);
    res.status(500).json({ message: "Server error while updating member." });
  }
};

const deleteMember = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM members WHERE id = $1 AND organization_id = $2 RETURNING id`,
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Member not found." });
    }

    res.status(200).json({ message: "Member deleted successfully." });
  } catch (error) {
    console.error("Delete member error:", error);
    res.status(500).json({ message: "Server error while deleting member." });
  }
};

module.exports = {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
};