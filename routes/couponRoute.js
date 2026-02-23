import express from "express";
import couponController from "../controllers/couponController.js";
import authController from "../controllers/authController.js";

const couponRoute = express.Router();

couponRoute.use(authController.protect, authController.allowedRoles("admin"));

couponRoute
  .route("/")
  .post(couponController.createCoupon)
  .get(couponController.getAllCoupons);

couponRoute
  .route("/:id")
  .get(couponController.getOneCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

export default couponRoute;
