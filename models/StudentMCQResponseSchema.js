const mongoose = require('mongoose');

const studentMCQResponseSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    mcqId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MCQ',
        required: true
    },
    responses: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        selectedOptionIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Option',
            required: true
        }]
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
});

const StudentMCQResponse = mongoose.model('StudentMCQResponse', studentMCQResponseSchema);
module.exports = StudentMCQResponse;
