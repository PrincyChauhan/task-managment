import axios from "axios";
import { useState } from "react";

const SubTask = () => {
  const [taskId, setTaskId] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [subtaskDescription, setSubtaskDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMessage("No token provided.");
      return;
    }
    const subTaskData = {
      taskId: taskId,
      title: subtaskTitle,
      description: subtaskDescription,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/subtask/create",
        subTaskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.message === "Subtask created successfully") {
        setSuccessMessage("Subtask created successfully!");
        setSubtaskTitle("");
        setSubtaskDescription("");
        setTimeout(() => {
          setSuccessMessage("");
        }, 100);
      } else {
        setErrorMessage("Error creating subtask.");
      }
    } catch (error) {
      console.log("Error===", error);
      if (error.response) {
        setErrorMessage(error.response.data.message || "Error creating task.");
      } else {
        setErrorMessage("Network error.");
      }
    }
  };
  return (
    <div className="p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-semibold mb-4">Create SubTask</h2>
      {errorMessage && <div className="text-red-600 mb-4">{errorMessage}</div>}
      {successMessage && (
        <div className="text-green-600 mb-4">{successMessage}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Main Task Id
          </label>
          <input
            type="text"
            id=""
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Sub Task Title
          </label>
          <input
            type="text"
            id="subtaskTitle"
            value={subtaskTitle}
            onChange={(e) => setSubtaskTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 text-left">
            Sub Task Description
          </label>
          <textarea
            id="taskDescription"
            value={subtaskDescription}
            onChange={(e) => setSubtaskDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default SubTask;
