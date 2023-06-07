const User = require("./../models/User");
const catchAsync = require("./../utils/catchAsync");

exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });

  res.status(201).json({
    status: "Success",
    data: {
      user: newUser,
    },
  });
});
