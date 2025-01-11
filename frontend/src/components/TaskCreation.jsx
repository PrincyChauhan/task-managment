import React, { useState } from "react";
import axios from "axios";

const TaskCreation = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("token frontend===", token);
    if (!token) {
      setErrorMessage("No token provided.");
      return;
    }

    const taskData = {
      title: taskTitle,
      description: taskDescription,
      dueDate: dueDate,
      assignedTo: assignedTo,
    };

    console.log("taskData===", taskData);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/task/create",
        { taskData },
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
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
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
            Assigned To (User ID)
          </label>
          <input
            type="text"
            id="assignedTo"
            onChange={(e) => setAssignedTo(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
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
