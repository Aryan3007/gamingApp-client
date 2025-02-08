/* eslint-disable no-unused-vars */
"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import axios from "axios"
import { server } from "../constants/config"
import { Plus } from "lucide-react"
import Loader from "./../components/Loader"

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer)
  const [withdrawals, setWithdrawals] = useState(null)
  const [deposits, setDeposits] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    amount: "",
    accNo: "",
    ifsc: "",
    contact: "",
    bankName: "",
    receiverName: "",
  })

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      const token = localStorage.getItem("authToken")
      setLoading(true)
      try {
        const response = await axios.get(`${server}/api/v1/payment/status/withdraw?userId=${user?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setWithdrawals(response.data)
      } catch (err) {
        setError(err.message || "Something went wrong!")
      } finally {
        setLoading(false)
      }
    }

    const fetchDeposits = async () => {
      const token = localStorage.getItem("authToken")
      setLoading(true)
      try {
        const response = await axios.get(`${server}/api/v1/payment/status/deposit?userId=${user?._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setDeposits(response.data)
      } catch (err) {
        setError(err.message || "Something went wrong!")
      } finally {
        setLoading(false)
      }
    }

    if (user?._id) {
      fetchPaymentStatus()
      fetchDeposits()
    }
  }, [user?._id])

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("authToken")
    try {
      const response = await axios.post(`${server}/api/v1/payment/request/withdraw?userId=${user?._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        alert("Withdrawal request submitted successfully!")
        setShowModal(false)
        setFormData({
          amount: "",
          accNo: "",
          ifsc: "",
          contact: "",
          bankName: "",
          receiverName: "",
        })
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit request")
    }
  }

  const renderProfileTab = () => (
    <div className="flex bg-gray-800 max-w-xl p-4 rounded-lg flex-col gap-4">
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
      <div className="flex justify-between gap-4 items-center">
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
  )

  const renderWithdrawalTab = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center flex-wrap gap-4">

      <h1 className="text-xl text-blue-400">Withdrawals</h1>
      <div className="flex flex-col gap-4">
        <button onClick={() => setShowModal(true)} className="bg-blue-500 flex justify-center items-center w-fit px-4 text-white py-2 rounded-lg">
          <span><Plus/></span> Withdrawal Request
        </button>
       
      </div>
      </div>
      {withdrawals?.withdrawHistory.map((withdrawal, index) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg">
          <h1>Receiver Name: {withdrawal.receiverName}</h1>
          <h1>Contact: {withdrawal.contact}</h1>
          <h1>Amount: {withdrawal.amount}</h1>
          <h1>
            Withdrawal Status: <span className="text-yellow-400 capitalize">{withdrawal.status}</span>
          </h1>
        </div>
      ))}
    </div>
  )

  const renderDepositTab = () => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h1 className="text-xl text-blue-400">All Deposits</h1>
      {/* Add deposit history here when available */}
    </div>
  )

  const renderMyBetsTab = () => (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h1 className="text-xl text-blue-400">My Bets</h1>
      {/* Add bet history here when available */}
    </div>
  )

  if (loading) return <div><Loader/></div>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="lg:pt-12 pt-24">
      <div className="max-w-full mx-auto p-2 lg:h-[calc(100vh-64px)] flex flex-col lg:flex-row">
        {/* Tabs for mobile */}
        <div className="lg:hidden flex mb-4 bg-gray-700 rounded-lg overflow-hidden">
          {["profile", "withdrawal", "deposit", "mybets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-4 ${
                activeTab === tab ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Sidebar for desktop */}
        <div className="hidden lg:flex gap-2 lg:flex-col lg:w-64  overflow-hidden mr-4">
          {["profile", "withdrawal", "deposit", "mybets"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 rounded-lg text-left ${
                activeTab === tab ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-gray-900"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
          {activeTab === "profile" && renderProfileTab()}
          {activeTab === "withdrawal" && renderWithdrawalTab()}
          {activeTab === "deposit" && renderDepositTab()}
          {activeTab === "mybets" && renderMyBetsTab()}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 p-4 z-[99] bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-700 p-6 rounded-lg w-full text-white md:w-1/3">
              <h2 className="text-xl font-bold mb-4">Withdrawal Request</h2>
              <form className="flex flex-col gap-1 text-white" onSubmit={handleFormSubmit}>
                <div className="mb-2">
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
                <div className="mb-2">
                  <label className="block text-sm font-bold mb-2">Account Number</label>
                  <input
                    type="text"
                    name="accNo"
                    value={formData.accNo}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-bold mb-2">IFSC Code</label>
                  <input
                    type="text"
                    name="ifsc"
                    value={formData.ifsc}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-2">
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
                <div className="mb-2">
                  <label className="block text-sm font-bold mb-2">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-bold mb-2">Receiver Name</label>
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
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile

