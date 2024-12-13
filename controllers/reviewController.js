const asyncHandler = require("express-async-handler");
const {
  addItem,
  getAllItems,
  removeItem,
  getItem,
  updateItem,
} = require("./refHandler");
const reviewModel = require("../models/reviewModel");

exports.setUserId = asyncHandler(async (req, res, next) => {
  req.body.userId = req.user._id;
  next();
});
exports.allowedToYou = asyncHandler(async (req, res, next) => {
  req.filter_ = { _id: req.params.id, userId: req.user._id };
  next();
});

//add Review
exports.addReview = addItem(reviewModel);

//get Review
exports.getReview = getItem(reviewModel);

//get All Review
exports.getAllReviews = getAllItems(reviewModel);

// update Review
exports.updateReview = updateItem(reviewModel);

// remove Review
exports.removeReview = removeItem(reviewModel);
