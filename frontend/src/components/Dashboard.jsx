import { Link } from "react-router-dom";
import Sidebar from "./SideBar";
import UserListing from "./UserListing";

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem("token"); // Assuming you're storing token in localStorage
    window.location.href = "/login";
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
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
