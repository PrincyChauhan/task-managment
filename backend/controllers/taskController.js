import Task from "../models/taskModel.js";
import sendMail from "../utils/sendMail.js";
import moment from "moment-timezone";
import mongoose from "mongoose";

const createTask = async (req, res) => {
  const { title, description, status, dueDate, assignedTo, subtasks } =
    req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User ID for assignedTo",
      });
    }
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
    res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: newTask,
    });
  } catch (error) {
    console.log("Error creating task:", error);
    res.status(500).json({ success: false, message: "Error creating task." });
  }
};

const updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, status, dueDate, assignedTo } = req.body;
  try {
    const task = await Task.findById(taskId);
    console.log("task.......", task);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update tasks." });
    }
    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;
    task.assignedTo = assignedTo || task.assignedTo;

    task.updatedAt = new Date();

    await task.save();
    res
      .status(200)
      .json({ success: "true", message: "Task updated successfully.", task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Error updating task.",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete tasks." });
    }
    task.isDeleted = true;
    task.deletedAt = new Date();
    await task.save();

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error deleting task." });
  }
};

const getTasksByAdmin = async (req, res) => {
  try {
    // const tasks = await Task.find({ isDeleted: false });
    const tasks = await Task.find({ isDeleted: false }).populate(
      "assignedTo",
      "email username"
    );
    if (!tasks || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No tasks found.",
      });
    }
    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error getting task.",
      error: error.message,
    });
  }
};

const getTasksByUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.find({
      assignedTo: userId,
      isDeleted: false,
    });
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found for this user.",
      });
    }
    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error getting task.",
      error: error.message,
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid taskId",
      });
    }
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    task.status = status;
    await task.save();
    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in updating task status",
    });
  }
};

const sendReminderForDueDate = async (req, res) => {
  try {
    const tasksDueSoon = await Task.find({
      dueDate: {
        $gte: moment().toDate(),
        $lt: moment().add(1, "days").toDate(),
      },
      status: {
        $ne: "completed",
      },
    }).populate("assignedTo", "email");

    tasksDueSoon.forEach(async (task) => {
      const { assignedTo, title, dueDate } = task;
      const emailSubject = `Reminder: Task due soon: ${title}`;
      const emailMessage = `
      <h1>Reminder: ${title}</h1>
      <p>This is a reminder that your task is due on ${moment(dueDate).format(
        "MMMM Do YYYY, h:mm A"
      )}</p>
      <p>Best regards, Task Manager Team</p>
    `;
      await sendMail(assignedTo, emailSubject, emailMessage);
      console.log("Reminder sent sucessfully");
      return res.status(200).json({
        message: "Reminder sent successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in sending reminder",
    });
  }
};

const getTasks = async (req, res) => {
  // const { taskId } = req.params;
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "username")
      .lean();
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching task.",
      error: error.message,
    });
  }
};

export {
  createTask,
  updateTask,
  deleteTask,
  getTasksByAdmin,
  getTasksByUser,
  updateTaskStatus,
  sendReminderForDueDate,
  getTasks,
};
