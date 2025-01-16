import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="flex">
      <div className="w-64 h-screen bg-gray-800 text-white">
        <div className="p-6 text-xl font-semibold text-center"></div>
        <ul className="space-y-4 p-6">
          {/* User Section Link */}
          <li>
            <Link to="/create/user" className="hover:text-gray-400">
              <div className="text-lg">Create Users</div>
            </Link>
          </li>

          {/* Task Section Link */}
          <li>
            <Link to="/create/tasks" className="hover:text-gray-400">
              <div className="text-lg">Create Tasks</div>
            </Link>
          </li>
          <li>
            <Link to="/create/subtasks" className="hover:text-gray-400">
              <div className="text-lg">Create Sub Tasks</div>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/tasks/list" className="hover:text-gray-400">
              <div className="text-lg">Tasks List</div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
