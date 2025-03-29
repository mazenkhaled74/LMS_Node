import express from "express";
import authController  from "../controller/authController.js";
const authRouter = express.Router();

authRouter.post("/signup", authController.signUp.bind(authController));
authRouter.post("/signin", authController.signIn.bind(authController));
authRouter.get("/verify-email", authController.verifyEmail.bind(authController));

export default authRouter;