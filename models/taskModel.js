import mongoose from "mongoose";
import commonFields from "./commonFields.js";

const subtaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  ...commonFields,
});

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  subtasks: [subtaskSchema],
  ...commonFields,
});

const taskModel = mongoose.model.task || mongoose.model("Task", taskSchema);
export default taskModel;
