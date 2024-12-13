const cartRoute = require("./cartRoute");
const foodRoute = require("./foodRoute");
const orderRoute = require("./orderRoute");
const reviewRoute = require("./reviewRoute");
const userRoute = require("./userRoute");

exports.routes = (app) => {
  app.use("/api/v1/food", foodRoute);
  app.use("/api/v1/user", userRoute);
  app.use("/api/v1/cart", cartRoute);
  app.use("/api/v1/order", orderRoute);
  app.use("/api/v1/review", reviewRoute);
};
