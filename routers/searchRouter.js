const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const { doGlobalSearch } = require("../controllers/searchController");

const Router = express.Router();

Router.get("/", authMiddleware, doGlobalSearch);

module.exports = Router;
