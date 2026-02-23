import express from "express";
import authController from "../controllers/authController.js";
import cartController from "../controllers/cartController.js";

const cartRoute = express.Router();

cartRoute.use(authController.protect, authController.allowedRoles("user"));

cartRoute
  .route("/")
  .post(cartController.addItemToCart)
  .get(cartController.getCartFromLoggedUser)
  .delete(cartController.clearMyCart);

cartRoute
  .route("/:cartItemId")
  .delete(cartController.removeItemFromCart)
  .patch(cartController.updateQuantity);

cartRoute.put("/applyCoupon", cartController.applyCoupon);

export default cartRoute;
