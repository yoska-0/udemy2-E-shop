// eslint-disable-next-line import/no-extraneous-dependencies
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import sendEmail from "../utils/sendEmail.js";
import createToken from "../utils/createToken.js";

const signUp = asyncHandler(async (req, res, next) => {
  // 1) create User
  const user = await User.create(req.body);

  // 2) create JWT
  const token = createToken(user._id);

  // 3) send JWT to client
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

const login = asyncHandler(async (req, res, next) => {
  // get user
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new AppError("email or password not correct", 401));
  }

  // create token
  const token = createToken(user._id);

  // send token to client
  res.status(200).json({
    status: "success",
    name: user.name,
    email: user.email,
    id: user._id,
    token,
  });
});

const protect = asyncHandler(async (req, res, next) => {
  // get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    return next(new AppError("you are not logged in", 401));
  }

  // verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // check if user still exists
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new AppError("user no longer exists", 401));
  }

  // cheak if user changed password
  if (currentUser.changePasswordAt) {
    const changedPasswordTime = parseInt(
      currentUser.changePasswordAt.getTime() / 1000,
      10,
    );
    if (decoded.iat < changedPasswordTime) {
      return next(new AppError("user recently changed password", 401));
    }
  }
  req.user = currentUser;
  next();
});

// get Authorization (premations)
const allowedRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to perform this action", 403),
      );
    }
    next();
  });

// forgot password
const forgotPassword = asyncHandler(async (req, res, next) => {
  // get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with this email", 404));
  }

  // create hash code(6 digit) and save in dataBase
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");

  user.passwordResetCode = resetCodeHash;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save({ validateBeforeSave: false });

  // send email
  try {
    await sendEmail({
      email: user.email,
      subject: "your password reset code",
      message: `your password reset code is ${resetCode}`,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("there was an error sending email", 500));
  }

  res.status(200).json({
    status: "success",
  });
});

const verifyResetCode = asyncHandler(async (req, res, next) => {
  // check if reset code is valid
  // get reset code and convert it to hash
  const resetCodeHash = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  // get user
  const user = await User.findOne({
    passwordResetCode: resetCodeHash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("reset code is invalid or has expired", 400));
  }
  user.passwordResetVerified = true;
  await user.save();
  res.status(200).json({
    status: "success",
  });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  // get user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("there is no user with this email", 404));
  }

  if (!user.passwordResetVerified) {
    return next(new AppError("reset code is invalid or has expired", 400));
  }

  user.password = req.body.newPassword;
  user.changePasswordAt = Date.now();
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = false;

  user.save();

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});
// end of forgot password

export default {
  signUp,
  login,
  protect,
  allowedRoles,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
