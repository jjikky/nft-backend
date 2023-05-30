const express = require("express");
const routes = require("../routes");

const {
  home,
  test,
  mintingImage,
  minting,
} = require("../controllers/userController");
const userRouter = express.Router();

module.exports = userRouter;
