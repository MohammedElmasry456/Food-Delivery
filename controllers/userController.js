const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const cloudinary = require("../utils/cloudinary");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteImage } = require("../utils/deleteImage");
const userModel = require("../models/userModel");

//Set Image To Body
exports.uploadImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "Food-Delivery/User",
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

//create token
const createToken = (id) =>
  JWT.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRE,
  });

//register User
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;
  const user = await userModel.create({ name, email, password, image });
  const token = createToken(user._id);
  res.status(201).send({
    Status: "success",
    Message: "User Created Successfully",
    Data: user,
    token,
  });
});

//login User
exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user || !(await bcryptjs.compare(password, user.password))) {
    return next(new ApiError("Error In Email Or Password"));
  }
  const token = createToken(user._id);
  res.status(200).send({
    Status: "success",
    Message: "User Login Successfully",
    Data: user,
    token,
  });
});
