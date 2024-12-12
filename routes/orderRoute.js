const express = require("express");
const { placeOrder } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.post("/checkout", authMiddleware, placeOrder);

module.exports = router;
