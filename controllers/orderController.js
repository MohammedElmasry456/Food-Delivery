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

exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  let event = req.body;
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  if (event.type === "checkout.session.completed") {
    console.log("Create Order Here");
    console.log(event.data);
  }

  res.status(200).send();
});
