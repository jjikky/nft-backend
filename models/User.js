const mongoose = require("mongoose");
// const slugify = require("slugify");
const validator = require("validator");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // working only create , once
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  passwordChangedAt: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  inputPassword,
  userPassword
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

UserSchema.methods.changedPasswordAfterToken = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); // passwordChanges At is "miliseconds", so  converted to "seconds"
    return JWTTimestamp < changedTimeStamp; // JWTTIMEstamp: 발급시점. 이후에 pwd 변경이면 다시 발급해야지
  }
  return false;
};

const model = mongoose.model("User", UserSchema);

module.exports = model;
