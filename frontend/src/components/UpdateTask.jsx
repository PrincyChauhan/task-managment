import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpdateTask = () => {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
    dueDate: "",
    assignedTo: "",
    subtasks: [{ title: "", description: "" }],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { taskId } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/task/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("response", response.data);
        // Check if response is successful and task exists
        if (response.data.success && response.data.task) {
          setTask(response.data.task);
        } else {
          setErrorMessage("Task not found.");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
        setErrorMessage("Failed to fetch task.");
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleSubtaskChange = (index, e) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index][e.target.name] = e.target.value;
    setTask({ ...task, subtasks: newSubtasks });
  };

  const handleAddSubtask = () => {
    setTask({
      ...task,
      subtasks: [...task.subtasks, { title: "", description: "" }],
    });
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks.splice(index, 1);
    setTask({ ...task, subtasks: newSubtasks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No token provided.");
      return;
    }

    const taskData = {
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      subtasks: task.subtasks,
    };

    try {
      const response = await axios.put(
        `http://localhost:3000/api/task/update/${taskId}`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccessMessage("Task updated successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard/tasks/list"); // Redirect after success
        }, 3000);
      } else {
        setErrorMessage(response.data.message || "Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setErrorMessage(error.response?.data.message || "Error updating task.");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Update Task</h2>

      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      {successMessage && (
        <div className="text-green-600 mb-4">{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Task Title
          </label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Task Description
          </label>
          <textarea
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Due Date
          </label>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Assigned To (User ID)
          </label>
          <input
            type="text"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Subtasks
          </label>
          {task.subtasks.map((subtask, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                name="title"
                value={subtask.title}
                onChange={(e) => handleSubtaskChange(index, e)}
                placeholder={`Subtask ${index + 1} Title`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <textarea
                name="description"
                value={subtask.description}
                onChange={(e) => handleSubtaskChange(index, e)}
                placeholder={`Subtask ${index + 1} Description`}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={() => handleRemoveSubtask(index)}
                className="text-red-500 mt-2"
              >
                Remove Subtask
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSubtask}
            className="text-blue-500"
          >
            Add Subtask
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default UpdateTask;
