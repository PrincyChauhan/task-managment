import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/signup",
        { username, email, password }
        // { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        setSuccess(response.data.message); // Set success message
        setUsername(""); // Clear input fields
        setEmail("");
        setPassword("");
      } else {
        setError(response.data.message || "Unexpected error occurred.");
      }
      console.log(response.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); // Set error message from backend
      } else {
        setError("Network error or server not reachable.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {success && (
          <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-center">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-left mb-2">
              User Name
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left mb-2">Email </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/signin" className="text-blue-500 hover:underline">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
