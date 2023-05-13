const express = require("express");
const {
  handleLogin,
  forgotPassword,
  checkOtpValidity,
  changePassword,
} = require("../controllers/loginController");
const validationHandler = require("../middlewares/common/validationHandler");
const { doLoginValidators } = require("../middlewares/login/loginValidators");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const avatarUpload = require("../middlewares/user/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/user/userValidators");
const {
  doForgotPasswordValidation,
  doForgotPasswordValidityValidation,
} = require("../middlewares/login/forgotPasswordValidator");
const { addUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Successful!" });
});

router.post("/login", doLoginValidators, validationHandler, handleLogin);
router.post(
  "/registration",
  avatarUpload,
  addUserValidators,
  validateConfirmPassword,
  addUserValidationHandler,
  addUser
);
router.post(
  "/forgot-password",
  doForgotPasswordValidation,
  validationHandler,
  forgotPassword
);
router.post(
  "/forgot-password/validate-otp",
  doForgotPasswordValidityValidation,
  validationHandler,
  checkOtpValidity
);

router.post(
  "/change-password",
  validateConfirmPassword,
  validationHandler,
  changePassword
);

module.exports = router;
