const { check } = require("express-validator");
const userModel = require("../../models/userModel");
const {
  validationMiddleware,
} = require("../../middlewares/validatorMiddleware");

exports.registerUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("Name Is Required")
    .isLength({ min: 2 })
    .withMessage("Length Of Name Is Less Than 2 Character"),
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email")
    .custom((val) =>
      userModel.findOne({ email: val }).then((res) => {
        if (res) {
          return Promise.reject(new Error("Email Is Already Exist"));
        }
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("Password Is Required")
    .custom((val) => {
      if (val.length < 8) {
        throw new Error("Passwod Must Be Strong");
      }
      return true;
    }),
  validationMiddleware,
];

exports.loginUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email Is Required")
    .isEmail()
    .withMessage("Invalid Email"),
  check("password").notEmpty().withMessage("Password Is Required"),
  validationMiddleware,
];
