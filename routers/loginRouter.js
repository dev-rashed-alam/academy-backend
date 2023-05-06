const express = require("express");
const { handleLogin } = require("../controllers/loginController");
const validationHandler = require("../middlewares/common/validationHandler");
const { doLoginValidators } = require("../middlewares/login/loginValidators");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const avatarUpload = require("../middlewares/user/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/user/userValidators");
const { addUser } = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Sucessful!" });
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

module.exports = router;
