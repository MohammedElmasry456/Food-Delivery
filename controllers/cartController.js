const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/ApiError");

//Add To Cart
exports.addToCart = asyncHandler(async (req, res) => {
  const { cartData } = req.user;
  if (!cartData[req.body.itemId]) {
    cartData[req.body.itemId] = 1;
  } else {
    cartData[req.body.itemId] += 1;
  }

  await userModel.findByIdAndUpdate(req.user._id, { cartData });
  res.status(200).send({
    Status: "success",
    Message: "Item Added Successfully",
    Data: cartData,
  });
});

//Remove From Cart
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const { cartData } = req.user;
  if (cartData[req.body.itemId] > 0) {
    cartData[req.body.itemId] -= 1;
    if (cartData[req.body.itemId] === 0) delete cartData[req.body.itemId];
  } else {
    return next(new ApiError("Item Not Found In Your Cart", 404));
  }

  await userModel.findByIdAndUpdate(req.user._id, { cartData });
  res.status(200).send({
    Status: "success",
    Message: "Item Removed Successfully",
    Data: cartData,
  });
});

//Get Cart
exports.getCart = asyncHandler(async (req, res, next) => {
  const { cartData } = req.user;
  res.status(200).send({
    Status: "success",
    Message: "Item Fetched Successfully",
    Data: cartData,
  });
});
