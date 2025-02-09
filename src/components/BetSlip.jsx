import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { server } from "../constants/config";
import { calculateProfitAndLoss } from "../utils/calculateProfitAndLoss";

export default function BetSlip({ match, onClose }) {
  const [betAmount, setBetAmount] = useState(100);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.userReducer);
  const prevMatch = useRef(null); // Store previous match data

  // Only update state if the match has actually changed
  useEffect(() => {
    if (match && JSON.stringify(match) !== JSON.stringify(prevMatch.current)) {
      prevMatch.current = match; // Update the stored match
    }
  }, [match]);

  // Memoized profit and loss calculations
  const { profit, loss } = useMemo(() => {
    return match
      ? calculateProfitAndLoss(
          betAmount,
          match.fancyNumber,
          match.type,
          match.category
        )
      : { profit: 0, loss: 0 };
  }, [betAmount, match]);

  // Quick bet options
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
    []
  );

  const handleQuickBet = useCallback((amount) => {
    setBetAmount(amount);
  }, []);

  const handleBetChange = useCallback((value) => {
    setBetAmount(Math.max(0 , Math.min(value, 25000)));
  }, []);

  const placeBet = async () => {
    const token = localStorage.getItem("authToken");
    let wallet = Number(localStorage.getItem("walletAmount")); // Convert to number
  
    if (!token) {
      console.error("No token found");
      return;
    }
    if (!match) {
      toast.error("Match details are missing!");
      return;
    }

  
    const payload = {
      eventId: match.eventId,
      match: `${match.home_team} vs ${match.away_team}`,
      marketId: match.marketId,
      selectionId: match.selectionId,
      fancyNumber: match.fancyNumber,
      stake: betAmount,
      odds: match.odds,
      category: match.category,
      type: match.type,
    };
  
    try {
      setLoading(true);
      const response = await fetch(
        `${server}/api/v1/bet/place?userId=${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        toast.success("Bet placed successfully!");
  
        // Deduct stake from wallet and update localStorage
        const newWalletAmount = wallet - betAmount;
        localStorage.setItem("walletAmount", newWalletAmount.toString());
  
        onClose();
      } else {
        toast.error(data.message || "Failed to place bet.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while placing the bet.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="lg:bg-[#21252b] bg-[#1a2027] lg:rounded-md rounded-none md:border border-0 border-zinc-700 border-dashed text-white w-full md:p-4 my-2 mt-2 md:rounded-lg p-4 h-full lg:h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex justify-between items-end md:mb-4">
        <div>
          <h2 className="text-lg capitalize flex font-bold">
            {match
              ? `${match.home_team} vs ${match.away_team}`
              : "Select a bet"}
          </h2>
        </div>
      </div>

      {/* Match Details */}
      <div className="mb-4 text-sm lg:text-base">
        <div className="md:p-2 p-0 rounded inline-block bg-gray-800">
          <span
            className={`font-semibold ${
              match?.betType === "Lay" || match?.betType === "No"
                ? "text-red-400"
                : "text-blue-400"
            }`}
          >
            {match?.selectedTeam}{" "}
          </span>
          <span className="text-gray-400">
            ({match?.betType} @ {match?.fancyNumber})
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="flex items-center lg:flex-row gap-2 mb-2 md:mb-6">
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleBetChange(betAmount - 1)}
            className="bg-blue-500 p-2 rounded-lg"
          >
            <Minus size={20} />
          </button>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => handleBetChange(Number.parseFloat(e.target.value))}
            className="bg-gray-700 text-center w-32 p-2 rounded-lg"
          />
          <button
            onClick={() => handleBetChange(betAmount + 1)}
            className="bg-blue-500 p-2 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Calculations */}

      {user && match && (
        <div className="text-sm flex justify-evenly gap-2 lg:text-sm mb-2">
          <div className="flex gap-1 justify-center items-center w-full py-1 bg-red-900 px-3 rounded-md text-white">
            <span className="font-semibold ">Loss:</span>
            <span className="uppercase">
              {user?.currency} {loss?.toFixed(2)}
            </span>
          </div>
          <div className="flex gap-1 justify-center items-center w-full py-1 bg-green-900 px-3 rounded-md text-white">
            <span className="font-semibold "> Profit:</span>
            <span className="uppercase">
              {" "}
              {user?.currency} {profit?.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Quick Bet Amounts */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 my-3 md:my-6">
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

      {!user && (
        <p className="text-center mb-2 text-red-500">Login to place bet</p>
      )}
      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button
          onClick={placeBet}
          className="flex-1 bg-green-500 py-2 px-8 rounded-lg font-medium"
          disabled={!user || loading}
        >
          {loading ? "Placing Bet..." : "Place Bet"}
        </button>
      </div>
    </div>
  );
}

BetSlip.propTypes = {
  match: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};
