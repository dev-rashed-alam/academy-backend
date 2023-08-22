const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema(
  {
    course: {
      type: mongoose.Types.ObjectId,
      ref: "Course",
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    purchasePrice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
