import express from "express";
import {
  isAdmin,
  createTask,
  updateTask,
  deleteTask,
  getTasksByAdmin,
} from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/create", isAdmin, createTask);
taskRouter.post("/update/:taskId", isAdmin, updateTask);
taskRouter.delete("/delete/:taskId", isAdmin, deleteTask);
taskRouter.get("/tasks", isAdmin, getTasksByAdmin);

export default taskRouter;
