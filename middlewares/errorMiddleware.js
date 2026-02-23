import AppError from "../utils/AppError.js";

// send error in prodaction mode
const errorOnProd = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message || "something went wrong",
  });
};

// send error in development mode
const errorOnDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message || "something went wrong",
    stack: err.stack,
  });
};

// handles errors for podaction
const handleJWTError = () =>
  new AppError("invalid token please login again", 401);

const handleTokenExpiredError = () =>
  new AppError("token expired please login again", 401);

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    errorOnDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleTokenExpiredError();
    errorOnProd(err, res);
  }
};

export default errorMiddleware;
