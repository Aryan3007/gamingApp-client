import React, { useEffect, useState } from 'react'
import { server } from '../constants/config';
import axios from 'axios';
import { useSelector } from 'react-redux';

const MyBets = () => {
  console.log("bets");
  const [allBets, setAllBets] = useState([]);
  const { user } = useSelector((state) => state.userReducer);

    const getTransactions = async () => {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found");
          return;
        }
        try {
          const response = await axios.get(
            `${server}/api/v1/bet/transactions?userId=${user._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Filter only "pending" bets
          // Filter only "pending" bets and sort them (newest first)
          const pendingBets = response.data.bets
            .filter((bet) => bet.status === "pending")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
          setAllBets(pendingBets);
        } catch (error) {
          console.error("Error fetching transactions:", error);
          return null;
        }
      };

      useEffect(()=>{
        getTransactions
      },[])


  return (
    <div>
         <div className=" p-4 rounded-lg">
      <h1 className="text-xl text-blue-400 mb-4">My Bets</h1>
      <div className="overflow-y-auto grid grid-cols-1  md:grid-cols-2 xl:grid-cols-3  gap-4">
        {allBets.map((bet, index) => (
          <div
            key={index}
            className=" transition-all duration-200"
          >
            <div className="flex flex-col bg-[#1f2937] space-y-3 border-zinc-600 border rounded-lg p-4 border-dashed">
              {/* Match and Time */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {bet.match}
                  </h3>
                  <div className="flex items-center text-gray-400 text-sm mt-1"></div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    bet.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : "bg-green-500/20 text-green-500"
                  }`}
                >
                  {bet.status}
                </span>
              </div>

              {/* Betting Details */}
              <div className="grid grid-cols-3 gap-1">
                <div className="flex flex-row justify-center items-center gap-1">
                  <span className="text-gray-400 text-xs flex items-center">
                    Stake
                  </span>
                  <span className="text-white text-xs font-medium uppercase">
                    {user.currency} {bet.stake}
                  </span>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                  <span className="text-gray-400 text-xs flex items-center">
                    Payout
                  </span>
                  <span className="text-white text-xs font-medium uppercase">
                    {user.currency} {bet.payout}
                  </span>
                </div>
                <div className="flex flex-row justify-center items-center gap-1">
                  <span className="text-gray-400 text-xs flex items-center">
                    Payout
                  </span>
                  <span className="text-white text-xs font-medium capitalize">
                    {bet.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>{" "}
    </div>
    </div>
  )
}

export default MyBets