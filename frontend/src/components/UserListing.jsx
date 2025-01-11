import React, { useState, useEffect } from "react";
import axios from "axios";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailSent, setEmailSent] = useState({});
  const [loadingUserId, setLoadingUserId] = useState(null);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("No token provided.");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(response.data.users);

        // Initialize emailSent state
        const initialEmailSentState = {};
        response.data.users.forEach((user) => {
          initialEmailSentState[user.email] = false; // Use email as key
        });
        setEmailSent(initialEmailSentState);
      } else {
        setErrorMessage("Failed to fetch users.");
      }
    } catch (error) {
      setErrorMessage(
        error.response
          ? error.response.data.message
          : "Network error or server not reachable."
      );
    }
  };

  //   Send invite to user by email
  const sendInvite = async (userEmail) => {
    try {
      setLoadingUserId(userEmail); // Set loading state for the email
      const token = localStorage.getItem("token");

      if (!token) {
        setErrorMessage("No token provided.");
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/api/admin/invite",
        { email: userEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setEmailSent((prevState) => ({
          ...prevState,
          [userEmail]: true,
        }));
      } else {
        alert("Failed to send invitation.");
      }
    } catch (error) {
      alert(
        error.response
          ? "Failed to send invitation."
          : "Network error or server not reachable."
      );
    } finally {
      setLoadingUserId(null);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User List</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
            {errorMessage}
          </div>
        )}

        {/* User Table */}
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Send Request</th>
              <th className="px-4 py-2 border">Accepted</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border text-center">
                  {emailSent[user.email] ? (
                    "Yes"
                  ) : (
                    <button
                      className={`px-4 py-2 text-white rounded ${
                        loadingUserId === user.email
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                      disabled={loadingUserId === user.email}
                      onClick={() => sendInvite(user.email)} // Pass email here
                    >
                      {loadingUserId === user.email ? "Sending..." : "No"}
                    </button>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {user.isAccepted ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserListing;
