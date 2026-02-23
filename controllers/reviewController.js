import Review from "../models/reviewModel.js";
import factoryHandelar from "./factoryHandelar.js";

// middleware to create review on product
const setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

// to create new Review
const createReview = factoryHandelar.createOne(Review);
// to delet Review
const deleteReview = factoryHandelar.delateOne(Review);

// middleware to get all reviews from specific product
const createFilterObjForProduct = (req, res, next) => {
  // filter
  let filtterObj = {};
  if (req.params.productId) filtterObj = { product: req.params.productId };
  req.filtterObj = filtterObj;
  next();
};

//to get all Reviews
const getAllReviews = factoryHandelar.getAll(Review);

// to get one Review
const getOneReview = factoryHandelar.getOne(Review);

// to update Review
const updateReview = factoryHandelar.updateOne(Review);

export default {
  createReview,
  deleteReview,
  getAllReviews,
  getOneReview,
  updateReview,
  createFilterObjForProduct,
  setProductIdToBody,
};
