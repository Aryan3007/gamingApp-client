/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import Allrequests from "./Allrequests";
import UserManagement from "./UserManagement";

const tabContent = {
  dashboard: (
    <div>
      <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
      <p>Welcome to your dashboard. Here's an overview of your key metrics.</p>
    </div>
  ),
  users: (
    <div className="min-h-screen">
      <main className="">
        <UserManagement />
      </main>
    </div>
  ),
  requests: (
    <div className="min-h-screen">
      <main className="">
        <Allrequests />
      </main>
    </div>
  ),
  settings: (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Settings</h2>
      <p>Configure your application settings and preferences.</p>
    </div>
  ),
};

export default function Content({ activeTab }) {
  return (
    <div className="flex-1">
     
      <div className=" text-white rounded-lg shadow lg:pt-6 pt-16 p-6">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

