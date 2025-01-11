import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/signin" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
