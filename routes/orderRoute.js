const express = require("express");
const {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.get("/", getAllOrders);
router.get("/loggedUser", authMiddleware, getUserOrders);
router.post("/checkout", authMiddleware, placeOrder);
router.put("/:id", updateOrderStatus);

module.exports = router;
