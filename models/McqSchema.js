const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        default: false
    }
});

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [optionSchema]
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
    questions: [questionSchema]
}, {timestamps: true});

const MCQ = mongoose.model('MCQ', MCQSchema);

module.exports = MCQ;
