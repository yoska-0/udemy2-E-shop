import { check } from "express-validator";
import slugify from "slugify";
import checkValidation from "../../middlewares/validatorMidleware.js";

const getCategoryValidation = [check("id").isMongoId(), checkValidation];

const createCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be at least 3 characters")
    .isLength({ max: 32 })
    .withMessage("name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  checkValidation,
];

const updateCategoryValidation = [
  check("id").isMongoId(),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  checkValidation,
];
const deleteCategoryValidation = [check("id").isMongoId(), checkValidation];

export default {
  getCategoryValidation,
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
};
