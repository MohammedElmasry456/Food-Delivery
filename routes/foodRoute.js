const express = require("express");
const {
  addFood,
  uploadImage,
  getAllFood,
  removeFood,
  getFood,
} = require("../controllers/foodController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();
router
  .route("/")
  .post(upload.single("image"), uploadImage, addFood)
  .get(getAllFood);

router.route("/:id").get(getFood).delete(removeFood);

module.exports = router;
