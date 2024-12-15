const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Food",
        required: true,
      },
      color: String,
      price: Number,
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: "Food Processing",
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
