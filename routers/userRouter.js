const express = require("express");
const {
  addUser,
  findUserById,
  updateUserById,
} = require("../controllers/userController");
const avatarUpload = require("../middlewares/user/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/user/userValidators");
const authMiddleware = require("../middlewares/common/authMiddleware");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const validationHandler = require("../middlewares/common/validationHandler");

const router = express.Router();

router.get("/:id", authMiddleware, findUserById);
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
router.put(
  "/:id",
  authMiddleware,
  avatarUpload,
  validateConfirmPassword,
  validationHandler,
  updateUserById
);

module.exports = router;
