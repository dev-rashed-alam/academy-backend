const bcrypt = require("bcrypt");
const User = require("../models/User");
const {setCommonError} = require("../utilities/commonErrors");
const {
    removeUploadedFile,
} = require("../utilities/removeUploadedFileOrFolder");
const {removeEmptyValues} = require("../utilities/helpers");

const addUser = async (req, res, next) => {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if (req.files && req.files.length > 0) {
        const avatarLocation = process.env.APP_URL + "uploads/avatars/";
        newUser = new User({
            ...req.body,
            avatar: avatarLocation + req.files[0].filename,
            password: hashedPassword,
        });
    } else {
        newUser = new User({
            ...req.body,
            password: hashedPassword,
        });
    }

    try {
        await newUser.save();
        next()
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const findUserById = async (req, res, next) => {
    try {
        const user = await User.findOne(
            {_id: req.params.id},
            {__v: 0, password: 0}
        );
        res.status(200).json({
            data: user,
            message: "Successful!",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const findUserByUserRole = async (req, res, next) => {
    try {
        const user = await User.find(
            {role: req.params.userType},
            {__v: 0, password: 0}
        );
        res.status(200).json({
            data: user,
            message: "Successful!",
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const postData = removeEmptyValues(req.body);
        if (req.files[0]?.filename) {
            const avatarLocation = process.env.APP_URL + "uploads/avatars/";
            postData.avatar = avatarLocation + req.files[0].filename;
        }
        if (req.body?.password) {
            postData.password = await bcrypt.hash(req.body.password, 10);
        }

        const user = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: postData}
        );
        if (req.files[0]?.filename) {
            removeUploadedFile(user.avatar, "avatars");
        }
        const updatedUser = await User.findOne(
            {_id: req.params.id}
        );
        res.status(200).json({
            message: "Successful!",
            data: {
                id: updatedUser.id,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                email: updatedUser.email,
                avatar: updatedUser.avatar
            }
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};
const updateUserStatusById = async (req, res, next) => {
    try {
        const postData = removeEmptyValues(req.body);
        const user = await User.findOneAndUpdate(
            {_id: req.params.id},
            {$set: postData},
            {new: true}
        );
        res.status(200).json({
            message: "Successful!",
            data: user
        });
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

module.exports = {
    addUser,
    findUserById,
    updateUserById,
    findUserByUserRole,
    updateUserStatusById
};
