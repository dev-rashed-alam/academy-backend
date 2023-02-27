const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const User = require("../models/User");

const addUser = async (req, res, next) => {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.files && req.files.length > 0) {
    newUser = new User({
      ...req.body,
      avatar: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user or send error
  try {
    await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
};

const findUserBYId = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (user && user._id) {
      let userObj = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        userType: user.role,
      };
      res.status(200).json({
        data: userObj,
        message: "Successful!",
      });
    } else {
      throw createError(404, "User not found!");
    }
  } catch (err) {
    res.status(err.status || 500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

module.exports = {
  addUser,
  findUserBYId,
};
