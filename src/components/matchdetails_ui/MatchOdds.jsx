/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import PropTypes from "prop-types"
import io from "socket.io-client"
import BetSlip from "../BetSlip"
import { server } from "../../constants/config"

const socket = io(server)

const OddsBox = ({ odds, value, type, onClick }) => {
  const bgColor = type === "back" ? "bg-[#00B2FF]" : "bg-[#FF7A7F]"
  const hoverColor = type === "back" ? "hover:bg-[#00A1E6]" : "hover:bg-[#FF6B6F]"

  return (
    <button
      onClick={onClick}
      className={`${bgColor} ${hoverColor} w-full sm:w-12 min-w-[50px] md:w-16 h-8 rounded flex flex-col items-center justify-center transition-colors`}
    >
      <span className="text-black font-semibold text-sm sm:text-base">{odds}</span>
    </button>
  )
}

OddsBox.propTypes = {
  odds: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["back", "lay"]).isRequired,
  onClick: PropTypes.func.isRequired,
}

const TeamRow = ({ teamName, backOdds, layOdds, onOddsClick }) => {
  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center py-1 border-b border-[#2A3447]">
      <span className="text-white text-sm w-full sm:w-[200px] mb-2 sm:mb-0">{teamName}</span>
      <div className="grid grid-cols-3 sm:flex gap-1 w-full sm:w-auto">
        {backOdds.map(([odds, value], i) => (
          <OddsBox
            key={`back-${i}`}
            odds={odds}
            value={value}
            type="back"
            onClick={() => onOddsClick(teamName, "Back", odds)}
          />
        ))}
        {layOdds.map(([odds, value], i) => (
          <OddsBox
            key={`lay-${i}`}
            odds={odds}
            value={value}
            type="lay"
            onClick={() => onOddsClick(teamName, "Lay", odds)}
          />
        ))}
      </div>
    </div>
  )
}

TeamRow.propTypes = {
  teamName: PropTypes.string.isRequired,
  backOdds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  layOdds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  onOddsClick: PropTypes.func.isRequired,
}

// Helper function to arrange runners with draw in middle
const arrangeRunners = (runners = [], odds = []) => {
  if (!runners.length || !odds.length) return []
  const draw = runners.find((r) => r?.name === "The Draw")
  const teams = runners.filter((r) => r?.name !== "The Draw")

  return [teams[0], draw, teams[1]].filter(Boolean) // Remove null/undefined values
}

export default function MatchOdds({ eventId, onBetSelect }) {
  const [sportsData, setSportsData] = useState([])
  const [selectedBet, setSelectedBet] = useState(null)

  const handleOddsClick = (team, type, odds) => {
    const betData = {
      gameId: eventId,
      home_team: matchData?.event?.runners?.[0]?.name,
      away_team: matchData?.event?.runners?.[1]?.name,
      selectedTeam: team,
      betType: type,
      odds: odds,
    }
    setSelectedBet(betData)
    onBetSelect(betData)
  }

  const handleCloseBetSlip = () => {
    setSelectedBet(null)
  }

  useEffect(() => {
    socket.on("sportsData", (data) => {
      setSportsData(data)
    })

    return () => {
      socket.off("sportsData")
    }
  }, [])

  // Find the correct match data from the nested structure
  const matches = sportsData?.[4]?.[4] || []
  const matchData = matches.find((match) => match.event?.event?.id === eventId)

  // Get the first odds entry and its runners
  const oddsData = matchData?.odds?.[0]

  // Use arrangeRunners to get properly ordered runners
  const runners = arrangeRunners(matchData?.event?.runners, oddsData?.runners || [])

  // Map the runners to their odds
  const runnersWithOdds = runners.map((runner) => {
    const runnerOdds = oddsData?.runners?.find((r) => r.selectionId === runner.id)
    return {
      name: runner.name,
      back: runnerOdds?.back || [],
      lay: runnerOdds?.lay || [],
    }
  })

  return (
    <div>
      <div className="bg-[#262a31] mb-4 p-4 rounded-lg w-full">
        <div className="flex flex-wrap sm:flex-nowrap justify-between items-center mb-4">
          <h2 className="text-white text-lg">Match Odds</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2 sm:-translate-x-10">
              <span className="bg-[#00B2FF] text-black px-3 py-1 rounded text-xs sm:text-sm font-medium">Back</span>
              <span className="bg-[#FF7A7F] text-black px-3 py-1 rounded text-xs sm:text-sm font-medium">Lay</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">Min: 10 | Max: 5L</span>
          </div>
        </div>

        <div className="space-y-2">
          {runnersWithOdds.map((runner, index) => {
            // Format back odds - extract price and size from each back entry
            const backOdds = (runner.back || []).map((odds) => [odds.price, odds.size])

            // Format lay odds - extract price and size from each lay entry
            const layOdds = (runner.lay || []).map((odds) => [odds.price, odds.size])

            return (
              <TeamRow
                key={index}
                teamName={runner.name}
                backOdds={backOdds}
                layOdds={layOdds}
                onOddsClick={handleOddsClick}
              />
            )
          })}
        </div>
      </div>

      {/* BetSlip for mobile */}
      {selectedBet && (
        <div className="md:hidden my-4">
          <BetSlip match={selectedBet} onClose={handleCloseBetSlip} />
        </div>
      )}
    </div>
  )
}

MatchOdds.propTypes = {
  eventId: PropTypes.number.isRequired,
  onBetSelect: PropTypes.func.isRequired,
}
