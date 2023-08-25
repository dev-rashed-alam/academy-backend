const mongoose = require("mongoose");

const purchaseSchema = mongoose.Schema(
    {
        courses: {
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
        totalPrice: {
            type: String,
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        invoiceNumber: {
            type: String,
            required: true,
        },
        transactionInfos: {
            type: Object
        },
    },
    {timestamps: true}
);

const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
