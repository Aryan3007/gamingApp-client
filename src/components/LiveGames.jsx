import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BetSlip from "./BetSlip";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

export default function LiveGames({ onBetSelect, sportsCatagory }) {
  const [selectedBet, setSelectedBet] = useState(null);
  const [activeGroup, setActiveGroup] = useState(null);
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          'https://api.the-odds-api.com/v4/sports/cricket/odds/?apiKey=c7727bb0c21e4e3b3c888219355c908a&regions=eu,uk&markets=h2h,spreads,totals&oddsFormat=decimal'
        );
        // Filter for specific bookmaker (e.g., Betfair)
        const filteredData = response.data.map(game => {
          const betfair = game.bookmakers.find(b => b.title === "Betfair");
          return {
            ...game,
            bookmakers: betfair ? [betfair] : [],
          };
        });

        setLiveGames(filteredData);
        console.log("filtered ", filteredData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };

    fetchGames();
  }, []);

  const toggleGroup = (group) => {
    setActiveGroup((prevGroup) => (prevGroup === group ? null : group));
  };

  const handleOddsClick = (game, team, type, odds) => {
    const betData = {
      gameId: game.id,
      home_team: game.home_team,
      away_team: game.away_team,
      selectedTeam: team,
      betType: type,
      odds: odds.price,
    };
    setSelectedBet(betData);
    onBetSelect(betData);
  };

  const handleCloseBetSlip = () => {
    setSelectedBet(null);
  };

  return (
    <div className="bg-gray-900 h-full p-4">
      {/* Sports Category Header */}
      <div className="h-10 w-full flex justify-between items-center bg-gray-800 mb-4 rounded-lg">
        <div className="px-2 justify-between w-full flex items-center">
          <div className="overflow-hidden">
            <div className="flex space-x-8 px-4 overflow-x-auto">
              {sportsCatagory?.map((group, index) => (
                <div key={index}>
                  <button
                    onClick={() => toggleGroup(group.group)}
                    className="w-full text-base text-nowrap flex gap-4 text-white"
                  >
                    {group.group}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-2">
        {liveGames.map((game) => (
          <div key={game.id}>
            <div className="bg-gray-800 rounded-lg">
              {/* Game Header */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400">{game.sport_title}</span>
                  <span className="text-gray-400">• LIVE</span>
                  <span className="text-blue-400">{game.league}</span>
                </div>
                <Link
                  to={`/match/${game.id}`}
                  className="block mt-1 hover:text-blue-400"
                >
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <h3 className="text-white font-medium">{game.home_team}</h3>
                      <h3 className="text-white font-medium">{game.away_team}</h3>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Odds Display Section */}
              <div className="grid grid-cols-3 gap-x-4 md:gap-x-16 px-1 md:px-4 py-2 border-t border-gray-700">
                {game.bookmakers[0]?.markets[0]?.outcomes && (
                  <>
                    {/* Team Names Header */}
                    <div className="col-span-3 grid grid-cols-3 mb-2">
                      {game.bookmakers[0].markets[0].outcomes.map((outcome, index) => (
                        <div key={index} className="text-white text-center">
                          {outcome.name}
                        </div>
                      ))}
                    </div>

                    {/* Odds Grid */}
                    {game.bookmakers[0].markets[0].outcomes.map((outcome, index) => (
                      <div key={index} className="grid grid-cols-2 gap-1 col-span-1">
                        {game.bookmakers[0].markets.map((market, marketIndex) => {
                          const matchingOutcome = market.outcomes.find(
                            o => o.name === outcome.name
                          );
                          if (!matchingOutcome) return null;

                          return (
                            <button
                              key={`${outcome.name}-${marketIndex}`}
                              onClick={() =>
                                handleOddsClick(
                                  game,
                                  outcome.name,
                                  market.key,
                                  matchingOutcome
                                )
                              }
                              className={`${
                                market.key.includes('h2h_lay') 
                                  ? 'bg-pink-500 hover:bg-pink-400' 
                                  : 'bg-blue-500 hover:bg-blue-400'
                              } p-2 rounded text-center hover:opacity-90 transition-colors`}
                            >
                              <div className="text-white text-[12px] font-bold">
                                {matchingOutcome.price}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* Mobile BetSlip */}
            {selectedBet && selectedBet.gameId === game.id && (
              <div className="md:hidden mt-2">
                <BetSlip match={selectedBet} onClose={handleCloseBetSlip} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

LiveGames.propTypes = {
  onBetSelect: PropTypes.func.isRequired,
  sportsCatagory: PropTypes.array
};

