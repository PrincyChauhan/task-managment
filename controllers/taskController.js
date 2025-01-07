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
  const { title, description, status, dueDate, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      status,
      dueDate,
      assignedTo,
      createdBy: req.user.userId,
    });

    await newTask.save();
    res
      .status(201)
      .json({ message: "Task created successfully.", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task." });
  }
};

export { isAdmin, createTask };
