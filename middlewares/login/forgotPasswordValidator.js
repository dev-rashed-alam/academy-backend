const { check } = require("express-validator");
const User = require("../../models/User");
const createError = require("http-errors");

const doForgotPasswordValidation = [
  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = await User.findOne({ email: value });
        if (!user) {
          throw createError("Email not found!");
        }
      } catch (err) {
        throw createError(err.message);
      }
    }),
];

const doForgotPasswordValidityValidation = [
  check("otp").notEmpty().withMessage("OTP is required!").trim(),
  check("resetToken").notEmpty().withMessage("Reset token required!").trim(),
];

module.exports = {
  doForgotPasswordValidation,
  doForgotPasswordValidityValidation,
};
