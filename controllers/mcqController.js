const MCQ = require("../models/McqSchema")
const {setCommonError} = require("../utilities/commonErrors");

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

module.exports = {
    createMcq
}