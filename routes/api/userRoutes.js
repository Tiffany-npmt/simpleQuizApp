const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");
const { verifyToken, verifyAdmin } = require("../../middleware/authMiddleware");

router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);

module.exports = router;