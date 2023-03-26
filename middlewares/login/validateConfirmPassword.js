const { check } = require("express-validator");
const validateConfirmPassword = [
  check("confirmPassword")
    .if(check("password").notEmpty())
    .trim()
    .isLength({ min: 3 })
    .withMessage("Confirm Password is required!")
    .custom(async (confirmPassword, { req }) => {
      const password = req.body.password;
      if (password !== confirmPassword) {
        throw new Error("Passwords must be same");
      }
    }),
];

module.exports = validateConfirmPassword;
