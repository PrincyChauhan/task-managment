import Sidebar from "./SideBar";
import UserListing from "./UserListing";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-6">
        <h1 className="text-3xl font-bold">Welcome to the dashboard</h1>
        <br />
        <UserListing />
      </div>
    </div>
  );
};

export default Dashboard;
