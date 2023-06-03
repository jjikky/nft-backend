const HOME = "/";
const NFTS = "/api/v1/nfts";
const TOP_RATE_NFTS = "/top-rate";
const MONTHLY_PLAN = "/monthly-plan/:year";
const STATS = "/stats";
const USERS = "/api/v1/users";
// const MINTING = "/minting";
// const TEST = "/test";

// const NAME = "/name/:name";

const routes = {
  // nftRouter
  nfts: NFTS,
  nfts: NFTS,
  topRateNfts: TOP_RATE_NFTS,
  stats: STATS,
  monthlyPlan: MONTHLY_PLAN,
  // test: TEST
  // minting: MINTING,

  users: USERS,
  home: HOME,
};

module.exports = routes;
