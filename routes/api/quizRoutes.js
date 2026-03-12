const express = require('express');
const router = express.Router();
const quizController = require("../../controllers/quizController");
const { verifyToken, verifyAdmin } = require("../../middleware/authMiddleware");

router.get("/", verifyToken, quizController.getAllQuizzes);
router.get("/:quizId", verifyToken, quizController.getQuizById);
router.get("./quizId/details", verifyToken, quizController.getQuizDetails);
router.post("/", verifyToken, verifyAdmin, quizController.createQuiz);
router.put("/:quizId", verifyToken, verifyAdmin, quizController.updateQuiz);
router.delete("/:quizId", verifyToken, verifyAdmin, quizController.deleteQuiz);
router.get("/:quizId/populate", verifyToken, quizController.getQuizWithCapitalQuestions);
router.post("/:quizId/question", verifyToken, verifyAdmin, quizController.addQuestionToQuiz);
router.post("/:quizId/questions", verifyToken, verifyAdmin, quizController.addManyQuestions);
router.post("/:quizId/submit", quizController.submitQuiz);


module.exports = router;