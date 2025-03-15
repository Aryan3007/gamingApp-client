import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { server } from '../../constants/config';

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({    name: '',
    email: '',
    password: '',
    currency: 'USD',
    role: 'user', // Fixed as Admin
    gender: 'Male',
    amount: ''
  });

  // Sample data for Users
  const Users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Senior Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Admin", status: "Active" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Admin", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "Junior Admin", status: "Active" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "Admin", status: "Active" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({
      ...newUserData,
      [name]: value
    });
  };
  const validateNewUser = () => {
    if (!newUserData.name.trim()) {
      toast.error("Name is required")
      return false
    }
    if (!newUserData.email.trim()) {
      toast.error("Email is required")
      return false
    }
    if (!newUserData.password.trim()) {
      toast.error("Password is required")
      return false
    }
    if (!newUserData.gender) {
      toast.error("Gender selection is required")
      return false
    }
    if (!newUserData.amount || newUserData.amount <= 0) {
      toast.error("Amount must be greater than 0")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken")

    if (!validateNewUser()) return

    try {
      const response = await axios.post(`${server}api/v1/user/new`, newUserData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      })
console.log(response);
      toast.success("User added successfully")
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user. Please try again later.")
    }

   
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">All Users</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgb(var(--color-primary-dark))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Add New User
        </button>
      </div>

      <div className="rounded-lg border border-[rgb(var(--color-border))] bg-white shadow-sm">
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          <h3 className="text-lg font-semibold leading-none tracking-tight text-[rgb(var(--color-text-primary))]">
            User Management
          </h3>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            Manage all User accounts from here
          </p>
        </div>
        <div className="p-6 pt-0">
          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b border-[rgb(var(--color-border))]">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[rgb(var(--color-text-muted))]">Name</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[rgb(var(--color-text-muted))]">Email</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[rgb(var(--color-text-muted))]">Role</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-[rgb(var(--color-text-muted))]">Status</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-[rgb(var(--color-text-muted))]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Users.map((admin) => (
                  <tr 
                    key={admin.id} 
                    className="border-b border-[rgb(var(--color-border))] transition-colors hover:bg-[rgb(var(--color-primary-lighter))] last:border-0"
                  >
                    <td className="p-4 align-middle font-medium">{admin.name}</td>
                    <td className="p-4 align-middle">{admin.email}</td>
                    <td className="p-4 align-middle">{admin.role}</td>
                    <td className="p-4 align-middle">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          admin.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <button className="mr-2 inline-flex h-8 items-center justify-center rounded-md border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-xs font-medium transition-colors hover:bg-[rgb(var(--color-primary-lighter))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        Edit
                      </button>
                      <button className="inline-flex h-8 items-center justify-center rounded-md border border-[rgb(var(--color-border))] bg-transparent px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-[rgb(var(--color-primary-lighter))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">Add New Admin</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-[rgb(var(--color-text-muted))] hover:bg-[rgb(var(--color-primary-lighter))] hover:text-[rgb(var(--color-primary-dark))]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUserData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="currency" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={newUserData.currency}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                 
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={newUserData.role}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] bg-gray-100 px-3 py-2 text-sm"
                    disabled
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="gender" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={newUserData.gender}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={newUserData.amount}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-[rgb(var(--color-border))] px-3 py-2 text-sm focus:border-[rgb(var(--color-primary))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary))]"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border border-[rgb(var(--color-border))] bg-white px-4 py-2 text-sm font-medium text-[rgb(var(--color-text-primary))] transition-colors hover:bg-[rgb(var(--color-primary-lighter))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[rgb(var(--color-primary-dark))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] focus:ring-offset-2"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}