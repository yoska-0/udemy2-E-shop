import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";

import Product from "../models/prodactModel.js";
import factoryHandelar from "./factoryHandelar.js";
import uploadImage from "../middlewares/uploadImageMidelWare.js";

// upload image
const uploadProductImages = uploadImage.uploadMultipleImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);

// resize image
const resizeProductImages = asyncHandler(async (req, res, next) => {
  if (req.files.imageCover) {
    const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333, { fit: "fill" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/product/${imageCoverName}`);

    // save image to dabaBase
    req.body.imageCover = imageCoverName;
  }

  if (req.files.images) {
    const imagesName = [];
    await Promise.all(
      req.files.images.map(async (image, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index}.jpeg`;
        await sharp(image.buffer)
          .resize(2000, 1333, { fit: "fill" })
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/product/${imageName}`);
        imagesName.push(imageName);
      }),
    );

    //save images to dabaBase
    req.body.images = imagesName;
  }
  next();
});

// to create new Product
const createProduct = factoryHandelar.createOne(Product);

// to get all Product
const getAllProduct = factoryHandelar.getAll(Product, "Product");

// to get one Product
const getOneProduct = factoryHandelar.getOne(Product, "reviews");

// to update Product
const updateProduct = factoryHandelar.updateOne(Product);

// to delete Product
const deletProduct = factoryHandelar.delateOne(Product);

export default {
  createProduct,
  getAllProduct,
  getOneProduct,
  updateProduct,
  deletProduct,
  uploadProductImages,
  resizeProductImages,
};
