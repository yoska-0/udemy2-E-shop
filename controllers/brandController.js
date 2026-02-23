import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import factoryHandelar from "./factoryHandelar.js";
import uploadImage from "../middlewares/uploadImageMidelWare.js";

//upload image
const uploadBrandImage = uploadImage.uploadSingleImage();

// resize image
const resizeBrandImage = asyncHandler(async (req, res, next) => {
  const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(600, 600, { fit: "fill" })
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brand/${fileName}`);

  // save image to body
  req.body.image = fileName;
  next();
});

// to create new brand
const createBrand = factoryHandelar.createOne(Brand);
// to delet brand
const deleteBrand = factoryHandelar.delateOne(Brand);

//to get all brands
const getAllBrands = factoryHandelar.getAll(Brand);

// to get one brand
const getOneBrand = factoryHandelar.getOne(Brand);

// to update brand
const updateBrand = factoryHandelar.updateOne(Brand);

export default {
  createBrand,
  deleteBrand,
  getAllBrands,
  getOneBrand,
  updateBrand,
  uploadBrandImage,
  resizeBrandImage,
};
