const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

exports.getAllQuestions = async (req, res) => {
    try {

        const keyword = req.query.keyword;
        const page = Number(req.query.page) || 1;
        const limit = 5;

        let filter = {};

        if (keyword) {
            filter = {
                $or: [
                    { text: { $regex: keyword, $options: "i" } },
                    { keywords: { $regex: keyword, $options: "i" } }
                ]
            };
        }

        const questions = await Question
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json(questions);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question)
            return res.status(404).json({ message: "Question not found" });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createQuestion = async (req, res) => {
    try {
        const question = new Question({
            ...req.body,
            author: req.user.id
        });

        const savedQuestion = await question.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);
        if (!question)
            return res.status(404).json({ message: "Question not found" });
        if (question.author.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not author" });

        Object.assign(question, req.body);
        await question.save();

        res.status(200).json({ message: "Question updated successfully" });
    } catch (error) {
        req.status(400).json({ message: error.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await Question.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        if (question.author.toString() !== req.user.id)
            return res.status(403).json({ message: "You are not author" });

        await Question.findByIdAndDelete(questionId);

        await Quiz.updateMany(
            { questions: questionId },
            { $pull: { questions: questionId } }
        );

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchQuestion = async (req, res) => {
    const { keyword } = req.query;

    const questions = await Question.find({
        keywords: { $regex: keyword, $options: "i" }
    });

    res.json(questions);
}