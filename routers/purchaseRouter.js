const express = require("express");
const authMiddleware = require("../middlewares/common/authMiddleware");
const { doPagination } = require("../middlewares/common/paginationMiddleware");
const Purchase = require("../models/Purchase");
const {
  findAllPurchaseList,
  findPurchaseById,
  generatePurchaseOptionalModelChain,
  updatePurchaseById,
} = require("../controllers/purchaseController");
const checkIsValidObjectId = require("../middlewares/common/checkIsValidObjectId");

const router = express.Router();

router.get(
  "/all",
  authMiddleware,
  generatePurchaseOptionalModelChain,
  doPagination(Purchase),
  findAllPurchaseList
);
router.get("/:id", authMiddleware, checkIsValidObjectId, findPurchaseById);

router.put("/:id", authMiddleware, checkIsValidObjectId, updatePurchaseById);

module.exports = router;
