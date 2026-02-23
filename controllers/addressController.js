import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Address added to user",
    data: user.address,
  });
});

const removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "Address removed from user",
    data: user.address,
  });
});

const getAddressListFromLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("address");
  res.status(200).json({
    status: "success",
    data: user.address,
  });
});

export default {
  addAddress,
  removeAddress,
  getAddressListFromLoggedUser,
};
