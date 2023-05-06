const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const avatarUpload = require("../middlewares/user/avatarUpload");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const validationHandler = require("../middlewares/common/validationHandler");
const { updateUserById } = require("../controllers/userController");
const {
  generateProfileReqBody,
  generateFilterFieldsForValidCoupons,
} = require("../controllers/studentController");
const { doPagination } = require("../middlewares/common/paginationMiddleware");
const { findAllValidCoupons } = require("../controllers/couponController");
const Coupon = require("../models/Coupon");

const router = express.Router();

router.put(
  "/profile/:id",
  authMiddleware,
  avatarUpload,
  validateConfirmPassword,
  validationHandler,
  generateProfileReqBody,
  updateUserById
);

module.exports = router;
