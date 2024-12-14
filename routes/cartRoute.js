const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartQuantity,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.put("/addItem", authMiddleware, addToCart);
router.put("/removeItem", authMiddleware, removeFromCart);
router.put("/updateQuantity", authMiddleware, updateCartQuantity);

module.exports = router;
