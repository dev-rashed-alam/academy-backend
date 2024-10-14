const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {mcqValidationRules} = require("../middlewares/mcq/mcqValidator")
const validationHandler = require("../middlewares/common/validationHandler");
const {createMcq, submitMcq, getMcqResult} = require("../controllers/mcqController");
const router = express.Router();

router.post('/:mcqId/courses/:courseId', authMiddleware, submitMcq)
router.post('/create', authMiddleware, mcqValidationRules, validationHandler, createMcq)
router.post('/:id', authMiddleware, createMcq)
router.get('/:mcqId/courses/:courseId', authMiddleware, getMcqResult)

module.exports = router