import express from "express";
import authController from "../controllers/authController.js";
import wishListController from "../controllers/wishListController.js";

const wishListRoute = express.Router();

wishListRoute.use(authController.protect, authController.allowedRoles("user"));

wishListRoute
  .route("/")
  .post(wishListController.addProductTOWishList)
  .get(wishListController.getWishListFromLoggedUser);

wishListRoute
  .route("/:productId")
  .delete(wishListController.removeProductFromWishList);

export default wishListRoute;
