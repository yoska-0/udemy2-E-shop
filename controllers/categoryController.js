import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import factoryHandelar from "./factoryHandelar.js";
import uploadImage from "../middlewares/uploadImageMidelWare.js";

const uploadCategoryImage = uploadImage.uploadSingleImage();

const resizeCategoryImage = asyncHandler(async (req, res, next) => {
  const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600, { fit: "fill" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/category/${fileName}`);

    // save image to body
    req.body.image = fileName;
  }
  next();
});

// get all categories
const getAllCategories = factoryHandelar.getAll(Category);

//get one category
const getOneCategory = factoryHandelar.getOne(Category);

// create new category
const createCategory = factoryHandelar.createOne(Category);

// update category
const updateCategory = factoryHandelar.updateOne(Category);

// delet category
const deletCategory = factoryHandelar.delateOne(Category);
export default {
  createCategory,
  deletCategory,
  getAllCategories,
  updateCategory,
  getOneCategory,
  uploadCategoryImage,
  resizeCategoryImage,
};
