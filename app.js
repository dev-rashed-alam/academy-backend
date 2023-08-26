const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { connectDB } = require("./utilities/dbConnection");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./routers/loginRouter");
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");
const articleRouter = require("./routers/articleRouter");
const couponRouter = require("./routers/couponRouter");
const courseRouter = require("./routers/courseRouter");
const studentRouter = require("./routers/studentRouter");
const purchaseRouter = require("./routers/purchaseRouter");
const searchRouter = require("./routers/searchRouter");
const dashboardRouter = require("./routers/dashboardRouter");

const app = express();
dotenv.config();

app.use(cors());
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/category", categoryRouter);
app.use("/article", articleRouter);
app.use("/coupons", couponRouter);
app.use("/courses", courseRouter);
app.use("/students", studentRouter);
app.use("/purchase", purchaseRouter);
app.use("/search", searchRouter);
app.use("/dashboard", dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});
