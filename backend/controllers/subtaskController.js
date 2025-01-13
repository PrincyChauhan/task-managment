import Task from "../models/taskModel.js";

const createSubTask = async (req, res) => {
  try {
    const { taskId, title, description } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }
    const newSubtask = {
      title,
      description,
      isCompleted: false,
    };
    task.subtasks.push(newSubtask);
    task.updateAt = new Date();

    await task.save();
    res.status(201).json({
      success: true,
      message: "Subtask created successfully",
      subtask: newSubtask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in creating subtask",
      error: error.message,
    });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { taskId, subtaskId, title, description } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        message: "Subtask not found",
      });
    }
    if (title !== undefined) subtask.title = title;
    if (description !== undefined) subtask.description = description;

    subtask.updateAt = new Date();
    task.updateAt = new Date();
    await task.save();
    res.status(200).json({
      message: "Subtask updated successfully",
      subtask,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in updating subtask",
    });
  }
};

const getsubTasks = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    return res.status(200).json({
      subtasks: task.subtasks,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in getting subtasks",
    });
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      {
        $pull: { subtasks: { _id: subtaskId } },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Subtask deleted successfully", task });
  } catch (error) {
    console.error("Error deleting subtask:", error.message);
    res
      .status(500)
      .json({ message: "Error deleting subtask", error: error.message });
  }
};
const updateSubTaskStatus = async (req, res) => {
  try {
    const { taskId, subtaskId, isCompleted } = req.body;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) {
      return res.status(404).json({
        message: "Sub Task not found",
      });
    }
    subtask.isCompleted = isCompleted;
    subtask.updateAt = new Date();
    task.updateAt = new Date();

    await task.save();
    res.status(200).json({
      message: "Subtask status updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in updating subtask status",
    });
  }
};

export {
  updateSubTaskStatus,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  getsubTasks,
};
