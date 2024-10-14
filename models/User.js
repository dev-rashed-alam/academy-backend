const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            // required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "student"],
            default: "student",
        },
        registrationType: {
            type: String,
            enum: ["own_app", "google_service"],
            default: "own_app",
        },
        status: {
            type: String,
            enum: ["ENABLE", "DISABLE"],
            default: "ENABLE",
        },
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

module.exports = User;
