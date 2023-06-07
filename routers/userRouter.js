const express = require("express");
const routes = require("../routes");
const { signUp } = require("../controllers/authController");
const {
  getAllUsers,
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const userRouter = express.Router();

// authController
userRouter.route(routes.signUp).post(signUp);

// userController
userRouter.route(routes.home).get(getAllUsers).post(createUser);

userRouter
  .route("/:id")
  .get(getSingleUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = userRouter;
