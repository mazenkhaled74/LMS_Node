import express from "express";
import bodyParser from "body-parser";
import authRouter from "./userManagement/routes/authRoutes.js";
import profileRouter from "./userManagement/routes/profileRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import courseRouter from "./courseManagement/routes/courseRoutes.js";

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api/auth", authRouter);
app.use("/api/profile", authMiddleware.authorize(process.env.JWT_SECRET), profileRouter);
app.use("/api/courses", courseRouter);

app.listen(3000, ()=>{
    console.log("Server is running at http://localhost:3000");
});