import express from "express";
import productController from "../controllers/productController.js";
import productValidator from "../utils/validators/productValidator.js";
import authController from "../controllers/authController.js";
import reviewRoute from "./reviewRoute.js";

const productRoute = express.Router();

// nested route to get all review from specific product
productRoute.use("/:productId/reviews", reviewRoute);

productRoute
  .route("/")
  .post(
    authController.protect,
    authController.allowedRoles("admin"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productValidator.createProductValidation,
    productController.createProduct,
  )
  .get(productController.getAllProduct);

productRoute
  .route("/:id")
  .get(
    productValidator.getOneProductValidation,
    productController.getOneProduct,
  )
  .patch(
    authController.protect,
    authController.allowedRoles("admin"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productValidator.updateProductValidation,
    productController.updateProduct,
  )
  .delete(
    authController.protect,
    authController.allowedRoles("admin"),
    productValidator.deleteProductValidation,
    productController.deletProduct,
  );

export default productRoute;
