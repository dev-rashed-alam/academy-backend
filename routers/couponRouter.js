const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const { addCouponValidator } = require("../middlewares/coupon/couponValidator");
const validationHandler = require("../middlewares/common/validationHandler");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");
const {
  addCoupon,
  findAllCoupons,
  findCouponById,
  updateCouponById,
  deleteCouponById,
  checkValidity,
} = require("../controllers/couponController");
const {
  generateFilterFieldsForValidCoupons,
} = require("../controllers/studentController");
const { doPagination } = require("../middlewares/common/paginationMiddleware");
const Coupon = require("../models/Coupon");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addCouponValidator,
  validationHandler,
  addCoupon
);
router.get("/", authMiddleware, doPagination(Coupon), findAllCoupons);
router.get(
  "/valid",
  authMiddleware,
  generateFilterFieldsForValidCoupons,
  doPagination(Coupon),
  findAllCoupons
);
router.get("/isValid/:code", authMiddleware, checkValidity);
router.get("/:id", authMiddleware, checkIsValidObjectId, findCouponById);
router.put("/:id", authMiddleware, checkIsValidObjectId, updateCouponById);
router.delete("/:id", authMiddleware, checkIsValidObjectId, deleteCouponById);

module.exports = router;
