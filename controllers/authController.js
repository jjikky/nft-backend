const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  //   const newUser = await User.create(req.body);

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "Success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new appError("Please provide your email and password", 401));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect email and password", 401));
  }
  const token = signToken(user._id);
  res.status(200).json({ status: "success", token, user });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token)
    return next(new appError("You are not logged in to get access", 401));

  // validate token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //   console.log(decoded); //{ id: '648052cc...', iat: 1686137103, exp: 1686569103 }

  // user exist
  const protectUser = await User.findById(decoded.id);
  if (!protectUser) {
    new appError("The user who received this token has been deleted", 401);
  }

  // if password changed
  if (protectUser.changedPasswordAfterToken(decoded.iat)) {
    return next(
      new appError("password changed recently,  Please Login again", 401)
    );
  }

  req.user = protectUser;
  next();
});
