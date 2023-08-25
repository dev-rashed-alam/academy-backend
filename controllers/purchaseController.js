const createError = require("http-errors");
const {isValidObjectId} = require("mongoose");
const Purchase = require("../models/Purchase");
const Course = require("../models/Course");
const Coupon = require("../models/Coupon");
const {setCommonError} = require("../utilities/commonErrors");

const isCourseAlreadyPurchased = async (req, courseId) => {
    try {
        const {loggedInUser} = req;
        const purchasedInfo = await Course.findOne({
            _id: courseId, students: loggedInUser.id,
        });
        return purchasedInfo !== null;
    } catch (error) {
        throw createError(500, error.message);
    }
};

const coursePurchase = async (req, res, next) => {
    try {
        const {loggedInUser, body} = req;
        let coupon = null;
        if (body.couponCode) {
            coupon = await Coupon.findOne({_id: body.couponCode, expiryDate: {$gte: new Date()}});
        }
        if (body.couponCode && coupon === null) {
            res.status(400).json({
                message: "Invalid coupon!"
            });
        } else {
            const prevPurchasedCourses = await Course.find({
                students: loggedInUser.id
            })

            const prevCourseIds = prevPurchasedCourses.map(item => item._id)

            let validCourses = []
            let inValidCourses = []
            body.courses.forEach(item => {
                let isExist = prevCourseIds.find(id => id.equals(item))
                if (isExist) {
                    inValidCourses.push(item)
                } else {
                    validCourses.push(item)
                }
            })

            if (inValidCourses.length === 0 && validCourses.length > 0) {
                const postData = {
                    courses: validCourses,
                    coupon: coupon?._id || null,
                    student: loggedInUser.id,
                    purchasePrice: body.purchasePrice,
                    totalPrice: body.totalPrice,
                    paymentMethod: body.paymentMethod,
                    invoiceNumber: `#${Date.now()}`
                };

                const purchase = new Purchase(postData);
                await purchase.save()
                await Course.updateMany(
                    {
                        _id: {
                            $in: validCourses
                        }
                    },
                    {
                        $push: {
                            students: loggedInUser.id,
                        },
                    }
                );
                res.status(200).json({
                    message: "Successful",
                    data: purchase
                });
            } else {
                res.status(400).json({
                    message: "Unable to purchase!",
                    existingCourseIds: inValidCourses
                });
            }
        }
    } catch (error) {
        setCommonError(res, error, error.status);
    }
};

const generatePurchaseOptionalModelChain = (req, res, next) => {
    req.chainMethods = [{
        methodName: "populate", path: "courses", value: "id title coursePrice thumbnail courseType",
    }, {
        methodName: "populate", path: "student", value: "id firstName lastName email",
    }, {
        methodName: "populate", path: "coupon", value: "id percentage couponCode",
    },];
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
        const purchaseInfo = await Purchase.findOne({
            _id: req.params.id,
        }, {__v: 0})
            .populate("courses", "id title coursePrice thumbnail courseType createdAt")
            .populate("student", "id firstName lastName email phoneNumber avatar")
            .populate("coupon", "id percentage couponCode");
        res.status(200).json({
            data: purchaseInfo, message: "Successful!",
        });
    } catch (error) {
        setCommonError(res, error, error.status);
    }
};

module.exports = {
    coursePurchase, isCourseAlreadyPurchased, findAllPurchaseList, findPurchaseById, generatePurchaseOptionalModelChain,
};
