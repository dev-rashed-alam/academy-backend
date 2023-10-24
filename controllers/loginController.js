const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ForgotPassword = require("../models/forgotPassword");
const {setCommonError} = require("../utilities/commonErrors");
const {
    sendMail,
    generateSixDigitRandomNumber,
} = require("../utilities/helpers");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.O_AUTH_CLIENT_ID);

const handleLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if (user?._id) {
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
                    data: {...userObj, avatar: user.avatar},
                    message: "Login successful!",
                });
            } else {
                setCommonError(res, "Login failed! Please try again.", 401);
            }
        } else {
            setCommonError(res, "Login failed! Please try again.", 401);
        }
    } catch (err) {
        setCommonError(res, err.message, err.status);
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const otpNumber = generateSixDigitRandomNumber();

        let postData = {
            email,
            otpNumber,
            status: "open",
        };

        let resetInfo = await ForgotPassword.findOne({email: email});

        if (resetInfo !== null) {
            resetInfo = await ForgotPassword.findOneAndUpdate(
                {email: email},
                postData
            );
        } else {
            const newResetInfo = new ForgotPassword(postData);
            resetInfo = await newResetInfo.save();
        }

        await sendMail(
            email,
            "E-academy learning APP",
            `<p>Your OTP IS: ${otpNumber}</p>`
        );

        res.status(200).json({
            email: resetInfo.email,
            resetToken: resetInfo.id,
            message: "Successful",
        });
    } catch (error) {
        console.log(error);
        setCommonError(res, error.message, 500);
    }
};

const checkIsOTPExpired = (existingTime, additionalTime = 5) => {
    const oldTime = new Date(existingTime);
    const addingAdditionalTime = oldTime.getTime() + additionalTime * 60000;
    const currentTime = new Date().getTime();
    return currentTime > addingAdditionalTime;
};

const checkOtpValidity = async (req, res, next) => {
    try {
        const {otpNumber, resetToken} = req.body;
        const resetInfo = await ForgotPassword.findOne({
            _id: resetToken,
            otpNumber: otpNumber,
            status: "open",
        });

        if (resetInfo?._id) {
            const isOtpExpired = checkIsOTPExpired(resetInfo.updatedAt);
            if (!isOtpExpired) {
                await ForgotPassword.findOneAndUpdate(
                    {
                        _id: resetToken,
                    },
                    {status: "ongoing"}
                );

                res.status(200).json({
                    expiredOn: new Date(resetInfo.updatedAt).getTime() + 5 * 60000,
                    resetToken: resetToken,
                    status: "Valid OTP found!",
                    message: "Permitted for password reset!",
                });
            } else {
                setCommonError(res, "Your OTP is expired!", 408);
            }
        } else {
            setCommonError(res, "Invalid OTP", 404);
        }
    } catch (error) {
        setCommonError(res, error.message, 500);
    }
};

const changePassword = async (req, res, next) => {
    try {
        const resetInfo = await ForgotPassword.findOne({
            _id: req.body.resetToken,
            status: "ongoing",
        });

        if (resetInfo?._id) {
            const isOtpExpired = checkIsOTPExpired(resetInfo.updatedAt);
            if (!isOtpExpired) {
                let postData = {};
                if (req.body?.password) {
                    postData.password = await bcrypt.hash(req.body.password, 10);
                }

                const user = await User.findOneAndUpdate(
                    {email: resetInfo.email},
                    {$set: postData}
                );

                await ForgotPassword.findOneAndUpdate(
                    {
                        _id: resetInfo._id,
                    },
                    {status: "closed"}
                );

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
                    data: {...userObj, avatar: user.avatar},
                    message: "Login successful!",
                });
            } else {
                setCommonError(res, "Process timout!", 408);
            }
        } else {
            setCommonError(res, "Bad Request!", 400);
        }
    } catch (error) {
        setCommonError(res, error.message, error.status);
    }
};

const isOldPasswordMatched = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.loggedInUser.email});
        if (user?._id) {
            const isValidPassword = await bcrypt.compare(
                req.body.oldPassword,
                user.password
            );
            if (isValidPassword) {
                next()
            } else {
                res.status(403).json({
                    errors: {
                        oldPassword: {
                            value: req.body.oldPassword,
                            msg: "Old password is incorrect",
                            param: "oldPassword",
                            location: "body"
                        }
                    },
                });
            }
        }
    } catch (error) {
        setCommonError(res, error.message, error.status);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const postData = {};
        if (req.body?.password) {
            postData.password = await bcrypt.hash(req.body.password, 10);
        }
        await User.findOneAndUpdate(
            {_id: req.loggedInUser.id},
            {$set: postData}
        );
        res.status(200).json({
            message: "Successful!",
        });
    } catch (error) {
        setCommonError(res, error.message, error.status)
    }
}

const verifyGoogleAuthToken = async (req, res, next) => {
    try {
        const {body} = req;
        const ticket = await client.verifyIdToken({
            idToken: body.token,
            audience: process.env.O_AUTH_CLIENT_ID
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
        console.log(body, userid, payload)
        res.status(200).json({
            message: "Successful!",
        });
    }catch (error){
        setCommonError(res, error.message, error.status)
    }
}

module.exports = {
    handleLogin,
    forgotPassword,
    checkOtpValidity,
    changePassword,
    isOldPasswordMatched,
    updatePassword,
    verifyGoogleAuthToken
};
