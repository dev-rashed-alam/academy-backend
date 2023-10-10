const express = require('express');
const loginRouter = require("./loginRouter");
const userRouter = require("./userRouter");
const categoryRouter = require("./categoryRouter");
const articleRouter = require("./articleRouter");
const couponRouter = require("./couponRouter");
const courseRouter = require("./courseRouter");
const studentRouter = require("./studentRouter");
const purchaseRouter = require("./purchaseRouter");
const searchRouter = require("./searchRouter");
const dashboardRouter = require("./dashboardRouter");
const app = express();

const academyRouter = express.Router();

academyRouter.use("/", loginRouter);
academyRouter.use("/users", userRouter);
academyRouter.use("/category", categoryRouter);
academyRouter.use("/article", articleRouter);
academyRouter.use("/coupons", couponRouter);
academyRouter.use("/courses", courseRouter);
academyRouter.use("/students", studentRouter);
academyRouter.use("/purchase", purchaseRouter);
academyRouter.use("/search", searchRouter);
academyRouter.use("/dashboard", dashboardRouter);

module.exports = academyRouter