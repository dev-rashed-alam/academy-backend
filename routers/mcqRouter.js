const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const {mcqValidationRules} = require("../middlewares/mcq/mcqValidator")
const validationHandler = require("../middlewares/common/validationHandler");
const {createMcq} = require("../controllers/mcqController");
const router = express.Router();

router.post('/create', authMiddleware, mcqValidationRules, validationHandler, createMcq)
router.post('/:id', authMiddleware, createMcq)

module.exports = router