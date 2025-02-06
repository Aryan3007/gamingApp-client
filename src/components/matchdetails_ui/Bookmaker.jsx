"use client"

import { memo, useState } from "react"
import PropTypes from "prop-types"
import isEqual from "lodash/isEqual"
import BetSlip from "../BetSlip"
import { ChevronDown } from "lucide-react"

const BookmakerComponent = ({ data, onBetSelect }) => {
  const [selectedBet, setSelectedBet] = useState(null)

  const handleOddsClick = (market, runner, type, odds) => {
    const betData = {
      gameId: market.market.id,
      eventName: market.market.name,
      home_team: market.runners[0]?.name || "Unknown",
      away_team: market.runners[1]?.name || "Unknown",
      selectedTeam: runner.name,
      betType: type,
      odds: odds,
    }
    setSelectedBet(betData)
    onBetSelect(betData)
  }

  const renderOddsBox = (odds, market, runner, type) => {
    const isActive = odds && odds.price > 0 && odds.size > 0

    if (!isActive) {
      return (
        <div className="flex items-center justify-center h-14 bg-[#1a2027] rounded">
          <span className="text-[#ff4d4f] text-sm font-medium">SUSPENDED</span>
        </div>
      )
    }

    return (
      <button
        className={`w-full sm:w-12 min-w-[100px] md:w-16 h-10 ${
          type === "Back" ? "bg-[#00B2FF] hover:bg-[#00A1E6]" : "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
        } rounded flex flex-col items-center justify-center transition-colors`}
        onClick={() => handleOddsClick(market, runner, type, odds.price)}
      >
        <span className="text-black text-sm font-semibold">{odds.price.toFixed(2)}</span>
        <span className="text-black text-xs">{Math.floor(odds.size)}</span>
      </button>
    )
  }

  const getRunnerDisplayName = (runner, market) => {
    const marketName = market.market.name.toLowerCase()
    if (marketName.includes("tied match") || marketName.includes("completed match")) {
      const matchingRunner = market.runners.find((r) => r.id === runner.selectionId)
      if (matchingRunner && matchingRunner.name) {
        return matchingRunner.name
      }
      // If no matching runner or the name is empty, use Yes/No based on sortPriority
      return runner.sortPriority === 100 ? "Yes" : "No"
    }
    return runner.name || "Unknown"
  }

  if (!Array.isArray(data)) {
    return <div className="text-white">No bookmaker data available</div>
  }

  // Filter out markets with empty odds arrays
  const validMarkets = data.filter((market) => Array.isArray(market.odds?.runners) && market.odds.runners.length > 0)

  return (
    <div className="space-y-4 mt-4">
      {validMarkets.map((market, index) => (
        <div key={`${market.market?.id || index}`} className="bg-[#1a2027] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-[#262a31]">
            <div className="flex items-center gap-2">
            <span className="text-[#72bbff] text-sm font-medium">
                {market.market?.name === "Bookmaker 0%Comm" ? "Bookmaker" : market.market?.name || "Unknown Market"}
              </span>            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-[#00B2FF] px-4 py-1 rounded text-black font-medium">Back</span>
              <span className="text-xs bg-[#FF7A7F] px-4 py-1 rounded text-black font-medium">Lay</span>
            </div>
          </div>

          {/* Odds Grid */}
          <div className="divide-y divide-[#2c3847]">
            {market.odds?.runners?.map((runner, runnerIndex) => {
              const displayName = getRunnerDisplayName(runner, market)
              const isSuspended = runner.runnerStatus === "SUSPENDED"

              return (
                <div key={runnerIndex} className="flex items-center p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white">
                      <span>{displayName}</span>
                     
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-fit">
                    {isSuspended ? (
                      <div className="col-span-2 flex items-center justify-center h-10 bg-[#1a2027] rounded">
                        <span className="text-[#ff4d4f] text-sm font-medium">SUSPENDED</span>
                      </div>
                    ) : (
                      <>
                        {renderOddsBox(runner.back?.[0], market, runner, "Back")}
                        {renderOddsBox(runner.lay?.[0], market, runner, "Lay")}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mobile BetSlip */}
          {selectedBet && selectedBet.gameId === market.market.id && (
            <div className="md:hidden mt-2">
              <BetSlip key={`betslip-${market.market.id}`} match={selectedBet} onClose={() => setSelectedBet(null)} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

BookmakerComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onBetSelect: PropTypes.func.isRequired,
}

const arePropsEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.data, nextProps.data) && prevProps.onBetSelect === nextProps.onBetSelect
}

const Bookmaker = memo(BookmakerComponent, arePropsEqual)
Bookmaker.displayName = "Bookmaker"

export default Bookmaker

