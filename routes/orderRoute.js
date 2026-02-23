import express from "express";
import orderController from "../controllers/orderController.js";
import authController from "../controllers/authController.js";

const orderRoute = express.Router();

orderRoute.use(authController.protect);

orderRoute.get("/checkout-session/:cartId", orderController.creatStripeOrder);

orderRoute.route("/:cartId").post(orderController.creatCashOrder);

orderRoute
  .route("/")
  .get(orderController.filterOrdersToLoggedUser, orderController.getAllOreders);

orderRoute.route("/:id").get(orderController.getOneOrder);

orderRoute.patch(
  "/:id/pay",
  authController.allowedRoles("admin"),
  orderController.updateOrderToPaid,
);

orderRoute.patch(
  "/:id/deliver",
  authController.allowedRoles("admin"),
  orderController.updateOrderToDelivered,
);

export default orderRoute;
