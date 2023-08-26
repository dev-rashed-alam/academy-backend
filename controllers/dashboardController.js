const {setCommonError} = require("../utilities/commonErrors");
const User = require("../models/User")
const Course = require("../models/Course")
const Purchase = require("../models/Purchase")
const findAllCounts = async (req, res, next) => {
    try {
        const totalStudent = await User.countDocuments({role: 'student'})
        const totalCourse = await Course.countDocuments()
        const purchases = await Purchase.find()
        const totalSale = purchases.reduce((total, item) => total += parseInt(item.purchasePrice), 0)
        res.status(200).json({
            message: "Successful!",
            data: {
                totalCourse,
                totalStudent,
                totalPurchase: purchases.length,
                totalSale
            }
        });
    } catch (error) {
        setCommonError(res, error.message, error.status);
    }
}

const purchaseReportByWeek = async (req, res, next) => {
    try {
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date();
        endOfWeek.setHours(23, 59, 59, 999);

        const purchases = await Purchase.find({
            timestamp: {
                $gte: startOfWeek,
                $lte: endOfWeek
            }
        })

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dataByWeekday = {};

        purchases.forEach(entry => {
            const weekdayIndex = entry.createdAt.getDay();
            const weekdayName = weekdays[weekdayIndex];

            if (!dataByWeekday[weekdayName]) {
                dataByWeekday[weekdayName] = [];
            }

            dataByWeekday[weekdayName].push(entry);
        });

        console.log(dataByWeekday)
        res.status(200).json({
            message: "Successful!",
            data: {}
        });
    } catch (error) {
        setCommonError(res, error.message, error.status);
    }
}

const purchaseReportByYear = async (req, res, next) => {
    try {
        const purchases = await Purchase.find()
        res.status(200).json({
            message: "Successful!",
            data: {}
        });
    } catch (error) {
        setCommonError(res, error.message, error.status);
    }
}

module.exports = {
    findAllCounts,
    purchaseReportByWeek,
    purchaseReportByYear
}