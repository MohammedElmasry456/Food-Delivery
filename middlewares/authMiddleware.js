const asyncHandler = require("express-async-handler");
const JWT = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const userModel = require("../models/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new ApiError("Not Authorized, Please Login Again"));
  }
  const token = req.headers.authorization.split(" ")[1];
  const decode = JWT.verify(token, process.env.JWT_SECRET);
  const user = await userModel.findById(decode.userId);
  req.user = user;
  next();
});

module.exports = authMiddleware;
