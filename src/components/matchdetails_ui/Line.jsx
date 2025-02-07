"use client"

import React, { memo, useState } from "react"
import PropTypes from "prop-types"
import isEqual from "lodash/isEqual"
import BetSlip from "../BetSlip"

const LineComponent = ({ data, onBetSelect }) => {
  const [selectedBet, setSelectedBet] = useState(null)

  const handleOddsClick = (market, runner, type, odds) => {
    const betData = {
      gameId: market.event?.event?.id,
      eventName: market.market?.name,
      home_team: market.event?.runners?.[0]?.name,
      away_team: market.event?.runners?.[1]?.name,
      selectedTeam: runner.name,
      betType: type,
      odds: odds,
    }
    setSelectedBet(betData)
    onBetSelect(betData)
  }

  const renderOddsBox = (odds, market, runner, type) => {
    const isActive = odds && odds.price > 0 && odds.size > 0

    return (
      <button
        className={`w-full sm:w-12 min-w-[100px] md:w-16 h-10  ${
          type === "Back"
            ? isActive
              ? "bg-[#00B2FF] hover:bg-[#00A1E6]"
              : "bg-[#00b3ff36]"
            : isActive
              ? "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
              : "bg-[#ff7a7e42]"
        } rounded flex flex-col items-center justify-center transition-colors`}
        onClick={() => isActive && handleOddsClick(market, runner, type, odds.price)}
        disabled={!isActive}
      >
        {isActive ? (
          <>
            <span className="text-black text-sm font-semibold">{odds.price.toFixed(2)}</span>
            <span className="text-black text-xs">{Math.floor(odds.size)}</span>
          </>
        ) : (
          <span className="text-gray-500 text-xs">-</span>
        )}
      </button>
    )
  }

  const sortMarkets = (markets) => {
    return [...markets].sort((a, b) => {
      const aActive = a.odds.status !== "SUSPENDED" && (a.odds.back?.[0]?.price > 0 || a.odds.lay?.[0]?.price > 0)
      const bActive = b.odds.status !== "SUSPENDED" && (b.odds.back?.[0]?.price > 0 || b.odds.lay?.[0]?.price > 0)
      return bActive - aActive
    })
  }

  if (!Array.isArray(data)) {
    return <div className="text-white">No Line data available</div>
  }

  return (
    <div className="space-y-2 bg-[#242a31] rounded-lg overflow-hidden mt-4">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 bg-[#2c3847]">
        <h3 className="text-white font-medium w-full sm:w-auto mb-2 sm:mb-0">Line Markets</h3>
        <div className="flex flex-row sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs bg-[#00B2FF] sm:text-sm w-full text-center px-6 text-black py-1 rounded-sm font-semibold">
            Yes
          </span>
          <span className="text-xs sm:text-sm bg-[#FF7A7F] w-full text-center px-6 text-black py-1 rounded-sm font-semibold">
            No
          </span>
        </div>
      </div>
        {sortMarkets(data)?.map((market, index) => {
              const isSuspended = market.odds?.status === "SUSPENDED" 
      
              return (
                <div key={`${market.market?.id || index}`} className="border-b border-[#2c3847]">
                  <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 py-2">
                    <span className="text-white text-sm w-full sm:w-[200px] mb-2 sm:mb-0">
                      {market.market?.name || "Unknown Market"}
                    </span>
                    {isSuspended ? (
                      <div className="col-span-2 flex items-center justify-center h-10 bg-[#1a2027] rounded w-full sm:w-auto">
                        <span className="text-[#ff4d4f] text-sm px-4 font-medium">SUSPENDED</span>
                      </div>
                    ) : (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <div className="w-1/2 sm:w-auto">{renderOddsBox(market.odds?.back?.[0], market, "Back")}</div>
                        <div className="w-1/2 sm:w-auto">{renderOddsBox(market.odds?.lay?.[0], market, "Lay")}</div>
                      </div>
                    )}
                  </div>
                  {selectedBet && selectedBet.gameId === market.market.id && (
                    <div className="md:hidden mt-2">
                      <BetSlip match={selectedBet} onClose={() => setSelectedBet(null)} />
                    </div>
                  )}
                </div>
              )
            })}
    </div>
  )
}

LineComponent.propTypes = {
  data: PropTypes.array.isRequired,
  onBetSelect: PropTypes.func.isRequired,
}

const arePropsEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.data, nextProps.data) && prevProps.onBetSelect === nextProps.onBetSelect
}

const Line = memo(LineComponent, arePropsEqual)
Line.displayName = "Line"

export default Line

