import React from "react";
import Sidebar from "./SideBar";
import { Link } from "react-router-dom";
import UserListing from "./UserListing";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold">Welcome to the dashboard</h1>
        <br />
        <UserListing />
        <div className="mt-6">
          <Link
            to="/dashboard/tasks/create"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Task
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
