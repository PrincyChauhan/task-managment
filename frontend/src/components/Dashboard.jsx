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
        <Link to="/admin/user">User Create</Link>
        <br />
        <UserListing />
      </div>
    </div>
  );
};

export default Dashboard;

// import React from "react";
// import Sidebar from "./SideBar";
// import { Link } from "react-router-dom";

// const Dashboard = () => {
//   return (
//     <div className="flex">
//       <Sidebar />
//       <div className="w-full p-6">
//         <h1 className="text-3xl font-bold">Welcome to the dashboard</h1>
//         {/* Add Create and Invite User Links */}
//         <div className="mt-6">
//           <Link
//             to="/admin/user/create"
//             className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 mr-4"
//           >
//             Create User
//           </Link>
//           <Link
//             to="/admin/user/invite"
//             className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
//           >
//             Invite User
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
