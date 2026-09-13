// backend/routes/taskRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;