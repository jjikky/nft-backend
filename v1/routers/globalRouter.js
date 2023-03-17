const express = require("express");
const routes = require("../../routes");
const { home } = require("../controllers/globalController");
const globalRouter = express.Router();

globalRouter.get(routes.home, home);

module.exports = globalRouter;
