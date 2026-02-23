import { check } from "express-validator";
import slugify from "slugify";
import checkValidation from "../../middlewares/validatorMidleware.js";

const createBrandValidation = [
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

const deleteBrandValidation = [check("id").isMongoId(), checkValidation];

const getOneBrandValidation = [check("id").isMongoId(), checkValidation];

const updateBrandValidation = [
  check("id").isMongoId(),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  checkValidation,
];

export default {
  createBrandValidation,
  deleteBrandValidation,
  getOneBrandValidation,
  updateBrandValidation,
};
