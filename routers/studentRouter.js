const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const avatarUpload = require("../middlewares/user/avatarUpload");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const validationHandler = require("../middlewares/common/validationHandler");
const { updateUserById } = require("../controllers/userController");
const { generateProfileReqBody } = require("../controllers/studentController");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");

const router = express.Router();

router.put(
  "/profile/:id",
  authMiddleware,
  checkIsValidObjectId,
  avatarUpload,
  validateConfirmPassword,
  validationHandler,
  generateProfileReqBody,
  updateUserById
);

module.exports = router;