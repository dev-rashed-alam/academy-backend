const MCQ = require("../models/McqSchema")
const {setCommonError} = require("../utilities/commonErrors");
const StudentMCQResponse = require('../models/StudentMCQResponseSchema');

const createMcq = async (req, res, next) => {
    try {
        const {mcqs} = req.body;
        const createdMCQs = await MCQ.insertMany(mcqs);
        res.status(201).json({
            message: "MCQ was saved successful!",
            createdMCQs
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
}

const submitMcq = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const mcqId = req.params.mcqId;

        const studentResponse = new StudentMCQResponse({
            userId: req.loggedInUser.id,
            courseId,
            mcqId,
            responses: req.body.responses
        });
        await studentResponse.save();
        res.status(201).json({
            message: "Response was saved successful!",
            studentResponse
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
}

const getMcqResult = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const mcqId = req.params.mcqId;
        const userId = req.loggedInUser.id;
        const studentResponse = await StudentMCQResponse.findOne({
            userId: userId,
            courseId: courseId,
            mcqId: mcqId
        })
        if (!studentResponse) {
            return res.status(404).json({message: "No response found for this MCQ"});
        }
        const mcq = await MCQ.findById(mcqId);
        res.status(200).json({
            message: "Successful!",
            mcq,
            studentResponse: studentResponse.responses
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
}

module.exports = {
    createMcq,
    submitMcq,
    getMcqResult
}