import { useState } from "react";
import Sidebar from "./Sidebar";
import Content from "./Content";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen pt-12">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Content activeTab={activeTab} />
    </div>
  );
};

export default AdminDashboard;
