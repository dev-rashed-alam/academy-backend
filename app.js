const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const loginRouter = require("./routers/loginRouter");
const userRouter = require("./routers/userRouter");
const categoryRouter = require("./routers/categoryRouter");

const app = express();
dotenv.config();

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_CONNECTION_URL)
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", loginRouter);
app.use("/users", userRouter);
app.use("/category", categoryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});
