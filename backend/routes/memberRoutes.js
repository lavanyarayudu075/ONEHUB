// backend/routes/memberRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
} = require("../controllers/memberController");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getMembers);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

module.exports = router;