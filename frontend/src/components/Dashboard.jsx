import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import UserListing from "./UserListing";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
  const userRole = localStorage.getItem("role");

  return (
    <div className="flex">
      {userRole === "admin" && <Sidebar />}
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to the Admin Dashboard</h1>
          <nav>
            <Link
              to="/"
              className="mr-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Signup
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </nav>
        </div>
        <UserListing />
      </div>
    </div>
  );
};

export default Dashboard;
