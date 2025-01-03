/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, loading } = useSelector((state) => state.userReducer);
  const navigate = useNavigate(); // Initialize navigate

  // Redirect to login if no user is found
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to the login page
    }
  }, [user, navigate]);

  return (
    <div className="flex h-screen pt-12">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
    </div>
  );
};

export default AdminDashboard;
