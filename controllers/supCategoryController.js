import SupCategory from "../models/supCategoryModel.js";
import factoryHandelar from "./factoryHandelar.js";

// to create new supCategory

// middleware to create supcateogy on category
const setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};
const createSupCategory = factoryHandelar.createOne(SupCategory);

// to get all supCategory

// middleware to get all supcategory from specific category
const createFilterObj = (req, res, next) => {
  // filter
  let filtterObj = {};
  if (req.params.categoryId) filtterObj = { category: req.params.categoryId };
  req.filtterObj = filtterObj;
  next();
};
const getAllSupCategory = factoryHandelar.getAll(SupCategory);

// to get one supCategory
const getOneSupCategory = factoryHandelar.getOne(SupCategory);

// to update supCategory
const updateSupCategory = factoryHandelar.updateOne(SupCategory);

// to delete supCategory
const deleteSupCategory = factoryHandelar.delateOne(SupCategory);

export default {
  createSupCategory,
  getAllSupCategory,
  getOneSupCategory,
  updateSupCategory,
  deleteSupCategory,
  createFilterObj,
  setCategoryIdToBody,
};
