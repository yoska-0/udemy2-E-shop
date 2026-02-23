import asyncHandler from "express-async-handler";
import Cart from "../models/cartModel.js";
import Product from "../models/prodactModel.js";
import AppError from "../utils/AppError.js";
import Coupon from "../models/couponModel.js";

const calculatTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  return totalPrice;
};

const addItemToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!cart) {
    const newCart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
      totalPrice: product.price,
    });
  } else {
    // if this prodect exist , incress quintaity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color,
    );

    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // if this prodect not exist , add new
      cart.cartItems.push({ product: productId, color, price: product.price });
    }

    await cart.save();
  }

  cart.totalPrice = calculatTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart",
    data: cart,
  });
});

const getCartFromLoggedUser = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  res.status(200).json({
    status: "success",
    namerOfItems: cart.cartItems.length,
    data: cart,
  });
});

const removeItemFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.cartItemId } },
    },
    { new: true },
  );

  cart.totalPrice = calculatTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    namerOfItems: cart.cartItems.length,
    data: cart,
  });
});

const clearMyCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

const updateQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  const productIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId,
  );

  if (productIndex > -1) {
    cart.cartItems[productIndex].quantity = req.body.quantity;
  } else {
    return next(new AppError("Product not found", 404));
  }

  cart.totalPrice = calculatTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    namerOfItems: cart.cartItems.length,
    data: cart,
  });
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expiry: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new AppError("coupon is not valid", 404));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  // eslint-disable-next-line prefer-destructuring
  const totalPrice = cart.totalPrice;
  const totalAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalAfterDiscount = totalAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    namerOfItems: cart.cartItems.length,
    data: cart,
  });
});

export default {
  addItemToCart,
  getCartFromLoggedUser,
  removeItemFromCart,
  clearMyCart,
  updateQuantity,
  applyCoupon,
};
