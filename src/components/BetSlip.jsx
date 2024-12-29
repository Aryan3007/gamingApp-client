import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import PropTypes from 'prop-types'

export default function BetSlip({ match, onClose }) {
  const [betAmount, setBetAmount] = useState(10)
  const [keep, setKeep] = useState(true)
  const [fillOrKill, setFillOrKill] = useState(false)

  const quickBets = [
    { label: '100', value: 100 },
    { label: '1K', value: 1000 },
    { label: '5K', value: 5000 },
    { label: '10K', value: 10000 },
    { label: '25K', value: 25000 },
    { label: '50K', value: 50000 },
    { label: '100K', value: 100000 },
    { label: '500K', value: 500000 }
  ]

  const handleQuickBet = (amount) => {
    setBetAmount(amount)
  }

  const handleBetChange = (value) => {
    const newAmount = Math.max(10, Math.min(value, 25000))
    setBetAmount(newAmount)
  }

  return (
    <div className="bg-gray-800 text-white w-full p-4  h-fit rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold">{match.home_team} v {match.away_team}</h2>
          <h3 className="text-gray-400 text-sm">Match Odds</h3>
        </div>
        <div className="text-right">
          <p className="text-sm">Min: 10</p>
          <p className="text-sm">Max: 25T</p>
        </div>
      </div>

      {/* Back/Lay Selection */}
      <div className="mb-4">
        <div className="bg-gray-700 p-2 rounded inline-block">
          <span className={match.betType === 'back' ? 'text-blue-400' : 'text-pink-400'}>
            {match.betType.toUpperCase()}
          </span>{' '}
          <span className="text-gray-400">{match.selectedTeam}</span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="flex items-center flex-col md:flex-row gap-2 mb-6">
        <div className='flex gap-2 items-center'>

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
          value={match.odds}
          className="bg-gray-700 text-center p-2 rounded-lg w-20"
          readOnly
        />
      </div>

      {/* Toggle Options */}
      <div className="flex md:flex-col gap-4">
        <button
          onClick={() => setKeep(!keep)}
          className={`flex-1 py-1 px-4 rounded ${
            keep ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        >
          Keep
        </button>
        <button
          onClick={() => setFillOrKill(!fillOrKill)}
          className={`flex-1 py-1 px-4 rounded ${
            fillOrKill ? 'bg-blue-500' : 'bg-gray-700'
          }`}
        >
          Fill Or Kill
        </button>
      </div>

      <div className=' text-sm w-full my-2'>
Potential Winning Amount : <span> ${betAmount*match.odds}</span>
      </div>

      {/* Quick Bet Amounts */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
        {quickBets.map((bet) => (
          <button
            key={bet.value}
            onClick={() => handleQuickBet(bet.value)}
            className="bg-gray-700 py-2 px-4 rounded text-center hover:bg-gray-600"
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
  )
}

BetSlip.propTypes = {
  match: PropTypes.shape({
    team1: PropTypes.string.isRequired,
    team2: PropTypes.string.isRequired,
    betType: PropTypes.oneOf(['back', 'lay']).isRequired,
    selectedTeam: PropTypes.string.isRequired,
    odds: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
}
