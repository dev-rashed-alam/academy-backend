const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const { addCouponValidator } = require("../middlewares/coupon/couponValidator");
const validationHandler = require("../middlewares/common/validationHandler");
const {
  addCoupon,
  findAllCoupons,
  findCouponById,
  updateCouponById,
  deleteCouponById,
} = require("../controllers/couponController");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  addCouponValidator,
  validationHandler,
  addCoupon
);
router.get("/", authMiddleware, findAllCoupons);
router.get("/:id", authMiddleware, findCouponById);
router.put("/:id", authMiddleware, updateCouponById);
router.delete("/:id", authMiddleware, deleteCouponById);

module.exports = router;
