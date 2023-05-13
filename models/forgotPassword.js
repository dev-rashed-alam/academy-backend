const mongoose = require("mongoose");

const forgotPasswordSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otpNumber: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema);

module.exports = ForgotPassword;
