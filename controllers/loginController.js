const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");
const { setCommonError } = require("../utilities/commonErrors");
const {
  sendMail,
  generateSixDigitRandomNumber,
  generateResetToken,
  numberToBase64,
  regenerateSixDigitNumberFromToken,
  base64ToNumber,
} = require("../utilities/helpers");

const handleLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isValidPassword) {
        const userObj = {
          firstName: user.firstName,
          lastName: user.lastName,
          id: user._id,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
        };

        const token = jwt.sign(userObj, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });
        res.status(200).json({
          access_token: token,
          data: { ...userObj, avatar: user.avatar },
          message: "Login successful!",
        });
      } else {
        throw createError(401, "Login failed! Please try again.");
      }
    } else {
      throw createError(401, "Login failed! Please try again.");
    }
  } catch (err) {
    res.status(err.status).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otpNumber = generateSixDigitRandomNumber();
    const resetToken = generateResetToken(otpNumber);
    await sendMail(
      email,
      "E-academy learning APP",
      `<p>Your OTP IS: ${otpNumber}</p>`
    );
    res.status(200).json({
      resetToken: numberToBase64(resetToken),
      message: "Successful",
    });
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

const checkOtpValidity = async (req, res, next) => {
  try {
    const { otp, resetToken } = req.body;
    const generatedOtp = regenerateSixDigitNumberFromToken(
      base64ToNumber(resetToken)
    );
    if (parseInt(otp) === parseInt(generatedOtp)) {
      res.status(200).json({
        status: "Valid OTP found!",
        message: "Permitted for password reset!",
      });
    } else {
      setCommonError(res, "Unauthorized", 401);
    }
  } catch (error) {
    setCommonError(res, error.message, 500);
  }
};

module.exports = {
  handleLogin,
  forgotPassword,
  checkOtpValidity,
};
