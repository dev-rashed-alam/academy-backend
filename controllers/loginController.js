const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User");

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
          message: "Login successful!",
        });
      } else {
        throw createError("Login failed! Please try again.");
      }
    } else {
      throw createError("Login failed! Please try again.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

module.exports = {
  handleLogin,
};
