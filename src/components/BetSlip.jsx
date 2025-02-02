import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import PropTypes from "prop-types";

export default function BetSlip({ match, onClose }) {
  const [betAmount, setBetAmount] = useState(10);
  const [keep, setKeep] = useState(true);
  const [fillOrKill, setFillOrKill] = useState(false);

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
    <div className="bg-[#21252b] border-l border-zinc-700 border-dashed text-white w-full md:p-4 p-1 h-full">
      {/* Header */}
      <div className="flex justify-between items-end md:mb-4">
        <div>
          <h2 className="text-lg hidden md:flex font-bold">{match?.home_team} vs {match?.away_team}</h2>
          <h3 className="text-gray-400 text-sm">Match Odds</h3>
        </div>
        <div className="text-right">
          <p className="text-xs">Min: 10</p>
          <p className="text-xs">Max: 25K</p>
        </div>
      </div>

      {/* Match Details */}
      <div className="mb-4 text-sm lg:text-base">
        <div className="md:p-2 p-0 rounded inline-block bg-gray-800">
          <span className="text-blue-400 font-semibold">{match?.selectedTeam}</span>{" "}
          <span className="text-gray-400">({match?.betType.toUpperCase()} @ {match?.odds})</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="flex items-center flex-row gap-2 mb-3 md:mb-6">
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
            onChange={(e) => handleBetChange(parseFloat(e.target.value))}
            className="bg-gray-700 text-center w-44 md:w-24 p-2 rounded-lg flex-1"
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
          className="bg-gray-700 text-center p-2 rounded-lg w-20"
          readOnly
          value={betAmount * match?.odds}
        />
      </div>

      {/* Toggle Options */}
      <div className="flex md:flex-col gap-4">
        <button
          onClick={() => setKeep(!keep)}
          className={`flex-1 py-1 px-4 rounded ${
            keep ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Keep
        </button>
        <button
          onClick={() => setFillOrKill(!fillOrKill)}
          className={`flex-1 py-1 px-4 rounded ${
            fillOrKill ? "bg-blue-500" : "bg-gray-700"
          }`}
        >
          Fill Or Kill
        </button>
      </div>

      <div className="text-sm w-full my-2">
        Potential Winning Amount: <span>${(betAmount * match?.odds).toFixed(2)}</span>
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
          className="flex-1 bg-red-500/20 text-red-500 py-2 rounded-lg font-medium"
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
    home_team: PropTypes.string.isRequired,
    away_team: PropTypes.string.isRequired,
    selectedTeam: PropTypes.string.isRequired,
    betType: PropTypes.string.isRequired,
    odds: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};
