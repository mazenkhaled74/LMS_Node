import express from "express";
import userController from "../controller/userController.js";

const profileRouter = express.Router();

profileRouter.get("/", userController.getProfile.bind(userController));
profileRouter.put("/update", userController.updateProfile.bind(userController));

export default profileRouter;