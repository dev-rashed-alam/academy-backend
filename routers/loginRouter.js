const express = require("express");
const { handleLogin } = require("../controllers/loginController");
const validationHandler = require("../middlewares/common/validationHandler");
const { doLoginValidators } = require("../middlewares/login/loginValidators");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Sucessful!" });
});

router.post("/login", doLoginValidators, validationHandler, handleLogin);

module.exports = router;
