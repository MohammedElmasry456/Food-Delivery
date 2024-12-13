const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const {
  setUserId,
  addReview,
  getAllReviews,
  getReview,
  removeReview,
  updateReview,
  allowedToYou,
} = require("../controllers/reviewController");

const router = express.Router();
router.route("/").post(authMiddleware, setUserId, addReview).get(getAllReviews);

router
  .route("/:id")
  .get(getReview)
  .put(authMiddleware, allowedToYou, updateReview)
  .delete(authMiddleware, allowedToYou, removeReview);

module.exports = router;
