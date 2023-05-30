const createError = require("http-errors");
const express = require("express");
const morgan = require("morgan"); // 로그
const helmet = require("helmet"); // 기초 보안 설정
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const routes = require("./routes");
const v1_nftRouter = require("./routers/nftRouter");
const { localsMiddleware } = require("./middlewares/middleware");
const fs = require("fs");
const path = require("path");
const { expressCspHeader, INLINE, NONE, SELF } = require("express-csp-header");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use("/static", express.static((__dirname, "static")));
const nunjucks = require("nunjucks");
nunjucks.configure("views", {
  express: app,
  watch: true, // html 파일이 변경될 때, 템플릿 엔진을 다시 렌더링
});
app.use(helmet());
app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // 우선 프론트 local url
app.use(
  expressCspHeader({
    directives: {
      "script-src": [
        SELF,
        INLINE,
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "https://kit.fontawesome.com",
      ],
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev")); // 배포시 combined로
app.use(localsMiddleware);

app.use(routes.v1, v1_nftRouter);
app.get(routes.home, (req, res) => {
  res.send("home");
});

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
