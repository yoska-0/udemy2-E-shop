import { check } from "express-validator";
import Review from "../../models/reviewModel.js";
import checkValidation from "../../middlewares/validatorMidleware.js";

const createReviewValidation = [
  check("title").optional(),
  check("rating")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 0 and 5"),
  check("user")
    .notEmpty()
    .withMessage("user is required")
    .isMongoId()
    .withMessage("user id is unvalid")
    .custom(async (val, { req }) => {
      // check if logged user is the same user that create review
      if (req.user._id.toString() !== val) {
        return Promise.reject(
          new Error("You are not allowed to create review for this user"),
        );
      }
      return true;
    }),
  check("product")
    .notEmpty()
    .withMessage("product is required")
    .isMongoId()
    .withMessage("user id is unvalid")
    .custom(async (val, { req }) => {
      // check if user create review for this product
      const review = await Review.findOne({ user: req.user._id, product: val });
      if (review) {
        return Promise.reject(
          new Error("You already created a review for this product"),
        );
      }
      return true;
    }),
  checkValidation,
];

const deleteReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("id is not valid")
    .custom(async (val, { req }) => {
      // check if logged user is the same user that delete his review
      if (req.user.role === "user") {
        const review = await Review.findById(val);
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("You are not allowed to delete this review"),
          );
        }
      }
      return true;
    }),
  checkValidation,
];

const getOneReviewValidation = [
  check("id").isMongoId().withMessage("id is not valid"),
  checkValidation,
];

const updateReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("id is not valid")
    .custom(async (val, { req }) => {
      // check if logged user is the same user that update his review
      const review = await Review.findById(val);
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new Error("You are not allowed to delete this review"),
        );
      }
      return true;
    }),
  check("title").optional(),
  check("rating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 0 and 5"),
  checkValidation,
];

export default {
  createReviewValidation,
  deleteReviewValidation,
  getOneReviewValidation,
  updateReviewValidation,
};
