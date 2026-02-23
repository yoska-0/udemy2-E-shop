import express from "express";
import brandController from "../controllers/brandController.js";
import brandValidator from "../utils/validators/brandValidator.js";
import authController from "../controllers/authController.js";

const brandRoute = express.Router();

brandRoute
  .route("/")
  .post(
    authController.protect,
    authController.allowedRoles("admin"),
    brandController.uploadBrandImage,
    brandController.resizeBrandImage,
    brandValidator.createBrandValidation,
    brandController.createBrand,
  )
  .get(brandController.getAllBrands);

brandRoute
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedRoles("admin"),
    brandValidator.deleteBrandValidation,
    brandController.deleteBrand,
  )
  .get(brandValidator.getOneBrandValidation, brandController.getOneBrand)
  .patch(
    authController.protect,
    authController.allowedRoles("admin"),
    brandController.uploadBrandImage,
    brandController.resizeBrandImage,
    brandValidator.updateBrandValidation,
    brandController.updateBrand,
  );

export default brandRoute;
