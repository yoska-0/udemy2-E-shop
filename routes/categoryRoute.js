import express from "express";
import categoryController from "../controllers/categoryController.js";
import categoryValidator from "../utils/validators/categoryValidator.js";
import supCategoryRoute from "./supCategoryRoute.js";
import authController from "../controllers/authController.js";

const categoryRoute = express.Router();

// if you want get all supcategory from specific category
categoryRoute.use("/:categoryId/sup-category", supCategoryRoute);

categoryRoute
  .route("/")
  .post(
    authController.protect,
    authController.allowedRoles("admin"),
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,
    categoryValidator.createCategoryValidation,
    categoryController.createCategory,
  )
  .get(categoryController.getAllCategories);

categoryRoute
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedRoles("admin"),
    categoryValidator.deleteCategoryValidation,
    categoryController.deletCategory,
  )
  .patch(
    authController.protect,
    authController.allowedRoles("admin"),
    categoryController.uploadCategoryImage,
    categoryController.resizeCategoryImage,
    categoryValidator.updateCategoryValidation,
    categoryController.updateCategory,
  )
  .get(
    categoryValidator.getCategoryValidation,
    categoryController.getOneCategory,
  );

export default categoryRoute;
