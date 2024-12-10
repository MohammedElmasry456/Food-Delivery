const express = require("express");
const {
  addFood,
  uploadImage,
  getAllFood,
  removeFood,
} = require("../controllers/foodController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();
router
  .route("/")
  .post(upload.single("image"), uploadImage, addFood)
  .get(getAllFood);

router.route("/:id").delete(removeFood);

module.exports = router;
