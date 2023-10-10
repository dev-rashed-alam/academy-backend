const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const { connectDB } = require("./utilities/dbConnection");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const academyRouter = require("./routers/academyRouter");

const app = express();
dotenv.config();

app.use(cors());
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/academy", academyRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`app listening to port ${process.env.PORT}`);
});
