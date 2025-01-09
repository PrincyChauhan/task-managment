import express from "express";
import {
  createSubTask,
  updateSubTask,
  updateSubTaskStatus,
  getsubTasks,
  deleteSubTask,
} from "../controllers/subtaskController.js";
import { isAdmin } from "../middlewares/auth.js";

const subtaskRouter = express.Router();

subtaskRouter.post("/subtask/create", isAdmin, createSubTask);
subtaskRouter.post("/subtask/update", isAdmin, updateSubTask);
subtaskRouter.get("/subtask/:taskId", isAdmin, getsubTasks);
subtaskRouter.delete("/subtask/delete", isAdmin, deleteSubTask);
subtaskRouter.post("/subtask/status", updateSubTaskStatus);

export default subtaskRouter;
