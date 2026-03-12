const express = require('express');
const router = express.Router();
const questionController = require("../../controllers/questionController");
const { verifyToken } = require("../../middleware/authMiddleware");

router.get("/", verifyToken, questionController.getAllQuestions);
router.get("/search", questionController.searchQuestion);
router.get("/:questionId", verifyToken, questionController.getQuestionById);
router.post("/", verifyToken, questionController.createQuestion);
router.put("/:questionId", verifyToken, questionController.updateQuestion);
router.delete("/:questionId", verifyToken, questionController.deleteQuestion);

module.exports = router;
