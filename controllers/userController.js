// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from "bcrypt";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import factoryHandelar from "./factoryHandelar.js";
import uploadImage from "../middlewares/uploadImageMidelWare.js";
import AppError from "../utils/AppError.js";
import createToken from "../utils/createToken.js";

//upload image
const uploadUserImage = uploadImage.uploadSingleImage("profileImage");

// resize image
const resizeUserImage = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600, { fit: "fill" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/user/${fileName}`);

    // save image to body
    req.body.profileImage = fileName;
  }

  next();
});

// to create new user
const createUser = factoryHandelar.createOne(User);
// to delet user
const deleteUser = factoryHandelar.delateOne(User);

//to get all users
const getAllUsers = factoryHandelar.getAll(User);

// to get one user
const getOneUser = factoryHandelar.getOne(User);

// to update user
const updateUser = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
      role: req.body.role,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!document) return next(new AppError("Object not found", 404));
  res.status(200).json({
    success: true,
    message: "Object updated successfully",
    document,
  });
});

// to change password

const changePassword = asyncHandler(async (req, res, next) => {
  const document = await User.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!document) return next(new AppError("Object not found", 404));
  res.status(200).json({
    success: true,
    message: "Object updated successfully",
    document,
  });
});

// to get user profile
const getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// to change password logged user
const changeMyPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    {
      new: true,
      runValidators: true,
    },
  );

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

// to update logged user data
const updateLoggedUserData = asyncHandler(async (req, res, next) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const { password, role, ...updateData } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    user,
  });
});

// to delete my account
const deleteMyAccount = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);

  res.status(200).json({
    status: "success",
  });
});

export default {
  createUser,
  deleteUser,
  getAllUsers,
  getOneUser,
  updateUser,
  uploadUserImage,
  resizeUserImage,
  changePassword,
  getMe,
  changeMyPassword,
  updateLoggedUserData,
  deleteMyAccount,
};
