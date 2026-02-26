// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from "stripe";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
import Product from "../models/prodactModel.js";
import AppError from "../utils/AppError.js";
import factor from "./factoryHandelar.js";

dotenv.config({ path: "./config.env" });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const creatCashOrder = asyncHandler(async (req, res, next) => {
  // get a cart
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  //app setings
  const taxPrice = cart.taxPrice || 0;
  const shippingPrice = cart.shippingPrice || 0;

  // get order price
  const orderPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;
  // create an order
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    taxPrice: cart.taxPrice,
    shippingPrice: cart.shippingPrice,
    totalPrice: totalOrderPrice,
  });

  // incress sold and decress quaintity

  if (order) {
    const optionsBulk = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { sold: +item.quantity, quantity: -item.quantity } },
      },
    }));

    await Product.bulkWrite(optionsBulk);

    // clear cart
    await Cart.findOneAndDelete(req.params.cartId);
  }

  res.status(201).json({
    status: "success",
    order,
  });
});

const filterOrdersToLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") {
    req.filtterObj = { user: req.user._id };
  }
  next();
});

const getAllOreders = factor.getAll(Order);

const getOneOrder = factor.getOne(Order);

const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    order: updatedOrder,
  });
});

const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();
  res.status(200).json({
    status: "success",
    order: updatedOrder,
  });
});

const creatStripeOrder = asyncHandler(async (req, res, next) => {
  // get a cart
  const cart = await Cart.findById(req.params.cartId);

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }
  //app setings
  const taxPrice = cart.taxPrice || 0;
  const shippingPrice = cart.shippingPrice || 0;

  // get order price
  const orderPrice = cart.totalAfterDiscount
    ? cart.totalAfterDiscount
    : cart.totalPrice;

  const totalOrderPrice = orderPrice + taxPrice + shippingPrice;

  // create session stripe
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, price_1234) of the product you want to sell

        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/v1/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/v1/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
  });

  res.status(201).json({
    status: "success",
    session,
  });
});

const checkWebHook = (req, res) => {
  let event;
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }
  console.log("doneeeeeeeeeeeeeeeeeee");
  console.log(event.type);
  console.log("doneeeeeeeeeeeeeeeeeee");
};

export default {
  creatCashOrder,
  filterOrdersToLoggedUser,
  getAllOreders,
  getOneOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  creatStripeOrder,
  checkWebHook,
};
