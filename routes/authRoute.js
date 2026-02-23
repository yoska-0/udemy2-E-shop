import express from "express";
import authController from "../controllers/authController.js";
import authValidator from "../utils/validators/authValidator.js";

const authRoute = express.Router();

authRoute.post(
  "/signup",
  authValidator.signUpValidation,
  authController.signUp,
);

authRoute.post("/login", authValidator.loginValidation, authController.login);

authRoute.post("/forgotPassword", authController.forgotPassword);

authRoute.post("/verifyResetCode", authController.verifyResetCode);

authRoute.put("/resetPassword", authController.resetPassword);

export default authRoute;
