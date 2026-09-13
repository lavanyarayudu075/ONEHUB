const pool = require("../config/db");

// Same department-name resolution as memberController.js: match an
// existing department case-insensitively, or create one on the fly if
// nothing matches yet, instead of silently falling back to
// "Unassigned". Keeps the Tasks form free-text, same as Members.
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
    if (error.code === "23505") {
      const retry = await pool.query(
        `SELECT id FROM departments WHERE organization_id = $1 AND LOWER(name) = LOWER($2)`,
        [organizationId, trimmedName]
      );
      return retry.rows[0]?.id ?? null;
    }

    console.error("Could not auto-create department:", trimmedName, error);
    return null;
  }
}

const TASK_SELECT = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.assignee,
    t.department_id AS "departmentId",
    COALESCE(d.name, 'Unassigned') AS department,
    t.priority,
    t.due_date AS "dueDate",
    t.status,
    t.created_at,
    t.updated_at
  FROM tasks t
  LEFT JOIN departments d ON d.id = t.department_id
`;

const getTasks = async (req, res) => {
  try {
    const { organizationId } = req.user;

    const result = await pool.query(
      `${TASK_SELECT} WHERE t.organization_id = $1 ORDER BY t.created_at DESC`,
      [organizationId]
    );

    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error while fetching tasks." });
  }
};

const createTask = async (req, res) => {
  const { organizationId } = req.user;
  const { title, description, assignee, department, departmentId, priority, dueDate, status } = req.body;

  try {
    if (!title || !assignee) {
      return res.status(400).json({ message: "Task title and assignee are required." });
    }

    const resolvedDepartmentId = await resolveDepartmentId(organizationId, { departmentId, department });

    const inserted = await pool.query(
      `INSERT INTO tasks (organization_id, title, description, assignee, department_id, priority, due_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        organizationId,
        title.trim(),
        description?.trim() || "No description provided.",
        assignee.trim(),
        resolvedDepartmentId,
        priority || "Medium",
        dueDate || null,
        status || "Pending",
      ]
    );

    const result = await pool.query(`${TASK_SELECT} WHERE t.id = $1`, [inserted.rows[0].id]);

    res.status(201).json({
      message: "Task created successfully.",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error while creating task." });
  }
};

const updateTask = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;
  const { title, description, assignee, department, departmentId, priority, dueDate, status } = req.body;

  try {
    if (!title || !assignee) {
      return res.status(400).json({ message: "Task title and assignee are required." });
    }

    const resolvedDepartmentId = await resolveDepartmentId(organizationId, { departmentId, department });

    const updated = await pool.query(
      `UPDATE tasks
       SET title = $1, description = $2, assignee = $3, department_id = $4,
           priority = $5, due_date = $6, status = $7, updated_at = NOW()
       WHERE id = $8 AND organization_id = $9
       RETURNING id`,
      [
        title.trim(),
        description?.trim() || "No description provided.",
        assignee.trim(),
        resolvedDepartmentId,
        priority || "Medium",
        dueDate || null,
        status || "Pending",
        id,
        organizationId,
      ]
    );

    if (updated.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    const result = await pool.query(`${TASK_SELECT} WHERE t.id = $1`, [id]);

    res.status(200).json({
      message: "Task updated successfully.",
      task: result.rows[0],
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error while updating task." });
  }
};

const deleteTask = async (req, res) => {
  const { organizationId } = req.user;
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND organization_id = $2 RETURNING id`,
      [id, organizationId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error while deleting task." });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};