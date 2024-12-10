const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    cartData: {
      type: Object,
      default: {},
    },
  },
  { minimize: false }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
