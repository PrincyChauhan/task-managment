import express from "express";
import { signup, signin } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);

export default adminRouter;
