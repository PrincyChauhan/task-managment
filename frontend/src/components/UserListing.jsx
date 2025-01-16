import { useState, useEffect } from "react";
import axios from "axios";

const UserListing = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

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
        const updatedUsers = response.data.users.map((user) => ({
          ...user,
          deleted: user.deletedAt ? true : false, // Initialize 'deleted' state
        }));
        setUsers(updatedUsers);
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

  const toggleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No token Provided");
        return;
      }
      const response = await axios.delete(
        `http://localhost:3000/api/admin/delete/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId
              ? { ...user, deleted: !user.deleted } // Toggle 'deleted' state
              : user
          )
        );
      } else {
        alert("Failed to toggle user deletion.");
      }
    } catch (error) {
      console.log(error);
      alert(
        error.response
          ? "Failed to toggle user deletion."
          : "Network error or server not reachable."
      );
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  console.log(users);

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
              <th className="px-4 py-2 border">Invitation Request</th>
              <th className="px-4 py-2 border">Accepted</th>
              <th className="px-4 py-2 border">User Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border text-center">Yes</td>
                <td className="px-4 py-2 border">
                  <span
                    className={`font-bold ${
                      user.isAccepted ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {user.isAccepted ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className={`px-4 py-2 text-white rounded ${
                      user.deleted
                        ? "bg-red-500 hover:bg-red-700"
                        : "bg-green-500 hover:bg-green-700"
                    }`}
                    onClick={() => toggleDeleteUser(user._id)}
                  >
                    {user.deleted ? "Yes" : "No"}
                  </button>
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
