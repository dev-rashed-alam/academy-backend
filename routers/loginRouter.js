const express = require("express");
const {
    handleLogin,
    forgotPassword,
    checkOtpValidity,
    changePassword,
    isOldPasswordMatched,
    updatePassword,
    verifyGoogleAuthToken
} = require("../controllers/loginController");
const validationHandler = require("../middlewares/common/validationHandler");
const {doLoginValidators, doPasswordChangeValidators} = require("../middlewares/login/loginValidators");
const validateConfirmPassword = require("../middlewares/login/validateConfirmPassword");
const avatarUpload = require("../middlewares/user/avatarUpload");
const {
    addUserValidators,
    addUserValidationHandler,
} = require("../middlewares/user/userValidators");
const {
    doForgotPasswordValidation,
    doForgotPasswordValidityValidation,
} = require("../middlewares/login/forgotPasswordValidator");
const {addUser} = require("../controllers/userController");
const authMiddleware = require("../middlewares/common/authMiddleware");

const router = express.Router();

router.get("/", (req, res, next) => {
    res.status(200).json({message: "Successful!"});
});

router.post("/login", doLoginValidators, validationHandler, handleLogin);
router.post(
    "/registration",
    avatarUpload,
    addUserValidators,
    validateConfirmPassword,
    addUserValidationHandler,
    addUser,
    handleLogin
);
router.post(
    "/forgot-password",
    doForgotPasswordValidation,
    validationHandler,
    forgotPassword
);
router.post(
    "/forgot-password/validate-otp",
    doForgotPasswordValidityValidation,
    validationHandler,
    checkOtpValidity
);

router.post(
    "/change-password",
    validateConfirmPassword,
    validationHandler,
    changePassword
);
router.post(
    "/update-password",
    authMiddleware,
    doPasswordChangeValidators,
    validateConfirmPassword,
    validationHandler,
    isOldPasswordMatched,
    updatePassword
);
router.post('/verify/google-auth-token', verifyGoogleAuthToken)

module.exports = router;
