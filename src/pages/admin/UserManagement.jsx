/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";

const UserForm = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [amount, setAmount] = useState(0);
  const [newUserData, setNewUserData] = useState({
    name: "",
    email: "",
    password: "",
    currency: "INR",
    role: "user",
    gender: "",
    amount: "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("authToken");
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${server}/api/v1/user/allusers`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.users)) {
          setUsers(response.data.users);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch users. Try again later."
        );
        toast.error(error || "Failed to fetch users.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const validateNewUser = () => {
    if (!newUserData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!newUserData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!newUserData.password.trim()) {
      toast.error("Password is required");
      return false;
    }
    if (!newUserData.gender) {
      toast.error("Gender selection is required");
      return false;
    }
    if (!newUserData.amount || newUserData.amount <= 0) {
      toast.error("Amount must be greater than 0");
      return false;
    }
    return true;
  };

  const postNewUser = async () => {
    const token = localStorage.getItem("authToken");

    if (!validateNewUser()) return;

    try {
      const response = await axios.post(
        `${server}/api/v1/user/new`,
        newUserData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      toast.success("User added successfully");
      setUsers((prev) => [...prev, response.data.user]); // Assuming `response.data.user` contains the new user
      setIsAddingUser(false);
      resetForm();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add user. Please try again later."
      );
    }
  };

  const resetForm = () => {
    setNewUserData({
      name: "",
      email: "",
      password: "",
      currency: "INR",
      role: "user",
      gender: "",
      amount: "",
    });
  };

  const handleBanUser = async (userId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        `${server}/api/v1/user/userstatus/${userId}`,
        { status: "banned" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("User banned successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, status: "banned" } : user
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to ban the user. Please try again later."
      );
      console.error("Error banning user:", error);
    }
  };

  const openDialog = (userId) => {
    setSelectedUserID(userId);
    setIsDialogOpen(true);
  };
  const closeDialog = () => {
    setSelectedUserID(null);
    setIsDialogOpen(false);
  };

  const handleAddMoney = async (userId) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.put(
        `${server}/api/v1/user/addamount/${userId}`,
        { amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data?.message);
      closeDialog();
      setAmount(0);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update amount. Please try again later."
      );
      console.error("Error updating amount:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold mb-4">User Management</h1>
        <button
          onClick={() => setIsAddingUser(true)}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add User
        </button>
      </div>
      {isAddingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 text-black rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={newUserData.name}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUserData.email}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, email: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={newUserData.password}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, password: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newUserData.currency}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, currency: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
              <select
                value={newUserData.role}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, role: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={newUserData.gender}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, gender: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Initial Amount"
                value={newUserData.amount}
                onChange={(e) =>
                  setNewUserData({ ...newUserData, amount: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsAddingUser(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={postNewUser}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 mt-8 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users?.map((user, index) => (
            <div
              key={index}
              className="block hover:scale-95 duration-150 rounded-lg p-4 shadow-sm shadow-indigo-100"
            >
              <div>
                <dt className="sr-only">Name</dt>
                <dd className="font-medium capitalize">{user.name}</dd>
              </div>
              <div className="mt-2">
                <dl>
                  <div>
                    <dt className="sr-only">Amount</dt>
                    <dd className="text-sm text-gray-400">
                      Wallet Amount :{" "}
                      <span className="text-gray-200 uppercase">
                        {user.currency} {user.amount}
                      </span>
                    </dd>
                  </div>

                  <div>
                    <dt className="sr-only">Email</dt>
                    <dd className="text-sm text-gray-400">
                      Email :<span className="text-gray-200">{user.email}</span>
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-center gap-8 text-xs">
                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <div className="mt-1.5 sm:mt-0">
                      <p className="text-gray-500">Status</p>
                      <p
                        className={`font-medium ${
                          user.status === "banned"
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {user.status}
                      </p>
                    </div>
                  </div>

                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <div className="mt-1.5 sm:mt-0">
                      <p className="text-gray-500">Role</p>
                      <p className="font-medium capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                    <div className="mt-1.5 sm:mt-0">
                      <p className="text-gray-500">Gender</p>
                      <p className="font-medium">{user.gender}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="gap-4 flex justify-between items-center mt-3">
                {/* <button className="bg-red-500 px-2 text-sm py-1 rounded-lg">Delete User</button> */}
                <button
                  onClick={() => handleBanUser(user._id)}
                  className={`w-full px-4 text-sm py-2 rounded-lg ${
                    user.status === "banned" ? "bg-red-500" : "bg-orange-500"
                  }`}
                  disabled={user.status === "banned"}
                >
                  {user.status === "banned" ? "Banned" : "Ban User"}
                </button>

                <button
                  className="bg-green-700 w-full px-4 text-sm py-2 rounded-lg"
                  onClick={() => openDialog(user._id)}
                >
                  Add Money
                </button>
              </div>
            </div>
          ))}

          {isDialogOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Add Amount
                </h2>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-4 py-2 mb-4 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleAddMoney(selectedUserID)}
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeDialog}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserForm;
