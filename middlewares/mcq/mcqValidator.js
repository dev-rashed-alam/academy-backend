const {body} = require('express-validator');

const mcqValidationRules = [
    body('mcqs')
        .optional()
        .isArray({min: 1})
        .withMessage('A list of MCQs is required')
        .custom((mcqs) => {
            mcqs.forEach((mcq, mcqIndex) => {
                if (!mcq.title || typeof mcq.title !== 'string') {
                    throw new Error(`MCQ at index ${mcqIndex} must have a title as a string`);
                }
                if (!Array.isArray(mcq.questions) || mcq.questions.length < 1) {
                    throw new Error(`MCQ at index ${mcqIndex} must have at least one question`);
                }
                mcq.questions.forEach((question, questionIndex) => {
                    if (!question.questionText || typeof question.questionText !== 'string') {
                        throw new Error(`Question at index ${questionIndex} in MCQ ${mcqIndex} must have a questionText`);
                    }
                    if (!Array.isArray(question.options) || question.options.length < 1) {
                        throw new Error(`Question at index ${questionIndex} in MCQ ${mcqIndex} must have at least one option`);
                    }
                    const correctOptions = question.options.filter(option => option.isCorrect);
                    if (correctOptions.length === 0) {
                        throw new Error(`Question at index ${questionIndex} in MCQ ${mcqIndex} must have one correct option`);
                    }
                });
            });
            return true;
        }),
];

module.exports = {mcqValidationRules};
