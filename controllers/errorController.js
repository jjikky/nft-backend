const appError = require("../utils/appError");

//handlers
const handleCasetError = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new appError(message, 400);
};
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(?<=")(?:\\.|[^"\\])*(?=")/);
  const message = `Duplicate field values : ${value}.`;
  return new appError(message, 400);
};
const handleValidationsError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input Data. ${errors.join(". ")}`;
  return new appError(message, 400);
};

const handleJWTError = () => {
  return new appError("Invalud token, Please Login again", 401);
};

const handleTokenExpiredError = () => {
  return new appError("Your Token got expired. Please Login again", 401);
};

//send
const sendErrorDev = (res, err) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorPro = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "sometihng went worng",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.name === "CastError") err = handleCasetError(err);
  if (err.code === 11000) err = handleDuplicateKeyError(err);
  if (err.name === "ValidationError") err = handleValidationsError(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError();
  if (err.name === "TokenExpiredError") err = handleTokenExpiredError();

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorPro(res, err);
  }

  next();
};
