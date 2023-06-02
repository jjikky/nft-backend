const mongoose = require("mongoose");

const NFTSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A NFT must have a name"],
    // unique: true,
    // trim: true,
    // maxlength: [40, "nft must have 40 character"],
    // minlength: [10, "nft must have 10 character"],
  },
  duration: {
    type: String,
    required: [true, "must provide duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "must have difficulty"],
    // enum: {
    //   values: ["easy", "medium", "difficulty"],
    //   message: "Difficulty is either: easy, medium and difficulty",
    // },
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    //   min: [1, "must have 1"],
    //   max: [5, "must have 5"],
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A NFT must have price"],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: "Discount price ({VALUE}) should be below regular price",
    },
  },
  summary: {
    type: String,
    trim: true,
    required: [true, "must provide the summary"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, "must provide the cover image"],
  },
  images: [String],

  startDates: [Date],
  secretNfts: {
    type: Boolean,
    default: false,
  },
});

const model = mongoose.model("NFT", NFTSchema);

module.exports = model;
