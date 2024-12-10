const foodRoute = require("./foodRoute");
const userRoute = require("./userRoute");

exports.routes = (app) => {
  app.use("/api/v1/food", foodRoute);
  app.use("/api/v1/user", userRoute);
};
