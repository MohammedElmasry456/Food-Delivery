const errorMiddleWare = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.MOD === "DEV") {
    devError(error, res);
  } else {
    prodError(error, res);
  }
};

const devError = (error, res) => {
  res.status(error.statusCode).send({
    Status: error.status,
    Error: error,
    Message: error.message,
    Stack: error.stack,
  });
};
const prodError = (error, res) => {
  res.status(error.statusCode).send({
    Status: error.status,
    Message: error.message,
  });
};

module.exports = errorMiddleWare;
