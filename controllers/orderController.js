const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/ApiError");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

//Add To Cart
exports.placeOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.create({ userId: req.user._id, ...req.body });
  await userModel.findByIdAndUpdate(req.user._id, { cartData: {} });

  const listItems = req.body.items.map((item) => ({
    price_data: {
      currency: "egp",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  listItems.push({
    price_data: {
      currency: "egp",
      product_data: {
        name: "Delivery Charges",
      },
      unit_amount: 20 * 100,
    },
    quantity: 1,
  });

  const session = await stripe.checkout.sessions.create({
    line_items: listItems,
    mode: "payment",
    customer_email: req.user.email,
    success_url: `${process.env.URL}/api/v1/food`,
    cancel_url: `${process.env.URL}/api/v1/cart`,
  });
  res.status(200).send({
    Status: "Success",
    Message: "Order Created Successfully",
    data: order,
    session,
  });
});
