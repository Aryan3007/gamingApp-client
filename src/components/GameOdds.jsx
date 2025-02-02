import { useState } from "react"
import { Link } from "react-router-dom"
import BetSlip from "./BetSlip"

const GameOdds = ({ liveData }) => {
  const [selectedBet, setSelectedBet] = useState(null)

  const handleOddsClick = (game, team, type, odds) => {
    const betData = {
      gameId: game.event.id,
      home_team: game.runners[0].name,
      away_team: game.runners[1].name,
      selectedTeam: team,
      betType: type,
      odds: odds,
    }
    setSelectedBet(betData)
  }

  const handleCloseBetSlip = () => {
    setSelectedBet(null)
  }

  // Helper function to arrange runners with draw in middle
  const arrangeRunners = (runners) => {
    if (runners.length === 3) {
      // For matches with draw, put draw in the middle
      const draw = runners.find(r => r.name === "The Draw")
      const teams = runners.filter(r => r.name !== "The Draw")
      return [teams[0], draw, teams[1]]
    }
    // For matches without draw, return original array
    return runners
  }

  return (
    <div className="pt-2">
      <div className="flex gap-2 flex-col">
        {liveData.map((game, index) => {
          const hasDrawOption = game.runners.length === 3
          const arrangedRunners = arrangeRunners(game.runners)

          return (
            <div
              key={game.event.id || index}
              className="bg-[#242a31] border border-dashed border-zinc-700 flex md:flex-row flex-col justify-between px-3 py-3 rounded-lg"
            >
              {/* Game Header */}
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400 uppercase font-semibold">{game.sport.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400 uppercase font-semibold">{game.series.name}</span>
                </div>
                <Link to={`/match/${game.sport.id}/events/${game.event.id}`} className="block mt-1 hover:text-blue-400">
                  <div className="flex justify-between items-center mt-2">
                    <div className="">
                      <h3 className="text-white font-medium text-lg">{game.runners[0].name}</h3>
                      <h3 className="text-white font-medium text-lg">{game.runners[1].name}</h3>
                    </div>
                  </div>
                </Link>

                {/* Live indicator and markets count */}
                <div className="w-32 justify-between flex gap-2">
                  <div className="flex justify-center items-center gap-2">
                    <span className="h-3 w-3 animate-pulse bg-blue-500 rounded-full" />
                    <h1 className="text-xs font-semibold text-blue-400">LIVE</h1>
                  </div>
                  <h1 className="text-xs text-yellow-500">
                    {game.market.bookmakerCount + game.market.fancyCount} MARKETS
                  </h1>
                </div>
              </div>

              {/* Odds Section */}
              <div className="flex gap-4 mt-2 items-center justify-center">
                {/* First Team */}
                <div className="flex flex-col gap-1 items-center">
                  <h1 className="text-xs font-semibold">{arrangedRunners[0].name}</h1>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOddsClick(game, arrangedRunners[0].name, "Back", 1.2)}
                      className="w-12 md:w-16 bg-[#ff7a7f] rounded-sm h-8 text-black text-sm font-semibold"
                    >
                      1.2
                    </button>
                    <button
                      onClick={() => handleOddsClick(game, arrangedRunners[0].name, "Lay", 4.6)}
                      className="w-12 md:w-16 bg-[#00b2ff] rounded-sm h-8 text-black text-sm font-semibold"
                    >
                      4.6
                    </button>
                  </div>
                </div>

                {/* Middle Section (Draw or Empty) */}
                <div className="flex flex-col gap-1 items-center">
                  {hasDrawOption ? (
                    <>
                      <h1 className="text-xs font-semibold">{arrangedRunners[1].name}</h1>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOddsClick(game, arrangedRunners[1].name, "Back", 1.2)}
                          className="w-12 md:w-16 bg-[#ff7a7f] rounded-sm h-8 text-black text-sm font-semibold"
                        >
                          1.2
                        </button>
                        <button
                          onClick={() => handleOddsClick(game, arrangedRunners[1].name, "Lay", 4.6)}
                          className="w-12 md:w-16 bg-[#00b2ff] rounded-sm h-8 text-black text-sm font-semibold"
                        >
                          4.6
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-xs font-semibold invisible">Empty</h1>
                      <div className="flex gap-1">
                        <div className="w-12 md:w-16 h-8 bg-[#ff7a7e42] rounded-sm"></div>
                        <div className="w-12 md:w-16 h-8 bg-[#00b3ff36] rounded-sm"></div>
                      </div>
                    </>
                  )}
                </div>

                {/* Second Team */}
                <div className="flex flex-col gap-1 items-center">
                  <h1 className="text-xs font-semibold">
                    {hasDrawOption ? arrangedRunners[2].name : arrangedRunners[1].name}
                  </h1>
                  <div className="flex gap-1">
                    <button
                      onClick={() => 
                        handleOddsClick(game, hasDrawOption ? arrangedRunners[2].name : arrangedRunners[1].name, "Back", 1.2)
                      }
                      className="w-12 md:w-16 bg-[#ff7a7f] rounded-sm h-8 text-black text-sm font-semibold"
                    >
                      1.2
                    </button>
                    <button
                      onClick={() => 
                        handleOddsClick(game, hasDrawOption ? arrangedRunners[2].name : arrangedRunners[1].name, "Lay", 4.6)
                      }
                      className="w-12 md:w-16 bg-[#00b2ff] rounded-sm h-8 text-black text-sm font-semibold"
                    >
                      4.6
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Mobile BetSlip */}
        {selectedBet && (
          <div className="md:hidden mt-2">
            <BetSlip match={selectedBet} onClose={handleCloseBetSlip} />
          </div>
        )}
      </div>
    </div>
  )
}

export default GameOdds
