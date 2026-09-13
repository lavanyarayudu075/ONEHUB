// backend/routes/departmentRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;