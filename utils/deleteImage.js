const cloudinary = require("./cloudinary");

exports.deleteImage = async (image) => {
  let imageId;
  if (image) {
    imageId = image.split("/").slice(-3).join("/").split(".")[0];
    const result = await cloudinary.uploader.destroy(imageId);
    console.log(result);
  }
};
