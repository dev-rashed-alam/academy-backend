const createError = require("http-errors");
const { isValidObjectId } = require("mongoose");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const Coupon = require("../models/Coupon");
const { setCommonError } = require("../utilities/commonErrors");

const isCourseAlreadyPurchased = async (req, courseId) => {
  try {
    const { loggedInUser } = req;
    const purchasedInfo = await Course.findOne({
      _id: courseId,
      students: loggedInUser.id,
    });
    return purchasedInfo !== null;
  } catch (error) {
    throw createError(500, error.message);
  }
};

const coursePurchase = async (req, res, next) => {
  try {
    const { loggedInUser, body } = req;
    if (
      (body.couponCode &&
        isValidObjectId(body.couponCode) &&
        isValidObjectId(body.courseId)) ||
      (!body.couponCode && isValidObjectId(body.courseId))
    ) {
      const isCoursePurchased = await isCourseAlreadyPurchased(
        req,
        body.courseId
      );

      if (!isCoursePurchased) {
        const course = await Course.findOne({ _id: body.courseId });
        let coupon = null;
        if (body.couponCode) {
          coupon = await Coupon.findOne({ _id: body.couponCode });
        }

        let purchasePrice = Number(course.coursePrice);
        if (coupon) {
          purchasePrice = (purchasePrice * Number(coupon.percentage)) / 100;
        }

        const postData = {
          course: course._id,
          coupon: coupon?._id || null,
          student: loggedInUser.id,
          purchasePrice: purchasePrice,
        };
        const purchase = new Purchase(postData);
        await purchase.save();

        await Course.findOneAndUpdate(
          { _id: course._id },
          {
            $push: {
              students: loggedInUser.id,
            },
          }
        );

        res.status(200).json({
          message: "Successful",
        });
      } else {
        setCommonError(res, "Course already purchased!", 400);
      }
    } else {
      setCommonError(res, "Invalid Request Body!", 400);
    }
  } catch (error) {
    console.log(error);
    setCommonError(res, error, error.status);
  }
};

const generatePurchaseOptionalModelChain = (req, res, next) => {
  req.chainMethods = [
    {
      methodName: "populate",
      path: "course",
      value: "id title coursePrice thumbnail courseType",
    },
    {
      methodName: "populate",
      path: "student",
      value: "id firstName lastName email",
    },
    {
      methodName: "populate",
      path: "coupon",
      value: "id percentage couponCode",
    },
  ];
  next();
};

const findAllPurchaseList = async (req, res, next) => {
  try {
    res.status(200).json(res.data);
  } catch (error) {
    setCommonError(res, error, error.status);
  }
};

const findPurchaseById = async (req, res, next) => {
  try {
    const purchaseInfo = await Purchase.findOne(
      {
        _id: req.params.id,
      },
      { __v: 0 }
    )
      .populate("course", "id title coursePrice thumbnail courseType createdAt")
      .populate("student", "id firstName lastName email phoneNumber avatar")
      .populate("coupon", "id percentage couponCode");
    res.status(200).json({
      data: purchaseInfo,
      message: "Successful!",
    });
  } catch (error) {
    setCommonError(res, error, error.status);
  }
};

module.exports = {
  coursePurchase,
  isCourseAlreadyPurchased,
  findAllPurchaseList,
  findPurchaseById,
  generatePurchaseOptionalModelChain,
};
