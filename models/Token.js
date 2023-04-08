const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  name: String,
  hash: String,
});

const model = mongoose.model("Token", TokenSchema);

module.exports = model;
