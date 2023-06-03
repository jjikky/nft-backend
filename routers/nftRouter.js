const express = require("express");
const routes = require("../routes");
// const { upload } = require("../utils/multer");

const {
  // test,
  // mintingImage,
  // minting,
  getAllNfts,
  createNFT,
  getSingleNFT,
  updateNFT,
  deleteNFT,
  checkId,
  checkBody,
  topRateNfts,
  getStats,
  getMonthlyPlan,
} = require("../controllers/nftController");
const nftRouter = express.Router();

// nftRouter.get(routes.test, test);
// nftRouter.get(routes.minting, minting);
// nftRouter.post(routes.minting, upload.single("image"), mintingImage);
// nftRouter
//   .route(routes.minting)
//   .get(minting)
//   .post(upload.single("image"), mintingImage);

nftRouter.param("id", checkId);

//TOP 5 NFTs BY PRICE
nftRouter.route(routes.topRateNfts).get(topRateNfts, getAllNfts);

//STATS AGGREGATION PIPELINE
nftRouter.route(routes.stats).get(getStats);

//GET MONTHLY PLAN
nftRouter.route(routes.monthlyPlan).get(getMonthlyPlan);

//ROUTER NFTs
nftRouter.route(routes.home).get(getAllNfts).post(createNFT);
// .post(checkBody, createNFT);

nftRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = nftRouter;
