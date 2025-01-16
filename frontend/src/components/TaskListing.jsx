import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskListing = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        setErrorMessage("Access denied: Admins only.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:3000/api/task/tasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          setErrorMessage(response.data.message || "Error fetching tasks.");
        }
      } catch (error) {
        setErrorMessage(
          error.response?.data?.message || "Failed to load tasks."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteClick = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3000/api/task/delete/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Task deleted successfully!");
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task._id !== taskId)
        );
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while deleting the task.");
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (!taskId || !newStatus) {
        toast.error("Invalid task or status.");
        return;
      }
      const response = await axios.post(
        "http://localhost:3000/api/task/status",
        { taskId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Task status updated successfully!");
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        toast.error("Failed to update task status.");
      }
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
      toast.error("An error occurred while updating task status.");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Tasks List (Admin View)
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {errorMessage}
          </div>
        )}
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by title and username ..."
            className="w-full p-2 border rounded"
          />
        </div>

        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Task Title</th>
                <th className="px-4 py-2 border">Assigned To (Username)</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter(
                  (task) =>
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    task.assignedTo?.username
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((task) => (
                  <tr key={task._id}>
                    <td className="px-4 py-2 border">{task.title}</td>
                    <td className="px-4 py-2 border">
                      {task.assignedTo
                        ? `${task.assignedTo.email} (${task.assignedTo.username})`
                        : "Unassigned"}
                    </td>
                    <td className="px-4 py-2 border">
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
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
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleDeleteClick(task._id)}
                        className="text-xl text-red-600 hover:opacity-75"
                      >
                        🗑️
                      </button>
                      <Link
                        to={`/update-task/${task._id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✏️
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TaskListing;
