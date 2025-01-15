import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import UserCreation from "./components/UserCreation";
import TaskCreation from "./components/TaskCreation";
import TaskListing from "./components/TaskListing";
import SubTask from "./components/SubTask";
import UpdateTask from "./components/UpdateTask";
import UserTaskListing from "./components/UserAssignTaskListing";
import ForgotPassword from "./components/ForgotPassword";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/user" element={<UserCreation />} />
          <Route path="/dashboard/tasks" element={<TaskCreation />} />
          <Route path="/admin-tasks" element={<TaskListing />} />
          <Route path="/user-tasks" element={<UserTaskListing />} />
          <Route path="/dashboard/subtasks" element={<SubTask />} />
          <Route path="/update-task/:taskId" element={<UpdateTask />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
