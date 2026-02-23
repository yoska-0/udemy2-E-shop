import multer from "multer";
import AppError from "../utils/AppError.js";

const multerOptions = () => {
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else
      cb(new AppError("Not an image! Please upload only images.", 400), false);
  };

  const multerStorage = multer.memoryStorage();
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload;
};

const uploadSingleImage = (fileName = "image") =>
  multerOptions().single(fileName);

// upload multiple images
const uploadMultipleImages = (fieldsArray) =>
  multerOptions().fields(fieldsArray);

export default { uploadSingleImage, uploadMultipleImages };
