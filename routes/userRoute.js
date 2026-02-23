import express from "express";
import userController from "../controllers/userController.js";
import userValidator from "../utils/validators/userValidator.js";
import authController from "../controllers/authController.js";

const userRoute = express.Router();

userRoute.use(authController.protect);

userRoute.get("/getMe", userController.getMe, userController.getOneUser);

userRoute.patch("/changeMyPassword", userController.changeMyPassword);

userRoute.patch(
  "/updateMyData",
  userValidator.updateLoggedUserData,
  userController.updateLoggedUserData,
);
userRoute.delete("/deleteMyAccount", userController.deleteMyAccount);

userRoute.use(authController.allowedRoles("admin"));

userRoute
  .route("/")
  .post(
    userController.uploadUserImage,
    userController.resizeUserImage,
    userValidator.createUserValidation,
    userController.createUser,
  )
  .get(userController.getAllUsers);

userRoute.patch(
  "/changePassword/:id",
  userValidator.changePasswordValidation,
  userController.changePassword,
);

userRoute
  .route("/:id")
  .delete(userValidator.deleteUserValidation, userController.deleteUser)
  .get(userValidator.getOneUserValidation, userController.getOneUser)
  .patch(
    userController.uploadUserImage,
    userController.resizeUserImage,
    userValidator.updateUserValidation,
    userController.updateUser,
  );

export default userRoute;
