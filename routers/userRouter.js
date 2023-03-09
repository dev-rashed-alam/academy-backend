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

const router = express.Router();

router.get("/:id", authMiddleware, findUserById);
router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);
router.put("/:id", authMiddleware, avatarUpload, updateUserById);

module.exports = router;
