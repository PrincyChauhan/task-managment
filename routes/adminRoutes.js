import express from "express";
import { signup } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/signup", signup);

export default adminRouter;
