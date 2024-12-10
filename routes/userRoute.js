const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const {
  uploadImage,
  registerUser,
  loginUser,
} = require("../controllers/userController");
const {
  registerUserValidator,
  loginUserValidator,
} = require("../utils/validators/userValidator");

const router = express.Router();

router.post(
  "/register",
  upload.single("image"),
  uploadImage,
  registerUserValidator,
  registerUser
);
router.post("/login", loginUserValidator, loginUser);
// .get(getAllFood);

// router.route("/:id").delete(removeFood);

module.exports = router;
