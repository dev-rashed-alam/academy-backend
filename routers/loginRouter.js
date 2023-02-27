const express = require("express");
const { handleLogin } = require("../controllers/loginController");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidators");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Sucessful!" });
});

router.post("/login", doLoginValidators, doLoginValidationHandler, handleLogin);

module.exports = router;
