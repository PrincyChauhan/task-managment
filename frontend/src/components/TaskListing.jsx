import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskListing = () => {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTask, setDeleteTask] = useState({});

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("No token provided.");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/task/tasks",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in headers
            },
          }
        );

        // If no tasks are found
        if (!response.data.success || response.data.tasks.length === 0) {
          setErrorMessage("No tasks found.");
        } else {
          setTasks(response.data.tasks);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, []);

  // Handle actual task deletion
  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/task/delete/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        // Update state to remove the deleted task
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
        toast.success("Task deleted successfully.");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task.");
    }
  };

  const handleDeleteClick = (taskId) => {
    setDeleteTask((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));

    // Ask for confirmation before deleting
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDelete) {
      handleDeleteTask(taskId);
    }
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    const token = localStorage.getItem("token");

    console.log("=======taskId statis=============", taskId, newStatus);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/status",
        { taskId, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        // Update the status locally after successful update
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
        toast.success("Task status updated successfully.");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to update task status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Tasks List</h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {errorMessage}
          </div>
        )}

        {tasks.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Assigned To (Username)</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">
                    {task.assignedTo
                      ? `${task.assignedTo.email} (${task.assignedTo.username})`
                      : "Unassigned"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleStatusChange(task._id, e.target.value)
                      }
                      className="border p-2"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 border flex gap-4 justify-center">
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      className={`text-xl ${
                        deleteTask[task._id] ? "text-red-600" : "text-green-600"
                      } hover:opacity-75`}
                    >
                      🗑️
                    </button>

                    {/* Add the update button */}
                    <Link
                      to={`/update-task/${task._id}`} // Navigate to update task page with task ID
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default TaskListing;
