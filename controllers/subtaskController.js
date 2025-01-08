import Task from "../models/taskModel.js";

const updateSubTaskStatus = async (req, res) => {
  try {
    const { taskId, subtaskId, isCompleted } = req.body;
    const task = await Task.findById(taskId);
    console.log("----task----", task);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const subtask = task.subtasks.id(subtaskId);
    console.log("----subtask----", subtask);

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

export { updateSubTaskStatus };
