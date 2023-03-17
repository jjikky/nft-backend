const routes = require("../routes");

exports.localsMiddleware = (req, res, next) => {
  res.locals.siteName = "local test";
  res.locals.routes = routes;
  next();
};
