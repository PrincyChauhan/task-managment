import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const TaskCreation = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [subtasks, setSubtasks] = useState([{ title: "", description: "" }]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [users, setUsers] = useState([]);

  console.log(users, "--------------");
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/users",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("response===========", response.data.users);

        if (response.data.success) {
          setUsers(response.data.users);
        } else {
          setErrorMessage("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Error fetching users.");
      }
    };

    fetchUsers();
  }, []);
  const handleSubtaskChange = (index, e) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index][e.target.name] = e.target.value;
    setSubtasks(newSubtasks);
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", description: "" }]);
  };

  const handleRemoveSubtask = (index) => {
    const newSubtasks = [...subtasks];
    newSubtasks.splice(index, 1);
    setSubtasks(newSubtasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("token frontend===", token);
    if (!token) {
      setErrorMessage("No token provided.");
      return;
    }
    if (!assignedTo) {
      setErrorMessage("Assigned user ID is required.");
      return;
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      dueDate: new Date(dueDate),
      assignedTo: assignedTo,
      subtasks: subtasks,
    };

    console.log("taskData===", taskData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/create",
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("response===", response.data);

      if (response.data.message === "Task created successfully.") {
        setSuccessMessage("Task created successfully!");
        setTaskTitle("");
        setTaskDescription("");
        setDueDate("");
        setAssignedTo("");
        setSubtasks([{ title: "", description: "" }]);

        // Immediately redirect after task creation
        navigate("/dashboard/tasks/list");
      } else {
        setErrorMessage("Failed to create task.");
      }
    } catch (error) {
      console.log("Error===", error); // Log the error for debugging
      if (error.response) {
        setErrorMessage(error.response.data.message || "Error creating task.");
      } else {
        setErrorMessage("Network error.");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4">Create Task</h2>

      {/* Error or Success Message */}
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
            id="taskTitle"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Task Description
          </label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
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
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Assigned To
          </label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Subtasks
          </label>
          {subtasks.map((subtask, index) => (
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
          Submit
        </button>
      </form>
    </div>
  );
};

export default TaskCreation;
