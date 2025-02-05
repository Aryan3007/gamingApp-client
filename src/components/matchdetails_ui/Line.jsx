/* eslint-disable react/prop-types */
const Line = ({ data }) => {
  const renderOddsBox = (odds, type) => {
    if (!odds || odds.price === 0) {
      return (
        <div
          className={`w-full sm:w-12 md:w-16 h-8 ${
            type === "Under" ? "bg-[#00b3ff36]" : "bg-[#ff7a7e42]"
          } rounded flex flex-col items-center justify-center`}
        ></div>
      )
    }

    return (
      <button
        className={`w-full sm:w-12 md:w-16 h-8 ${
          type === "Under" ? "bg-[#00B2FF] hover:bg-[#00A1E6]" : "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
        } rounded flex flex-col items-center justify-center transition-colors`}
      >
        <span className="text-black text-xs sm:text-sm font-semibold">{odds.price}</span>
        <span className="text-black text-[10px]">{Math.floor(odds.size / 1000)}K</span>
      </button>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      {data.map((market, index) => (
        <div key={index} className="bg-[#1a2027] rounded-lg overflow-hidden">
          <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 bg-[#2c3847]">
            <h3 className="text-white font-medium w-full sm:w-auto mb-2 sm:mb-0">{market.market.name}</h3>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-gray-400 text-xs sm:text-sm">
                Min: {market.minStake || 100} | Max: {market.maxStake || "10K"}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#242a31]">
            <div className="flex flex-wrap sm:flex-nowrap justify-between items-center">
              <span className="text-white text-sm w-full sm:w-[200px] mb-2 sm:mb-0">{market.market.name}</span>
              {market.market.status === "SUSPENDED" ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="w-1/2">{renderOddsBox(null, "Under")}</div>
                  <div className="w-1/2">{renderOddsBox(null, "Over")}</div>
                </div>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="w-1/2">{renderOddsBox(market.odds?.back[0], "Under")}</div>
                  <div className="w-1/2">{renderOddsBox(market.odds?.lay[0], "Over")}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Line

