const express = require("express");
const { addUser, findUserBYId } = require("../controllers/userController");
const avatarUpload = require("../middlewares/user/avatarUpload");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/user/userValidators");

const router = express.Router();

router.get("/:id", findUserBYId);

router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

module.exports = router;
