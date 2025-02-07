"use client"

import { memo, useState } from "react"
import isEqual from "lodash/isEqual"
import BetSlip from "../BetSlip"

const FullTime = ({ data, onBetSelect }) => {
  const [selectedBet, setSelectedBet] = useState(null)

  const renderOddsBox = (odds, type, marketName, marketId, isActive) => {
    return (
      <button
        className={`w-full sm:w-20 h-10 ${
          type === "Back"
            ? isActive
              ? "bg-[#00B2FF] hover:bg-[#00A1E6]"
              : "bg-[#00b3ff36]"
            : isActive
              ? "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
              : "bg-[#ff7a7e42]"
        } rounded flex flex-col items-center justify-center transition-colors`}
        onClick={() => {
          if (isActive) {
            const betData = {
              gameId: marketId,
              eventName: marketName,
              home_team: marketName.split(" v ")[0],
              away_team: marketName.split(" v ")[1] || "N/A",
              selectedTeam: marketName,
              betType: type,
              odds: odds?.price || 0,
            }
            setSelectedBet(betData)
            onBetSelect && onBetSelect(betData)
          }
        }}
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

  // Check if data is an array before mapping
  if (!Array.isArray(data)) {
    return <div className="text-white">No fancy data available</div>
  }

  return (
    <div className="space-y-4 bg-[#242a31] rounded-lg overflow-hidden mt-4">
      <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 bg-[#2c3847]">
        <h3 className="text-white font-medium w-full sm:w-auto mb-2 sm:mb-0">Full Time Markets</h3>
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
        const isSuspended = market.odds.status === "SUSPENDED"
        const hasValidOdds = (odds) => odds && odds.price > 0 && odds.size > 0

        return (
          <div key={`${market.market?.id || index}`}>
            <div className="border-b border-[#2c3847]">
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 py-2">
                <span className="text-white text-sm w-full sm:w-[200px] mb-2 sm:mb-0">
                  {market.market?.name || "Unknown Market"}
                </span>
                {isSuspended ? (
                  <div className="col-span-2 flex items-center justify-center h-10 bg-[#1a2027] rounded">
                  <span className="text-[#ff4d4f] text-sm px-4 font-medium">SUSPENDED</span>
                </div>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <div className="w-1/2 sm:w-auto">
                      {renderOddsBox(
                        market.odds.back?.[0],
                        "Back",
                        market.market?.name,
                        market.market?.id,
                        hasValidOdds(market.odds.back?.[0]),
                      )}
                    </div>
                    <div className="w-1/2 sm:w-auto">
                      {renderOddsBox(
                        market.odds.lay?.[0],
                        "Lay",
                        market.market?.name,
                        market.market?.id,
                        hasValidOdds(market.odds.lay?.[0]),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {selectedBet && selectedBet.gameId === market.market?.id && (
              <div className="md:hidden">
                <BetSlip match={selectedBet} onClose={() => setSelectedBet(null)} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

const arePropsEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.data, nextProps.data) && prevProps.onBetSelect === nextProps.onBetSelect
}

const Fancy = memo(FullTime, arePropsEqual)
Fancy.displayName = "FullTime"

export default FullTime

