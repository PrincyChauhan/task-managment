import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-64 h-screen bg-gray-800 text-white">
        <div className="p-6 text-xl font-semibold text-center">
          Admin Dashboard
        </div>
        <ul className="space-y-4 p-6">
          {/* User Section Link */}
          <li>
            <Link to="/admin/user" className="hover:text-gray-400">
              <div className="text-lg">Create Users</div>
            </Link>
          </li>

          {/* Task Section Link */}
          <li>
            <Link to="/dashboard/tasks" className="hover:text-gray-400">
              <div className="text-lg">Create Tasks</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
