import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import cors from "cors";
import compression from "compression";

import AppError from "./utils/AppError.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import checkWebHook from "./controllers/orderController.js";

// import routes
import categoryRoute from "./routes/categoryRoute.js";
import supCategoryRoute from "./routes/supCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import reviewRoute from "./routes/reviewRoute.js";
import wishListRoute from "./routes/wishLIstRoute.js";
import addressRoute from "./routes/addressRoute.js";
import couponRoute from "./routes/couponRoute.js";
import cartRoute from "./routes/cartRoute.js";
import orderRoute from "./routes/orderRoute.js";

const app = express();

// enable other domains to access api (cross origin resource sharing)
app.use(cors());
app.options("/{*any}", cors());

// to compress response
app.use(compression());

// webhook
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  checkWebHook,
);

// set static folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

//for extended url to convert url to suported quary format it uses advanced library like {qs}
app.set("query parser", "extended");

//Router
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/sup-category", supCategoryRoute);
app.use("/api/v1/brand", brandRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/wishList", wishListRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);

// handel error not exit
app.use((req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
});

// error handler
app.use(errorMiddleware);
export default app;
