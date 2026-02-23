import express from "express";
import authController from "../controllers/authController.js";
import addressController from "../controllers/addressController.js";

const addressRoute = express.Router();

addressRoute.use(authController.protect, authController.allowedRoles("user"));

addressRoute
  .route("/")
  .post(addressController.addAddress)
  .get(addressController.getAddressListFromLoggedUser);

addressRoute.route("/:addressId").delete(addressController.removeAddress);

export default addressRoute;
