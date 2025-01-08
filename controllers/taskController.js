import Task from "../models/taskModel.js";
import jwt from "jsonwebtoken";

const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided.");
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    console.log("Token received:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    if (decoded.role !== "admin") {
      console.log("Not an admin.");
      return res
        .status(403)
        .json({ message: "Only admin can access this resource." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error verifying token:", error.message);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};

const createTask = async (req, res) => {
  const { title, description, status, dueDate, assignedTo, subtasks } =
    req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user.userId,
      subtasks: subtasks || [],
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task." });
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, dueDate, assignedTo } = req.body;

  console.log("Task ID to update==============:", taskId);
  console.log("Update fields==============:", {
    title,
    description,
    status,
    dueDate,
    assignedTo,
  });

  try {
    const task = await Task.findById(taskId);
    console.log("------task------", task);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update tasks." });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    await task.save();
    res.status(200).json({ message: "Task updated successfully.", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ message: "Error updating task.", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete tasks." });
    }
    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task." });
  }
};

const getTask = async (req, res) => {
  //   const { taskId } = req.params;
  //   try {
  //     const task = await Task.find();
  //     if (!task) {
  //       return res.status(404).json({
  //         message: "Task not found",
  //       });
  //     }

  //     if (req.user.role === "admin") {
  //       return res.status(200).json({
  //         message: "Task found",
  //         task: task,
  //       });
  //     }

  //     if (req.user.userId.toString() !== task.assignedTo.toString()) {
  //       return res.status(403).json({
  //         message: "You are not authorized to view this task.",
  //       });
  //     }
  //     res.status(200).json({ task });
  //   } catch (error) {
  //     console.log("Error getting task:", error);
  //     res.status(500).json({
  //       message: "Error getting task.",
  //       error: error.message,
  //     });
  //   }

  try {
    if (req.user.role === "admin") {
      const tasks = await Task.find(); // Get all tasks
      return res.status(200).json({ tasks });
    }
    const tasks = await Task.find({ assignedTo: req.user.userId });
    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res
      .status(500)
      .json({ message: "Error fetching tasks.", error: error.message });
  }
};

export { isAdmin, createTask, updateTask, deleteTask, getTask };
