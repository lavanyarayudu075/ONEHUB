const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const memberRoutes = require("./routes/memberRoutes");
const taskRoutes = require("./routes/taskRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/tasks", taskRoutes);

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "ONEHUB Backend is running 🚀",
  });
});

// Test database connection
app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connection successful ✅",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed ❌",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(
    `ONEHUB Backend running on http://localhost:${PORT}`
  );
});