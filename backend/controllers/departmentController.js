const pool = require("../config/db");

// Every query below is scoped to req.user.organizationId (set by
// authMiddleware from the verified JWT), so one organisation can never
// see or modify another organisation's departments — even by guessing an id.

const getDepartments = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const result = await pool.query(
      `SELECT id, name, description, manager, status, created_at, updated_at
       FROM departments
       WHERE organization_id = $1
       ORDER BY created_at DESC`,
      [organizationId]
    );

    res.status(200).json({ departments: result.rows });
  } catch (error) {
    console.error("Get departments error:", error);
    res.status(500).json({ message: "Server error while fetching departments." });
  }
};

const createDepartment = async (req, res) => {
  const { organizationId } = req.user;
  const { name, description, manager, status } = req.body;

  try {
    if (!name || !manager) {
      return res.status(400).json({ message: "Department name and manager are required." });
    }

    const result = await pool.query(
      `INSERT INTO departments (organization_id, name, description, manager, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, manager, status, created_at, updated_at`,
      [
        organizationId,
        name.trim(),
        description?.trim() || "No description yet.",
        manager.trim(),
        status || "Active",
      ]
    );

    res.status(201).json({
      message: "Department created successfully.",
      department: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "A department with this name already exists." });
    }
    console.error("Create department error:", error);
    res.status(500).json({ message: "Server error while creating department." });
  }
};

const updateDepartment = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;
  const { name, description, manager, status } = req.body;

  try {
    if (!name || !manager) {
      return res.status(400).json({ message: "Department name and manager are required." });
    }

    const result = await pool.query(
      `UPDATE departments
       SET name = $1, description = $2, manager = $3, status = $4, updated_at = NOW()
       WHERE id = $5 AND organization_id = $6
       RETURNING id, name, description, manager, status, created_at, updated_at`,
      [
        name.trim(),
        description?.trim() || "No description yet.",
        manager.trim(),
        status || "Active",
        id,
        organizationId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Department not found." });
    }

    res.status(200).json({
      message: "Department updated successfully.",
      department: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ message: "A department with this name already exists." });
    }
    console.error("Update department error:", error);
    res.status(500).json({ message: "Server error while updating department." });
  }
};

const deleteDepartment = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM departments WHERE id = $1 AND organization_id = $2 RETURNING id`,
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Department not found." });
    }

    // Members/tasks pointing at this department have department_id set to
    // NULL automatically (ON DELETE SET NULL) — they aren't deleted, they
    // just become "Unassigned" until reassigned.
    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error("Delete department error:", error);
    res.status(500).json({ message: "Server error while deleting department." });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};