const express = require("express");
const routes = require("../routes");
const { upload } = require("../utils/multer");

// 기타 express 코드

const {
  home,
  test,
  mintingImage,
  minting,
  getNfts,
} = require("../controllers/nftController");
const nftRouter = express.Router();

nftRouter.get(routes.home, home);
nftRouter.get(routes.test, test);

nftRouter.get(routes.minting, minting);

nftRouter.post(routes.minting, upload.single("image"), mintingImage);

nftRouter.get(routes.nfts, getNfts);

module.exports = nftRouter;
