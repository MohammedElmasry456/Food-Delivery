const express = require("express");
const {
  addToCart,
  removeFromCart,
  getCart,
} = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.put("/addItem", authMiddleware, addToCart);
router.put("/removeItem", authMiddleware, removeFromCart);

module.exports = router;
