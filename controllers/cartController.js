const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");
const cartModel = require("../models/cartModel");
const foodModel = require("../models/foodModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.map((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalPrice = totalPrice;
};

//Add To Cart
exports.addToCart = asyncHandler(async (req, res) => {
  let cart = await cartModel.findOne({ userId: req.user._id });
  const { foodId, color } = req.body;
  const food = await foodModel.findById(foodId);
  if (!cart) {
    cart = await cartModel.create({
      userId: req.user._id,
      cartItems: [{ foodId, price: food.price, color }],
    });
  } else {
    const foodExist = cart.cartItems.findIndex(
      (item) => item.foodId.toString() === foodId && item.color === color
    );
    if (foodExist !== -1) {
      cart.cartItems[foodExist].quantity += 1;
    } else {
      cart.cartItems.push({ foodId, price: food.price, color });
    }
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    Status: "success",
    Message: "Item Added Successfully",
    data: cart,
  });
});

//Remove From Cart
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  let cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }
  cart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    { $pull: { cartItems: { _id: req.body.itemId } } },
    { new: true }
  );

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    Status: "success",
    Message: "Item Removed Successfully",
    Data: cart,
  });
});

//update Cart Quantity
exports.updateCartQuantity = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  const { itemId, quantity } = req.body;
  if (!cart) {
    return next(new ApiError("You Don't Have Cart Yet", 404));
  }
  const foodExist = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
  if (foodExist > -1) {
    cart.cartItems[foodExist].quantity = quantity;
  } else {
    return next(new ApiError("There Is No Item For This Id", 404));
  }

  calcTotalPrice(cart);
  await cart.save();
  res.status(200).send({
    Status: "success",
    Message: "Item updated Successfully",
    Data: cart,
  });
});

//Get Cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const cartData = await cartModel
    .findOne({ userId: req.user._id })
    .populate({ path: "cartItems.foodId", select: "name" });
  if (!cartData) {
    return next(new ApiError("You Don.t Have Cart Yet", 404));
  }
  res.status(200).send({
    Status: "success",
    Message: "Item Fetched Successfully",
    Data: cartData,
  });
});
