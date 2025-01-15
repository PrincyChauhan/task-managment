import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTaskListing = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserTasks = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setErrorMessage("User not logged in.");
        setLoading(false);
        navigate("/signin"); // Redirect to login page
        return;
      }

      console.log("userId-----------", userId); // Debugging log

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/task/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Use token from localStorage
            },
          }
        );
        if (response.data.success) {
          setTasks(response.data.tasks);
        } else {
          setErrorMessage("Failed to load tasks.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setErrorMessage("Error fetching tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Assigned Tasks List (User View)
        </h2>

        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <p className="text-center">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Due Date</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td className="px-4 py-2 border">{task.title}</td>
                  <td className="px-4 py-2 border">{task.dueDate}</td>
                  <td className="px-4 py-2 border">
                    <select value={task.status} className="border p-2">
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default UserTaskListing;
