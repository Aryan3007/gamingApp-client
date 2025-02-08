import { useEffect, useState } from "react";
import { Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";

export default function BetSlip({ match, onClose }) {
  console.log(match);


  const [betAmount, setBetAmount] = useState(100);
  const quickBets = [
    { label: "100", value: 100 },
    { label: "1K", value: 1000 },
    { label: "5K", value: 5000 },
    { label: "10K", value: 10000 },
    { label: "25K", value: 25000 },
    { label: "50K", value: 50000 },
    { label: "100K", value: 100000 },
    { label: "500K", value: 500000 },
  ];

  const handleQuickBet = (amount) => {
    setBetAmount(amount);
  };

  const handleBetChange = (value) => {
    const newAmount = Math.max(10, Math.min(value, 25000));
    setBetAmount(newAmount);
  };

  return (
    <div className="bg-[#21252b] md:border border-0 border-zinc-700 border-dashed text-white w-full md:p-4 my-2 mt-2 rounded-none md:rounded-lg p-4 h-full">
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
            {match?.selectedTeam}
          </span>

          <span className="text-gray-400">
            ({match?.betType} @ {match?.fancyNumber})
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="flex items-center lg:flex-row gap-2 mb-3 md:mb-6">
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
            className="bg-gray-700 text-center w-32 p-2 rounded-lg "
          />
          <button
            onClick={() => handleBetChange(betAmount + 1)}
            className="bg-blue-500 p-2 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>
        <input
          type="number"
          value={match?.fancyNumber  || ""}
          onChange={(e) =>
            handleBetChange(
              e.target.value ? Number.parseFloat(e.target.value) : ""
            )
          }
          className="bg-gray-700 text-center w-28 p-2 rounded-lg"
        />
      </div>


      {/* Quick Bet Amounts */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 mb-3 md:mb-6">
        {quickBets.map((bet) => (
          <button
            key={bet.value}
            onClick={() => handleQuickBet(bet.value)}
            className="border border-zinc-500 py-2 px-4 rounded text-center hover:bg-gray-600"
          >
            {bet.label}
          </button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-medium"
        >
          Cancel
        </button>
        <button className="flex-1 bg-green-500 py-2 px-8 rounded-lg font-medium">
          Place Bet
        </button>
      </div>
    </div>
  );
}

BetSlip.propTypes = {
  match: PropTypes.shape({
    gameId: PropTypes.string.isRequired,
    eventName: PropTypes.string.isRequired,
    home_team: PropTypes.string.isRequired,
    away_team: PropTypes.string.isRequired,
    selectedTeam: PropTypes.string.isRequired,
    betType: PropTypes.string.isRequired,
    odds: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};
