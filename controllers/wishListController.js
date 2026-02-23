import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const addProductTOWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "product added to wish list",
    data: user.wishList,
  });
});

const removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true },
  );
  res.status(200).json({
    status: "success",
    message: "product removed from wish list",
    data: user.wishList,
  });
});

const getWishListFromLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    data: user.wishList,
  });
});

export default {
  addProductTOWishList,
  removeProductFromWishList,
  getWishListFromLoggedUser,
};
