const mongoose = require("mongoose");
const foodModel = require("./foodModel");

const reviewSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "rating between 1 and 5"],
      max: [5, "rating between 1 and 5"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAverageRatings = async function (foodId) {
  const result = await this.aggregate([
    { $match: { foodId } },
    {
      $group: {
        _id: foodId,
        averageRating: { $avg: "$rating" },
        NumOfRatings: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await foodModel.findByIdAndUpdate(foodId, {
      averageRating: result[0].averageRating.toFixed(2),
      NumOfRatings: result[0].NumOfRatings,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatings(this.foodId);
});

module.exports = mongoose.model("Review", reviewSchema);
