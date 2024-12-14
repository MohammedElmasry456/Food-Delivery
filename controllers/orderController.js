const asyncHandler = require("express-async-handler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/ApiError");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const cartModel = require("../models/cartModel");

//Add To Cart
exports.placeOrder = asyncHandler(async (req, res) => {
  const cart = await cartModel
    .findOne({ userId: req.user._id })
    .populate({ path: "cartItems.foodId", select: "name image" });
  const listItems = cart.cartItems.map((item) => ({
    price_data: {
      currency: "egp",
      product_data: {
        name: item.foodId.name,
        images: [item.foodId.image],
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
    client_reference_id: cart._id.toString(),
    success_url: `${process.env.URL}/api/v1/food`,
    cancel_url: `${process.env.URL}/api/v1/cart`,
  });
  res.status(200).send({
    Status: "Success",
    session,
  });
});

const createOrder = async (cartId, email, totalPrice) => {
  console.log("after create");
  const user = await userModel.findOne({ email });
  const order = await orderModel.create({
    userId: user._id,
    cartId,
    totalPrice: totalPrice / 100,
  });
  console.log(order);
};

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

  let order;
  if (event.type === "checkout.session.completed") {
    console.log("before create");
    createOrder(
      event.data.object.client_reference_id,
      event.data.object.customer_email,
      event.data.object.amount_total
    );
  }

  res.status(200).send({ Message: "Order Created Successfully", data: order });
});

// get User Orders
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find({ userId: req.user._id });
  res.status(200).send({
    Status: "success",
    Message: "Orders Fetched Successfully",
    data: orders,
  });
});

// get All Orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await orderModel.find({});
  res.status(200).send({
    Status: "success",
    Message: "Orders Fetched Successfully",
    data: orders,
  });
});

//update order status
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return next(new ApiError("Order Not Found", 404));
  }
  res.status(200).send({
    Status: "success",
    Message: "Status Updated Successfully",
    data: order,
  });
});
