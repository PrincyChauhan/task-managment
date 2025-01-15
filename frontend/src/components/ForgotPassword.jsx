import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Network error or server not reachable.");
      }
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          {message && (
            <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
              {error}
            </div>
          )}
          <div className="className">
            <label className="block text-gray-700 text-left mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
