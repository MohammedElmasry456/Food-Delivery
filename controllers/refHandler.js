const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const ApiFeatures = require("../utils/apiFeatures");
const { deleteImage } = require("../utils/deleteImage");
const reviewModel = require("../models/reviewModel");

//add Item
exports.addItem = (model) =>
  asyncHandler(async (req, res) => {
    const Item = await model.create(req.body);
    res.status(201).send({
      Status: "success",
      Message: "Item Created Successfully",
      Data: Item,
    });
  });

//get All Items
exports.getAllItems = (model) =>
  asyncHandler(async (req, res) => {
    let query = new ApiFeatures(req.query, model.find())
      .filter()
      .sort()
      .limitfield()
      .search();

    query = query.pagination(await query.calcNumOfDoc());

    const { paginationResult, objQuery } = query;
    const Items = await objQuery;
    res.status(200).send({
      Status: "success",
      Message: "Items Fetched Successfully",
      paginationResult,
      numOfDoc: Items.length,
      Data: Items,
    });
  });

// remove Item
exports.removeItem = (model) =>
  asyncHandler(async (req, res, next) => {
    const filter = req.filter_ ? req.filter_ : { _id: req.params.id };
    const Item = await model.findOneAndDelete(filter);
    if (!Item) {
      return next(new ApiError("Item Not Found Or Not Allowed To You", 404));
    }
    await deleteImage(Item.image);
    if (model === reviewModel) await model.calcAverageRatings(Item.foodId);
    res.status(204).send();
  });

// get Item
exports.getItem = (model) =>
  asyncHandler(async (req, res, next) => {
    const filter = req.filter_ ? req.filter_ : { _id: req.params.id };
    const Item = await model.findOne(filter);
    if (!Item) {
      return next(new ApiError("Item Not Found Or Not Allowed To You", 404));
    }
    res.status(200).send({
      Status: "success",
      Message: "Item Featched Successfully",
      Data: Item,
    });
  });

// update Item
exports.updateItem = (model) =>
  asyncHandler(async (req, res, next) => {
    const filter = req.filter_ ? req.filter_ : { _id: req.params.id };
    const Item = await model.findOneAndUpdate(filter, req.body, {
      new: true,
    });
    if (!Item) {
      return next(new ApiError("Item Not Found Or Not Allowed To You", 404));
    }
    await Item.save();
    res.status(200).send({
      Status: "success",
      Message: "Item Updated Successfully",
      Data: Item,
    });
  });
