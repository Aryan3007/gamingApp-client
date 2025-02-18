"use client"

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import axios from "axios"
import { Minus, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { server } from "../constants/config"
import { calculateProfitAndLoss } from "../utils/helper"

const BetSlip = memo(({ match, onClose, setStake }) => {
  const [betAmount, setBetAmount] = useState(100)
  const [allBets, setAllBets] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state) => state.userReducer)
  const prevMatchRef = useRef(null)
  const matchRef = useRef(match)

  useEffect(() => {
    if (JSON.stringify(match) !== JSON.stringify(prevMatchRef.current)) {
      matchRef.current = match
      prevMatchRef.current = match
    }
  }, [match])

  const { profit, loss } = useMemo(() => {
    const currentMatch = matchRef.current
    return currentMatch
      ? calculateProfitAndLoss(betAmount, currentMatch.odds, currentMatch.type, currentMatch.category)
      : { profit: 0, loss: 0 }
  }, [betAmount])

  const quickBets = useMemo(
    () => [
      { label: "100", value: 100 },
      { label: "1K", value: 1000 },
      { label: "5K", value: 5000 },
      { label: "10K", value: 10000 },
      { label: "25K", value: 25000 },
      { label: "50K", value: 50000 },
      { label: "100K", value: 100000 },
      { label: "500K", value: 500000 },
    ],
    [],
  )

  const handleQuickBet = useCallback(
    (amount) => {
      setBetAmount(amount)
      setStake(amount)
    },
    [setStake],
  )

  const handleBetChange = useCallback(
    (value) => {
      const newAmount = Math.max(0, Math.min(value, 500000))
      setBetAmount(newAmount)
      setStake(newAmount)
    },
    [setStake],
  )

  const getTransactions = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      console.error("No token found")
      return
    }

    try {
      const response = await axios.get(`${server}api/v1/bet/transactions?userId=${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const pendingBets = response.data.bets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setAllBets(pendingBets)
    } catch (error) {
      console.error("Error fetching transactions:", error)
      return null
    }
  }, [user])

  const placeBet = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    const currentMatch = matchRef.current

    if (!token) {
      toast.error("You need to login!")
      return
    }

    if (!currentMatch) {
      toast.error("Select a bet first!")
      return
    }

    try {
      setLoading(true)
      const { data } = await axios.post(
        `${server}api/v1/bet/place?userId=${user._id}`,
        {
          eventId: currentMatch.eventId,
          selection:currentMatch.selectedTeam,
          match: `${currentMatch.home_team} vs ${currentMatch.away_team}`,
          marketId: currentMatch.marketId,
          selectionId: currentMatch.selectionId,
          fancyNumber: currentMatch.fancyNumber,
          stake: betAmount,
          odds: currentMatch.odds,
          category: currentMatch.category,
          type: currentMatch.type,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (data.success) {
        getTransactions()
        toast.success(data.message)
        onClose()
      } else {
        toast.error(data.message || "Failed to place bet.")
      }
    } catch (error) {
      console.error(error)
      toast.error("An error occurred while placing the bet.")
    } finally {
      setLoading(false)
    }
  }, [user, betAmount, onClose, getTransactions])

  useEffect(() => {
    getTransactions()
  }, [getTransactions])

  const currentMatch = matchRef.current

  return (
    <div className="lg:bg-[#21252b] bg-[#1a2027] lg:rounded-md rounded-none md:border border-0 border-zinc-700 border-dashed text-white w-full md:p-4 md:pt-2 my-2 mt-2 md:rounded-lg p-4 flex flex-col h-full lg:h-[calc(100vh-64px)]">
      <div className="flex justify-between items-start ">
        <div>
          <h2 className="text-lg capitalize max-w-52 mb-2 flex font-bold">
            {currentMatch ? `${currentMatch.home_team} vs ${currentMatch.away_team}` : "Select a bet"}
          </h2>
        </div>

        <div className="text-sm">
          <h1>Min : 100</h1>
          <h1>Max : 50L</h1>
        </div>
      </div>

      <div className="mb-2 text-sm lg:text-base">
        <div className="md:p-2 p-0 max-w-52 rounded inline-block bg-gray-800">
          <span
            className={`font-semibold ${
              currentMatch?.betType === "Lay" || currentMatch?.betType === "No" ? "text-red-400" : "text-blue-400"
            }`}
          >
            {currentMatch?.selectedTeam}{" "}
          </span>
          <span className="text-gray-400 ">
            ({currentMatch?.betType} @ {currentMatch?.odds})
          </span>
        </div>
      </div>

      <div className="flex items-center lg:flex-row gap-2 mb-2 md:mb-2">
        <div className="flex gap-2 items-center">
          <button onClick={() => handleBetChange(betAmount - 1)} className="bg-blue-500 p-2 rounded-lg">
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => handleBetChange(Number.parseFloat(e.target.value))}
            className="bg-gray-700 text-center w-32 p-2 rounded-lg"
          />
          <button onClick={() => handleBetChange(betAmount + 1)} className="bg-blue-500 p-2 rounded-lg">
            <Plus size={20} />
          </button>
        </div>
      </div>

      

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 my-3 md:my-2">
        {quickBets.map((bet) => (
          <button
            key={bet.value}
            onClick={() => handleQuickBet(bet.value)}
            className={`border border-zinc-500 py-2 px-4 rounded text-center hover:bg-gray-600 ${
              bet.value > user?.amount ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={bet.value > user?.amount}
          >
            {bet.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-medium transition duration-300 hover:bg-red-500 hover:text-white"
        >
          Cancel
        </button>
        <button
          onClick={placeBet}
          className="flex-1 bg-green-500 py-2 px-8 rounded-lg font-medium transition duration-300 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Placing Bet..." : "Place Bet"}
        </button>
      </div>

      {user && (
  <div className="mt-4 flex-1 xl:flex hidden overflow-hidden flex-col">
    <h1 className="mb-2 font-semibold underline text-blue-500">Open Bets:</h1>
    <div className="overflow-y-auto flex-1">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2 text-xs font-semibold text-gray-300">Name</th>
            <th className="p-2 text-xs font-semibold text-gray-300">Stake</th>
            <th className="p-2 text-xs font-semibold text-gray-300">Odds</th>
            {allBets.some((bet) => bet.fancyNumber) && (
              <th className="p-2 text-xs font-semibold text-gray-300">Run</th>
            )}
          </tr>
        </thead>
        <tbody>
          {allBets.map((bet, index) => (
            <tr
              key={index}
              className={` ${
                bet.type === "back" ? "bg-blue-400" : "bg-red-400"
              } transition-all duration-200`}
            >
              <td className="p-2 text-xs text-white border-t border-gray-600">{bet.selection}</td>
              <td className="p-2 text-xs text-white border-t border-gray-600">
                {bet.stake.toFixed(2)}
              </td>
              <td className="p-2 text-xs text-white border-t border-gray-600">{bet.odds}</td>
              {allBets.some((bet) => bet.fancyNumber) && (
                <td className="p-2 text-xs text-white border-t border-gray-600 capitalize">
                  {bet.fancyNumber || "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}

    </div>
  )
})

BetSlip.displayName = "BetSlip"

export default BetSlip

