import express from "express";
import { isAdmin, createTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/create", isAdmin, createTask);

export default taskRouter;
