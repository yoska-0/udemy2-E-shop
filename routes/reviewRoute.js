import express from "express";
import reviewController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";
import reviewValidator from "../utils/validators/reviewValidator.js";

const reviewRoute = express.Router({ mergeParams: true });

reviewRoute
  .route("/")
  .post(
    authController.protect,
    reviewController.setProductIdToBody,
    reviewValidator.createReviewValidation,
    reviewController.createReview,
  )
  .get(
    reviewController.createFilterObjForProduct,
    reviewController.getAllReviews,
  );

reviewRoute
  .route("/:id")
  .delete(
    authController.protect,
    authController.allowedRoles("admin", "user"),
    reviewValidator.deleteReviewValidation,
    reviewController.deleteReview,
  )
  .get(reviewController.getOneReview)
  .patch(
    authController.protect,
    authController.allowedRoles("admin", "user"),
    reviewValidator.updateReviewValidation,
    reviewController.updateReview,
  );

export default reviewRoute;
