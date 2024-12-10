const asyncHandler = require("express-async-handler");
const foodModel = require("../models/foodModel");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../utils/cloudinary");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteImage } = require("../utils/deleteImage");

//Set Image To Body
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Food-Delivery/Food",
      transformation: {
        width: 400,
        height: 400,
        crop: "scale",
        quality: "auto",
        fetch_format: "auto",
      },
    });
    req.body.image = result.secure_url;
  }
  next();
});

//add food
exports.addFood = asyncHandler(async (req, res) => {
  const food = await foodModel.create(req.body);
  res.status(201).send({
    Status: "success",
    Message: "Item Created Successfully",
    Data: food,
  });
});

//get All food
exports.getAllFood = asyncHandler(async (req, res) => {
  let query = new ApiFeatures(req.query, foodModel.find())
    .filter()
    .sort()
    .limitfield()
    .search();

  query = query.pagination(await query.calcNumOfDoc());

  const { paginationResult, objQuery } = query;
  const food = await objQuery;
  res.status(200).send({
    Status: "success",
    Message: "Items Fetched Successfully",
    paginationResult,
    numOfDoc: food.length,
    Data: food,
  });
});

// remove food
exports.removeFood = asyncHandler(async (req, res, next) => {
  const food = await foodModel.findByIdAndDelete(req.params.id);
  if (!food) {
    return next(new ApiError("Food Not Found", 404));
  }
  await deleteImage(food.image);
  res.status(204).send();
});
