import express from "express";
import {
  isAdmin,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/create", isAdmin, createTask);
taskRouter.post("/update", isAdmin, updateTask);
taskRouter.delete("/delete/:taskId", isAdmin, deleteTask);

export default taskRouter;
