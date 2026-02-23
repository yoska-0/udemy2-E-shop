/* eslint-disable import/no-extraneous-dependencies */
import { check } from "express-validator";
import slugify from "slugify";
import bcrypt from "bcrypt";
import checkValidation from "../../middlewares/validatorMidleware.js";
import User from "../../models/userModel.js";
import AppError from "../AppError.js";

const createUserValidation = [
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

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((pass, { req }) => {
      if (pass !== req.body.passwordConfirm) {
        throw new Error("password and passwordConfirm must be the same");
      }
      return true;
    }),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("passwordConfirm is required"),

  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("role is invalid"),

  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("phone is invalid"),

  check("profileImage").optional(),

  checkValidation,
];

const deleteUserValidation = [check("id").isMongoId(), checkValidation];

const getOneUserValidation = [check("id").isMongoId(), checkValidation];

const updateUserValidation = [
  check("id").isMongoId(),
  check("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("email is not valid")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),
  checkValidation,
];

const changePasswordValidation = [
  check("currantPassword")
    .notEmpty()
    .withMessage("currantPassword is required"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("new Password Confirm is required"),
  check("password")
    .notEmpty()
    .withMessage("newPassword is required")
    .custom(async (pass, { req }) => {
      //verity current password
      const user = await User.findById(req.params.id);
      if (!user) throw new AppError("there is not user with this id");
      const isCorrectPassword = await bcrypt.compare(
        req.body.currantPassword,
        user.password,
      );
      if (!isCorrectPassword)
        throw new AppError("currant password is not correct");
      // verity password confirm
      if (pass !== req.body.passwordConfirm)
        throw new Error("password and password confirm must be the same");

      return true;
    }),
  checkValidation,
];

const updateLoggedUserData = [
  check("name").custom((val, { req }) => {
    if (val) {
      req.body.slug = slugify(val);
      return true;
    }
  }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("email is not valid")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("email already exists");
      }
      return true;
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("phone is invalid"),
  checkValidation,
];

export default {
  createUserValidation,
  deleteUserValidation,
  getOneUserValidation,
  updateUserValidation,
  changePasswordValidation,
  updateLoggedUserData,
};
