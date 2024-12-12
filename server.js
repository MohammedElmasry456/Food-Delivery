const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ path: ".env" });
const ApiError = require("./utils/ApiError");
const errorMiddleWare = require("./middlewares/errorMiddleware");
const db_connection = require("./config/db");
const { routes } = require("./routes");
const { webhookCheckout } = require("./controllers/orderController");

//app config
const app = express();
const port = process.env.PORT || 5000;

//database connection
db_connection();

//middlewares
app.use(express.json());
app.use(cors());
if (process.env.MOD === "DEV") app.use(morgan("dev"));
app.post(
  "/checkout-session",
  express.json({ type: "application/json" }),
  webhookCheckout
);

//mount routes
app.get("/", (req, res) => {
  res.send("API Working");
});
routes(app);
app.all("*", (req, res, next) => {
  next(new ApiError("Page Not Found", 404));
});

//Handle Errors
app.use(errorMiddleWare);

const server = app.listen(port, () => {
  console.log(`Server Run On http://localhost:${port}`);
});

//Handle Error Outside Express
process.on("unhandledRejection", (error) => {
  console.log(`unhandled Rejection Error | ${error.name} | ${error.message}`);
  server.close(() => {
    console.log("Server Shutting Down ....");
    process.exit(1);
  });
});
