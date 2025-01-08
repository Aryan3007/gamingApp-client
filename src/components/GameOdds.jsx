/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import BetSlip from "./BetSlip";

const GameOdds = ({ onBetSelect }) => {
  const [selectedBet, setSelectedBet] = useState(null);
  const [activeKey, setActiveKey] = useState("cricket");
  const [liveGames, setLiveGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/cricket/odds/?apiKey=2226ea8e73ba3bc2c53b92c179bb3ce7&regions=eu,uk&markets=h2h,spreads,totals&oddsFormat=decimal`
        );
  
        // Filter for specific bookmaker (e.g., Betfair)
        const filteredData = response.data.map((game) => {
          const betfair = game.bookmakers.find((b) => b.title === "Betfair");
          return {
            ...game,
            bookmakers: betfair ? [betfair] : [], // Only keep the Betfair bookmaker
          };
        });
  
        setLiveGames(filteredData);
      } catch (error) {
        console.error("Error fetching game data:", error);
      }
    };
  

    fetchGames(); 
    const interval = setInterval(fetchGames, 3000); // Repeat every 3 seconds
  
    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);
  

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
    <div>
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
                  to={`/match/${game.sport_key}/events/${game.id}`}
                  className="block mt-1 hover:text-blue-400"
                >
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      <h3 className="text-white font-medium">
                        {game.home_team}
                      </h3>
                      <h3 className="text-white font-medium">
                        {game.away_team}
                      </h3>
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
                      {game.bookmakers[0].markets[0].outcomes.map(
                        (outcome, index) => (
                          <div key={index} className="text-white text-center">
                            {outcome.name}
                          </div>
                        )
                      )}
                    </div>

                    {/* Odds Grid */}
                    {game.bookmakers[0].markets[0].outcomes.map(
                      (outcome, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-1 col-span-1"
                        >
                          {game.bookmakers[0].markets.map(
                            (market, marketIndex) => {
                              const matchingOutcome = market.outcomes.find(
                                (o) => o.name === outcome.name
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
                                    market.key.includes("h2h_lay")
                                      ? "bg-pink-500 hover:bg-pink-400"
                                      : "bg-blue-500 hover:bg-blue-400"
                                  } p-2 rounded text-center hover:opacity-90 transition-colors`}
                                >
                                  <div className="text-white text-[12px] font-bold">
                                    {matchingOutcome.price}
                                  </div>
                                </button>
                              );
                            }
                          )}
                        </div>
                      )
                    )}
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
};

export default GameOdds;
