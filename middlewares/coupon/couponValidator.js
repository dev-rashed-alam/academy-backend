const { check } = require("express-validator");

const addCouponValidator = [
  check("title").notEmpty().withMessage("Title is required"),
  check("couponCode").notEmpty().withMessage("Coupon code is required"),
  check("expiryDate").isDate().withMessage("Expiry date must be a valid date"),
  check("percentage").notEmpty().withMessage("Percentage is required"),
];

module.exports = {
  addCouponValidator,
};
