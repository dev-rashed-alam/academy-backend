const mongoose = require('mongoose');

const optionSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

const questionSchema = mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{type: mongoose.Types.ObjectId, ref: "Option"}]
});

const MCQSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    duration: {
        type: String,
    },
    description: {
        type: String,
    },
    questions: [{type: mongoose.Types.ObjectId, ref: "Question"}]
}, {timestamps: true});

const Option = mongoose.model('Option', optionSchema);
const Question = mongoose.model('Question', questionSchema);
const MCQ = mongoose.model('MCQ', MCQSchema);

module.exports = {Option, Question, MCQ};
