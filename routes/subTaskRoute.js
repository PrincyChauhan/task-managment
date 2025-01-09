import express from "express";
import {
  createSubtask,
  updateSubTaskStatus,
} from "../controllers/subtaskController.js";

const subtaskRouter = express.Router();

subtaskRouter.post("/subtask/create", createSubtask);
subtaskRouter.post("/subtask/status", updateSubTaskStatus);

export default subtaskRouter;
