const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        require: true,
    },
    options: {
        type: [String],
        require: true,
    },
    keywords: {
        type: [String],
        require: true,
    },
    correctAnswerIndex: {
        type: Number,
        require: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    }
});

module.exports = mongoose.model("Question", questionSchema);