import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../constants/config";

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [withdrawls, setwithdrawls] = useState(null);
  const [Deposites, setDeposites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    accNo: "",
    ifsc: "",
    contact: "",
    bankName: "",
    receiverName: "",
  });

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      try {
        const response = await axios.get(
          `${server}/api/v1/payment/status/withdraw?userId=${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );
        setwithdrawls(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    const fetchdeposites = async () => {
      const token = localStorage.getItem("authToken");
      setLoading(true);
      try {
        const response = await axios.get(
          `${server}/api/v1/payment/status/deposit?userId=${user?._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );
        setDeposites(response.data);
      } catch (err) {
        setError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPaymentStatus();
      fetchdeposites();
    }
  }, [user?._id]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        `${server}/api/v1/payment/request/withdraw?userId=${user?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        alert("Withdrawal request submitted successfully!");
        setShowModal(false); // Close the modal after successful submission
        setFormData({
          amount: "",
          accNo: "",
          ifsc: "",
          contact: "",
          bankName: "",
          receiverName: "",
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="lg:pt-12 pt-24">
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 p-2 lg:h-[calc(100vh-64px)]">
        {/* Profile */}
        <div className="md:col-span-2 flex-col  mt-4 md:flex  overflow-y-auto">
          <div className="flex bg-gray-800 p-4  rounded-lg flex-col gap-4">
            <h1 className="text-xl underline text-blue-400">Profile</h1>
            <div className="flex justify-between capitalize gap-4 items-center">
              <p>Username</p>
              <p>{user?.name}</p>
            </div>

            <div className="flex justify-between capitalize gap-4 items-center">
              <p>Wallet Balance</p>
              <p>{user?.amount}</p>
            </div>

            <div className="flex justify-between capitalize gap-4 items-center">
              <p>Preferred Currency</p>
              <p className="uppercase">{user?.currency}</p>
            </div>

            <div className="flex justify-between  gap-4 items-center">
              <p>Email</p>
              <p>{user?.email}</p>
            </div>

            <div className="flex justify-between capitalize gap-4 items-center">
              <p>Gender</p>
              <p>{user?.gender}</p>
            </div>

            <div className="flex justify-between capitalize gap-4 items-center">
              <p>Account Status</p>
              <p className="text-green-400">{user?.status}</p>
            </div>
          </div>

          <div className="flex bg-gray-800 p-4 mt-4  rounded-lg flex-col gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 text-white py-2 rounded-lg"
            >
              Send Withdrawal Request
            </button>
            <button className="bg-blue-500 text-white py-2 rounded-lg">
              Send Deposit Request
            </button>
          </div>
        </div>

        {/* Withdrawals */}
        <div className="md:col-span-2  lg:overflow-y-auto">
          {withdrawls?.withdrawHistory.map((withdrawl, index) => (
            <div key={index}>
              <div className="bg-gray-800  mt-4 p-4 rounded-lg ">
                <h1>Receiver Name : {withdrawl.receiverName}</h1>
                <h1>Contact : {withdrawl.contact}</h1>
                <h1>Amount : {withdrawl.amount}</h1>
                <h1>
                  Withdrawal Status :{" "}
                  <span className="text-yellow-400 capitalize">
                    {withdrawl.status}
                  </span>{" "}
                </h1>
              </div>
            </div>
          ))}
        </div>

        {/* Deposits */}
        <div className="md:col-span-2  bg-gray-800 p-4 rounded-lg mt-4 md:flex  overflow-y-auto">
          <h1 className="text-xl text-blue-400 ">All Deposits</h1>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[99] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full text-black md:w-1/3">
            <h2 className="text-xl font-bold mb-4">Withdrawal Request</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accNo"
                  value={formData.accNo}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">
                  Receiver Name
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
