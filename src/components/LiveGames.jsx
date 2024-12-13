import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import BetSlip from './BetSlip';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'


export default function LiveGames({ onBetSelect }) {
  const [selectedBet, setSelectedBet] = useState(null);

  const liveGames = [
    {
      id: 1,
      sport: 'CRICKET',
      league: 'NEPAL PREMIER LEAGUE',
      team1: 'Lumbini Lions',
      team2: 'Karnali Yaks',
      markets: 1,
      traded: '35,25,047',
      odds: {
        team1: {
          back: [
            { odds: 1.93, volume: 325 },
            { odds: 1.94, volume: 1184 }
          ],
          lay: [
            { odds: 2.06, volume: 1115 },
            { odds: 2.08, volume: 302 }
          ]
        },
        team2: {
          back: [
            { odds: 6.93, volume: 325 },
            { odds: 1.94, volume: 78 }
          ],
          lay: [
            { odds: 2.06, volume: 6576 },
            { odds: 8.08, volume: 302 }
          ]
        },
      },
      status: 'LIVE'
    },{
      id: 2,
      sport: 'CRICKET',
      league: 'NEPAL PREMIER LEAGUE',
      team1: 'Lumbini Lions',
      team2: 'Karnali Yaks',
      markets: 1,
      traded: '35,25,047',
      odds: {
        team1: {
          back: [
            { odds: 1.93, volume: 325 },
            { odds: 1.94, volume: 1184 }
          ],
          lay: [
            { odds: 2.06, volume: 1115 },
            { odds: 2.08, volume: 302 }
          ]
        },
        team2: {
          back: [
            { odds: 6.93, volume: 325 },
            { odds: 1.94, volume: 78 }
          ],
          lay: [
            { odds: 2.06, volume: 6576 },
            { odds: 8.08, volume: 302 }
          ]
        },
      },
      status: 'LIVE'
    },{
      id: 3,
      sport: 'CRICKET',
      league: 'NEPAL PREMIER LEAGUE',
      team1: 'Lumbini Lions',
      team2: 'Karnali Yaks',
      markets: 1,
      traded: '35,25,047',
      odds: {
        team1: {
          back: [
            { odds: 1.93, volume: 325 },
            { odds: 1.94, volume: 1184 }
          ],
          lay: [
            { odds: 2.06, volume: 1115 },
            { odds: 2.08, volume: 302 }
          ]
        },
        team2: {
          back: [
            { odds: 6.93, volume: 325 },
            { odds: 1.94, volume: 78 }
          ],
          lay: [
            { odds: 2.06, volume: 6576 },
            { odds: 8.08, volume: 302 }
          ]
        },
      },
      status: 'LIVE'
    },{
      id: 4,
      sport: 'CRICKET',
      league: 'NEPAL PREMIER LEAGUE',
      team1: 'Lumbini Lions',
      team2: 'Karnali Yaks',
      markets: 1,
      traded: '35,25,047',
      odds: {
        team1: {
          back: [
            { odds: 1.93, volume: 325 },
            { odds: 1.94, volume: 1184 }
          ],
          lay: [
            { odds: 2.06, volume: 1115 },
            { odds: 2.08, volume: 302 }
          ]
        },
        team2: {
          back: [
            { odds: 6.93, volume: 325 },
            { odds: 1.94, volume: 78 }
          ],
          lay: [
            { odds: 2.06, volume: 6576 },
            { odds: 8.08, volume: 302 }
          ]
        },
      },
      status: 'LIVE'
    },
  ];

  const handleOddsClick = (game, team, type, odds) => {
    const betData = {
      gameId: game.id,
      team1: game.team1,
      team2: game.team2,
      selectedTeam: team,
      betType: type,
      odds: odds.odds,
      volume: odds.volume
    };
    setSelectedBet(betData);
    onBetSelect(betData);
  };

  const handleCloseBetSlip = () => {
    setSelectedBet(null);
  };

  return (
    <div className="bg-gray-900 h-full p-4">
      <Carousel 
        className='cursor-not-allowed' 
        autoPlay
        interval={3000}
        infiniteLoop
        showThumbs={false}
        showStatus={false}
      >
        <div>
          <img className='lg:h-64 rounded-lg h-56' src="https://images.unsplash.com/photo-1671655135696-ccf6f206d2b9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cricket banner 1" />
        </div>
        <div>
          <img className='lg:h-64 rounded-lg h-56' src="https://images.unsplash.com/photo-1726161113123-98d414829399?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cricket banner 2" />
        </div>
        <div>
          <img className='lg:h-64 rounded-lg h-56' src="https://images.unsplash.com/photo-1671824269494-5844fb7f482b?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Cricket banner 3" />
        </div>
      </Carousel>

      <h2 className="text-xl font-bold text-white my-4">Live Games</h2>
      <div className="space-y-2">
        {liveGames.map((game) => (
          <div key={game.id}>
            <div className="bg-gray-800  rounded-lg">
              {/* Header */}
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-blue-400">{game.sport}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-400">{game.league}</span>
                </div>
                <Link to={`/match/${game.id}`} className="block mt-1 hover:text-blue-400">
                <div className="flex justify-between items-center mt-1">
                  <div>
                    <h3 className="text-white font-medium">{game.team1}</h3>
                    <h3 className="text-white font-medium">{game.team2}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <span className="text-green-500">●</span>
                      <span>{game.status}</span>
                    </div>
                    <div>{game.markets} MARKETS</div>
                    <div>TRADED: {game.traded}</div>
                  </div>
                </div>
                </Link>
              </div>

              {/* Odds Grid */}
              <div className="grid grid-cols-2 gap-x-4 md:gap-x-16 px-1 md:px-4 py-2 border-t border-gray-700">
                {/* Team Names */}
                <div className="col-span-2 grid grid-cols-2 mb-2">
                  <div className="text-white text-center">{game.team1}</div>
                  <div className="text-white text-center">{game.team2}</div>
                </div>
                
                {/* Odds Display for Team 1 */}
                <div className="grid grid-cols-4 gap-1 col-span-1">
                  {/* Back Odds */}
                  {game.odds.team1.back.map((odds, index) => (
                    <button
                      key={`team1-back-${index}`}
                      onClick={() => handleOddsClick(game, game.team1, 'back', odds)}
                      className="bg-blue-500 p-2 rounded text-center hover:bg-blue-600 transition-colors"
                    >
                      <div className="text-white font-bold">{odds.odds}</div>
                      <div className="text-xs text-white/80">{odds.volume}</div>
                    </button>
                  ))}
                  
                  {/* Lay Odds */}
                  {game.odds.team1.lay.map((odds, index) => (
                    <button
                      key={`team1-lay-${index}`}
                      onClick={() => handleOddsClick(game, game.team1, 'lay', odds)}
                      className="bg-pink-500 p-2 rounded text-center hover:bg-pink-600 transition-colors"
                    >
                      <div className="text-white font-bold">{odds.odds}</div>
                      <div className="text-xs text-white/80">{odds.volume}</div>
                    </button>
                  ))}
                </div>

                {/* Odds Display for Team 2 */}
                <div className="grid grid-cols-4 gap-1 col-span-1">
                  {/* Back Odds */}
                  {game.odds.team2.back.map((odds, index) => (
                    <button
                      key={`team2-back-${index}`}
                      onClick={() => handleOddsClick(game, game.team2, 'back', odds)}
                      className="bg-blue-500 p-2 rounded text-center hover:bg-blue-600 transition-colors"
                    >
                      <div className="text-white font-bold">{odds.odds}</div>
                      <div className="text-xs text-white/80">{odds.volume}</div>
                    </button>
                  ))}
                  
                  {/* Lay Odds */}
                  {game.odds.team2.lay.map((odds, index) => (
                    <button
                      key={`team2-lay-${index}`}
                      onClick={() => handleOddsClick(game, game.team2, 'lay', odds)}
                      className="bg-pink-500 p-2 rounded text-center hover:bg-pink-600 transition-colors"
                    >
                      <div className="text-white font-bold">{odds.odds}</div>
                      <div className="text-xs text-white/80">{odds.volume}</div>
                    </button>
                  ))}
                </div>
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
};
