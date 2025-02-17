"use client"

import { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import io from "socket.io-client"
import { server } from "../../constants/config"
import { calculateProfitAndLoss } from "../../utils/helper"
import BetSlip from "../BetSlip"
import axios from "axios"
import { ChevronRight } from "lucide-react"

const socket = io(server)

const OddsBox = ({ odds, value, type, onClick, isSelected }) => {
  const bgColor = type === "back" ? "bg-[#00B2FF]" : "bg-[#FF7A7F]"
  const hoverColor = type === "back" ? "hover:bg-[#00A1E6]" : "hover:bg-[#FF6B6F]"
  const selectedColor = type === "back" ? "bg-[#0077B3]" : "bg-[#FF4D55]"

  return (
    <button
      onClick={onClick}
      className={`${isSelected ? selectedColor : bgColor} ${hoverColor} w-full sm:w-12 min-w-[60px] md:w-16 rounded flex flex-col items-center justify-center transition-colors p-1`}
    >
      <span className="text-black font-semibold text-sm sm:text-base">{odds}</span>
      <span className="text-black text-[10px] lg:text-xs">{value / 1000}K</span>
    </button>
  )
}

OddsBox.propTypes = {
  odds: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["back", "lay"]).isRequired,
  onClick: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
}

const TeamRow = ({ teamName, backOdds, layOdds, onOddsClick, matchData, stake, selectedOdd, selectionId, margins }) => {
  // Get previous margin for this selection
  const previousMargin = margins?.selectionId === selectionId ? margins?.profit : margins?.loss

  // Calculate total margin if there's a selected odd
  let totalMargin = previousMargin || 0
  if (selectedOdd) {
    const { profit, loss } = calculateProfitAndLoss(stake, selectedOdd.odds, selectedOdd.type, "match odds")

    if (selectedOdd.selectionId === selectionId) {
      // For the selected team
      if (selectedOdd.type === "back") {
        totalMargin += profit
      } else {
        totalMargin -= loss
      }
    } else {
      // For the opposite team
      if (selectedOdd.type === "back") {
        totalMargin -= stake
      } else {
        totalMargin += profit
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2 sm:flex-nowrap justify-between items-center py-2 border-b border-[#2A3447]">
      <div className="flex flex-col">
        <span className="text-white text-sm w-full sm:w-[200px] mb-0 font-semibold sm:mb-0">{teamName}</span>
        <span className="w-full flex justify-start text-xs items-center sm:w-[200px] mb-0 font-semibold sm:mb-0">
          {(previousMargin !== null && previousMargin !== undefined) || selectedOdd ? (
           <>
           <span
             className={
               previousMargin > 0
                 ? "text-green-500"
                 : previousMargin <0
                 ? "text-red-500" 
                 :"text-gray-400 text-xs"
                }
           >
             {Math.abs(previousMargin ?? 0)}
           </span>
           {selectedOdd && (
             <>
               <span className="text-gray-400 scale-75 text-[4px]">
                 <ChevronRight />
               </span>
               <span
                 className={
                   totalMargin > 0
                     ? "text-green-500 text-xs"
                     : totalMargin === 0
                       ? "text-gray-400 text-xs"
                       : "text-red-500 text-xs"
                 }
               >
                 {Math.abs((totalMargin ?? 0).toFixed(0))}
               </span>
             </>
           )}
         </>
         
          ) : null}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:flex gap-1 w-full sm:w-auto">
        {backOdds.map(([odds, value], i) => (
          <div key={`back-${i}`} className="flex flex-col items-center">
            <OddsBox
              odds={odds}
              value={value}
              type="back"
              onClick={() => onOddsClick(matchData, teamName, "Back", odds, value, selectionId)}
              isSelected={
                selectedOdd &&
                selectedOdd.selectionId === selectionId &&
                selectedOdd.type === "back" &&
                selectedOdd.odds === odds
              }
            />
          </div>
        ))}
        {layOdds.map(([odds, value], i) => (
          <div key={`lay-${i}`} className="flex flex-col items-center">
            <OddsBox
              odds={odds}
              value={value}
              type="lay"
              onClick={() => onOddsClick(matchData, teamName, "Lay", odds, value, selectionId)}
              isSelected={
                selectedOdd &&
                selectedOdd.selectionId === selectionId &&
                selectedOdd.type === "lay" &&
                selectedOdd.odds === odds
              }
            />
          </div>
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
  matchData: PropTypes.object.isRequired,
  stake: PropTypes.number.isRequired,
  selectedOdd: PropTypes.object,
  selectionId: PropTypes.string.isRequired,
  margins: PropTypes.object,
}

const arrangeRunners = (runners = [], odds = []) => {
  if (!runners.length || !odds.length) return []
  const draw = runners.find((r) => r?.name === "The Draw")
  const teams = runners.filter((r) => r?.name !== "The Draw")

  return [teams[0], draw, teams[1]].filter(Boolean)
}

export default function MatchOdds({ eventId, onBetSelect, stake, setStake, showBetSlip }) {
  const [sportsData, setSportsData] = useState([])
  const [selectedBet, setSelectedBet] = useState(null)
  const [selectedOdd, setSelectedOdd] = useState(null)
  const [margins, setMargins] = useState(null)



  const handleOddsClick = useCallback(
    (matchData, teamName, type, odds, value, selectionId) => {
      const betData = {
        home_team: matchData?.event?.runners?.[0]?.name || "Unknown",
        away_team: matchData?.event?.runners?.[1]?.name || "Unknown",
        eventId: matchData?.event?.event?.id || "",
        marketId: matchData?.event?.market?.id || "",
        selectionId: selectionId,
        fancyNumber: null,
        stake: stake,
        odds: odds || 0,
        category: "match odds",
        type: type.toLowerCase(),
        gameId: matchData?.market?.id || "",
        eventName: teamName,
        selectedTeam: teamName,
        betType: type,
        size: value || 0,
      }

      setSelectedBet(betData)
      setSelectedOdd({
        selectionId,
        type: type.toLowerCase(),
        odds,
      })
      onBetSelect(betData)
    },
    [stake, onBetSelect],
  )

  useEffect(() => {
    socket.on("sportsData", (data) => {
      setSportsData(data)
    })

    return () => {
      socket.off("sportsData")
    }
  }, [])

  const matches = sportsData?.[4]?.[4] || []
  const matchData = matches.find((match) => match.event?.event?.id === eventId)
  const oddsData = matchData?.odds?.[0]
  const runners = arrangeRunners(matchData?.event?.runners, oddsData?.runners || [])

  const runnersWithOdds = runners.map((runner) => {
    const runnerOdds = oddsData?.runners?.find((r) => r.selectionId === runner.id)
    return {
      selectionId: runnerOdds?.selectionId,
      name: runner.name,
      back: runnerOdds?.back || [],
      lay: runnerOdds?.lay || [],
    }
  })



  const getMargins = useCallback(
    async (token) => {
      try {
        const response = await axios.get(`${server}api/v1/bet/margins?eventId=${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (response.data.success) {
          // Store the complete margin data
          console.log(matchData?.event?.market?.id );
          const marginsData = response.data.margins[matchData?.event?.market?.id ]
          setMargins(marginsData)
        }
      } catch (error) {
        console.error("Error fetching margins:", error.response?.data || error.message)
      }
    },
    [eventId, matchData?.event?.market?.id ],
  )

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      getMargins(token)
    }
  }, [getMargins])

  return (
    <div>
      <div className="bg-[#1a2027] mb-2 rounded-lg overflow-hidden w-full">
        <div className="flex flex-wrap sm:flex-nowrap bg-[#2c3847] py-2 justify-between items-center px-4 mb-0">
          <h2 className="text-white text-lg">Match Odds</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-1 sm:-translate-x-[130px]">
              <span className="bg-[#00B2FF] text-black px-6 py-1 rounded text-xs sm:text-sm font-medium">Back</span>
              <span className="bg-[#FF7A7F] text-black px-6 py-1 rounded text-xs sm:text-sm font-medium">Lay</span>
            </div>
          </div>
        </div>

        <div className="py-2 px-4">
          {runnersWithOdds.map((runner, index) => {
            const backOdds = (runner.back || []).map((odds) => [odds.price, odds.size]).reverse()
            const layOdds = (runner.lay || []).map((odds) => [odds.price, odds.size])

            return (
              <TeamRow
                key={index}
                teamName={runner.name}
                backOdds={backOdds}
                layOdds={layOdds}
                onOddsClick={handleOddsClick}
                matchData={matchData}
                stake={stake}
                selectedOdd={selectedOdd}
                selectionId={runner.selectionId}
                margins={margins}
              />
            )
          })}
        </div>
      </div>

      {showBetSlip && (
        <div className="lg:hidden my-4">
          {selectedBet ? (
            <BetSlip match={selectedBet} onClose={() => setSelectedBet(null)} setStake={setStake} />
          ) : (
            <div className="bg-[#1a2027] p-4 rounded-lg text-white text-center">Select an odd to place a bet</div>
          )}
        </div>
      )}
    </div>
  )
}

MatchOdds.propTypes = {
  eventId: PropTypes.string.isRequired,
  onBetSelect: PropTypes.func.isRequired,
  stake: PropTypes.number.isRequired,
  setStake: PropTypes.func.isRequired,
  showBetSlip: PropTypes.bool.isRequired,
}

