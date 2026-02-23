import { check } from "express-validator";
import slugify from "slugify";
import checkValidation from "../../middlewares/validatorMidleware.js";

const createSupCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 2 })
    .withMessage("name must be at least 2 characters")
    .isLength({ max: 32 })
    .withMessage("name must be less than 32 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("category is required"),
  checkValidation,
];

const getSpacificSupCategoryValidation = [
  check("id").isMongoId(),
  checkValidation,
];

const updateSupCategoryValidation = [
  check("id").isMongoId(),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  checkValidation,
];

const deleteSupCategoryValidation = [check("id").isMongoId(), checkValidation];

export default {
  createSupCategoryValidation,
  getSpacificSupCategoryValidation,
  updateSupCategoryValidation,
  deleteSupCategoryValidation,
};
