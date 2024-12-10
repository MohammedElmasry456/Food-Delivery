const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Image Only", 400), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
