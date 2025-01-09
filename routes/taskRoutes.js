import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  getTasksByAdmin,
  getTasksByUser,
  updateTaskStatus,
} from "../controllers/taskController.js";
import { isAdmin } from "../middlewares/auth.js";
const taskRouter = express.Router();

taskRouter.post("/create", isAdmin, createTask);
taskRouter.post("/update/:taskId", isAdmin, updateTask);
taskRouter.delete("/delete/:taskId", isAdmin, deleteTask);
taskRouter.get("/tasks", isAdmin, getTasksByAdmin);
taskRouter.get("/user/:userId", getTasksByUser);
taskRouter.post("/status", updateTaskStatus);

export default taskRouter;
