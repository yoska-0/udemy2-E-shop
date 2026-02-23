import { check } from "express-validator";
import slugify from "slugify";
import checkValidation from "../../middlewares/validatorMidleware.js";
import Category from "../../models/categoryModel.js";
import SupCategory from "../../models/supCategoryModel.js";

const createProductValidation = [
  check("title")
    .notEmpty()
    .withMessage("title is required")
    .isLength({ min: 3 })
    .withMessage("title must be at least 3 characters")
    .isLength({ max: 100 })
    .withMessage("title must be less than 100 characters")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 10 })
    .withMessage("description must be at least 10 characters"),
  check("quantity").isNumeric().withMessage("quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("price is required")
    .isFloat()
    .withMessage("price must be a number")
    .isLength({ max: 10 })
    .withMessage("price must be less than 10 characters"),
  check("priceAfterDiscount")
    .optional()
    .isFloat()
    .withMessage("priceAfterDiscount must be a number")
    .custom((value, { req }) => {
      if (req.body.price <= value)
        throw new Error("priceAfterDiscount must be less than price");
      return true;
    }),
  check("colors").optional().isArray().withMessage("colors must be an array"),
  check("images").optional().isArray().withMessage("images must be an array"),
  check("imageCover").notEmpty().withMessage("imageCover is required"),
  check("category")
    .notEmpty()
    .withMessage("category is required")
    .isMongoId()
    .withMessage("this category is not valid")
    .custom((categoryId) =>
      Category.findById(categoryId).then((category) => {
        if (!category)
          return Promise.reject(
            new Error(`Category not found id => ${categoryId}`),
          );
      }),
    ),
  check("subcategories")
    .optional()
    .isArray()
    .withMessage("subcategories must be an array")
    .isMongoId()
    .withMessage("this supcategory is not valid")
    .custom(async (subcategoriesIds) => {
      const result = await SupCategory.find({ _id: { $in: subcategoriesIds } });
      if (result.length !== subcategoriesIds.length)
        return Promise.reject(new Error("subcategories not found"));
      return true;
    })
    .custom(async (subcategoriesIds, { req }) => {
      const supCategoriesBelowCategory = await SupCategory.find({
        category: req.body.category,
      });
      const supCategoriesBelowCategoryIds = supCategoriesBelowCategory.map(
        (val) => val._id.toString(),
      );
      const isSupCategoryValid = subcategoriesIds.every((val) =>
        supCategoriesBelowCategoryIds.includes(val),
      );
      if (!isSupCategoryValid)
        return Promise.reject(new Error("subcategories not below category"));
      return true;
    }),
  check("brand").optional().isMongoId().withMessage("brand is required"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("ratingsAverage must be between 1 and 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),
  checkValidation,
];

const getOneProductValidation = [
  check("id").isMongoId().withMessage("id is required"),
  checkValidation,
];

const updateProductValidation = [
  check("id").isMongoId().withMessage("id is required"),
  check("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
];

const deleteProductValidation = [
  check("id").isMongoId().withMessage("id is required"),
];

export default {
  createProductValidation,
  getOneProductValidation,
  updateProductValidation,
  deleteProductValidation,
};
