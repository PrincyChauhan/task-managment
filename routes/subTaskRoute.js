import express from "express";
import {
  createSubTask,
  updateSubTask,
  updateSubTaskStatus,
} from "../controllers/subtaskController.js";

const subtaskRouter = express.Router();

subtaskRouter.post("/subtask/create", createSubTask);
subtaskRouter.post("/subtask/update", updateSubTask);
subtaskRouter.post("/subtask/status", updateSubTaskStatus);

export default subtaskRouter;
