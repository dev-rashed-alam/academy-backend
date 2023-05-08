const Coupon = require("../models/Coupon");
const { setCommonError } = require("../utilities/commonErrors");

const addCoupon = async (req, res, next) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(200).json({
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findAllCoupons = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findCouponById = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ _id: req.params.id }, { __v: 0 });
    res.status(200).json({
      data: coupon,
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const checkValidity = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne(
      { _id: req.params.id, expiryDate: { $gte: new Date() } },
      { __v: 0 }
    );
    res.status(200).json({
      status: !coupon ? "Coupon Expired" : "Coupon valid",
      data: coupon,
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const updateCouponById = async (req, res, next) => {
  try {
    await Coupon.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json({
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const deleteCouponById = async (req, res, next) => {
  try {
    await Coupon.deleteOne({ _id: req.params.id });
    res.status(200).json({
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const findAllValidCoupons = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

module.exports = {
  addCoupon,
  findAllCoupons,
  findCouponById,
  updateCouponById,
  deleteCouponById,
  findAllValidCoupons,
  checkValidity,
};
