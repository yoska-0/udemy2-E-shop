import express from "express";
import supCategoryController from "../controllers/supCategoryController.js";
import supCategoryValidator from "../utils/validators/supCategoryValidator.js";
import authController from "../controllers/authController.js";

const supCategoryRoute = express.Router({ mergeParams: true });

supCategoryRoute
  .route("/")
  .post(
    authController.protect,
    authController.allowedRoles("admin"),
    supCategoryController.setCategoryIdToBody,
    supCategoryValidator.createSupCategoryValidation,
    supCategoryController.createSupCategory,
  )
  .get(
    supCategoryController.createFilterObj,
    supCategoryController.getAllSupCategory,
  );

supCategoryRoute
  .route("/:id")
  .get(
    supCategoryValidator.getSpacificSupCategoryValidation,
    supCategoryController.getOneSupCategory,
  )
  .patch(
    authController.protect,
    authController.allowedRoles("admin"),
    supCategoryValidator.updateSupCategoryValidation,
    supCategoryController.updateSupCategory,
  )
  .delete(
    authController.protect,
    authController.allowedRoles("admin"),
    supCategoryValidator.deleteSupCategoryValidation,
    supCategoryController.deleteSupCategory,
  );

export default supCategoryRoute;
