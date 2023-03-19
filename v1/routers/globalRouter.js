const express = require("express");
const routes = require("../../routes");
const { upload } = require("../../utils/multer");

// 기타 express 코드

const {
  home,
  mintingImage,
  minting,
} = require("../controllers/globalController");
const globalRouter = express.Router();

globalRouter.get(routes.home, home);

globalRouter.get(routes.minting, minting);

globalRouter.post(routes.minting, upload.single("image"), mintingImage);

module.exports = globalRouter;
