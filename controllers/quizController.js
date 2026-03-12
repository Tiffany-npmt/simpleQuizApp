const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate("questions");
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate("questions");
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuizDetails = async (req, res) => {
    try {

        const quiz = await Quiz.findById(req.params.quizId).populate("questions");

        if (!quiz) {
            return res.status(404).send("Quiz not found");
        }

        res.render("detail", { quiz });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
};

exports.createQuiz = async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        const savedQuiz = await quiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.quizId,
            req.body,
            { new: true }
        );
        res.status(200).json({ message: "Quiz updated successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        if (quiz.questions.length > 0) {
            await Question.deleteMany({
                _id: { $in: quiz.questions }
            });
        }

        await Quiz.findByIdAndDelete(quizId);

        res.status(200).json({ message: "Quiz deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: "questions",
            match: { keywords: "capital" },
        });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addQuestionToQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);

        if (!quiz) {
            return res.status(404).json({ messange: "Quiz not found" });
        }

        const question = new Question({
            ...req.body,
            author: req.user._id
        }
        );
        const savedQuestion = await question.save();

        quiz.questions.push(savedQuestion._id);
        await quiz.save();

        res.status(201).json(savedQuestion);

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.addManyQuestions = async (req, res) => {
    try {
        const { quizId } = req.params;
        const questionsData = req.body;

        if (!Array.isArray(questionsData)) {
            return res.status(400).json({ message: "Request body must be an array of questions" });
        }

        const quiz = await Quiz.findById(quizId)
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const createdQuestions = await Question.insertMany(questionsData);

        const questionIds = createdQuestions.map(q => q._id);
        quiz.questions.push(...questionIds);
        await quiz.save();

        res.status(200).json({ message: "Questions added to quiz successfully", });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.submitQuiz = async (req, res) => {
    try {
        const quizId = req.params.quizId;
        const answers = req.body.answers;

        const quiz = await Quiz.findById(quizId).populate("questions");
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }
        let correct = 0;

        quiz.questions.forEach((q, index) => {
            const userAnswer = parseInt(answers[index]);
            if (userAnswer === q.correctAnswerIndex) {
                correct++;
            }
        });

        res.json({
            correct: correct,
            total: quiz.questions.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
