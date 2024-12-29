/* eslint-disable react/no-unescaped-entities */

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
  products: (
    <div>
      <h2 className="text-xl font-semibold mb-4">Product Catalog</h2>
      <p>View and manage your product inventory.</p>
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
     
      <div className=" text-white rounded-lg shadow p-6">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

