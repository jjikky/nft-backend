const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  name: String,
  price: Number,
  explanation: String,
  company: String,
  category: String,
});

const model = mongoose.model("Test", TestSchema);

module.exports = model;
