const asyncHandler = require("express-async-handler");
const foodModel = require("../models/foodModel");
const cloudinary = require("../utils/cloudinary");
const { addItem, getAllItems, removeItem, getItem } = require("./refHandler");

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
exports.addFood = addItem(foodModel);

//get food
exports.getFood = getItem(foodModel);

//get All food
exports.getAllFood = getAllItems(foodModel);

// remove food
exports.removeFood = removeItem(foodModel);
