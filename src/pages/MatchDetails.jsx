import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import BetSlip from '../components/BetSlip';

const MatchDetails = () => {
  const { id } = useParams();
  const [selectedBet, setSelectedBet] = useState(null);

  // This is mock data. In a real application, you'd fetch this data based on the id
  const matchData = {
    id: id,
    team1: "Bahrain",
    team2: "United Arab Emirates",
    date: "13-12-2024 10:30",
    score: "113/8 : 0/0",
    inning: "INN 2 | 00V",
    status: "United Arab Emirates are about to start their innings and require 114 runs to win.",
    odds: {
      team1: [
        { back: 12, backVolume: 970 },
        { back: 12.5, backVolume: 57 },
        { back: 13.5, backVolume: 89 },
        { lay: 15.5, layVolume: 124 },
        { lay: 18, layVolume: 52 },
        { lay: 21, layVolume: 467 },
      ],
      team2: [
        { back: 1.05, backVolume: 9345 },
        { back: 1.06, backVolume: 888 },
        { back: 1.07, backVolume: 1807 },
        { lay: 1.08, layVolume: 1121 },
        { lay: 1.09, layVolume: 11344 },
        { lay: 1.13, layVolume: 3745 },
      ],
    },
  };

  const handleOddsClick = (team, type, odds, volume) => {
    const betData = {
      gameId: matchData.id,
      team1: matchData.team1,
      team2: matchData.team2,
      selectedTeam: team,
      betType: type,
      odds: odds,
      volume: volume
    };
    setSelectedBet(betData);
  };

  const handleCloseBetSlip = () => {
    setSelectedBet(null);
  };

  return (
    <div className="bg-gray-900 pt-20 min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Match Info */}
          <div className="lg:col-span-3 bg-gray-800 rounded-lg p-4 mb-4">
            <h1 className="text-2xl font-bold mb-2 text-white">{matchData.team1} v {matchData.team2}</h1>
            <p className="text-blue-400 mb-4">{matchData.date}</p>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="font-bold text-white">{matchData.team1}</h2>
                <p className="text-sm text-gray-400">5.65 RR</p>
              </div>
              <div className="text-center">
                <h3 className="font-bold text-white">{matchData.score}</h3>
                <p className="text-sm text-gray-400">{matchData.inning}</p>
              </div>
              <div className="text-right">
                <h2 className="font-bold text-white">{matchData.team2}</h2>
              </div>
            </div>
            <p className="text-sm text-white">{matchData.status}</p>
            <ChevronDown className="mx-auto mt-2 text-white" />
          </div>

          {/* Match Odds */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold text-white">Match Odds</h3>
              <div className="text-sm text-gray-400">
                <span className="mr-2">Min: 10</span>
                <span>Max: 2L</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              <div className="col-span-3"></div>
              <div className="bg-blue-500 text-center py-1 rounded text-white">Back</div>
              <div className="bg-pink-500 text-center py-1 rounded text-white">Lay</div>
            </div>
            {[matchData.team1, matchData.team2].map((team, index) => (
              <div key={team} className="grid grid-cols-7 gap-2 mb-2">
                <div className="col-span-1 text-white">{team}</div>
                {matchData.odds[`team${index + 1}`].map((odd, i) => (
                  <button 
                    key={i} 
                    className={`text-center py-1 rounded ${odd.back ? 'bg-blue-600 hover:bg-blue-700' : 'bg-pink-600 hover:bg-pink-700'} transition-colors`}
                    onClick={() => handleOddsClick(team, odd.back ? 'back' : 'lay', odd.back || odd.lay, odd.backVolume || odd.layVolume)}
                  >
                    <div className="font-bold text-white">{odd.back || odd.lay}</div>
                    <div className="text-xs text-white/80">{odd.backVolume || odd.layVolume}</div>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* BetSlip */}
          <div className="lg:col-span-1">
            {selectedBet ? (
              <div className="sticky top-4">
                <BetSlip match={selectedBet} onClose={handleCloseBetSlip} />
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-4 text-white">
                <p>Select odds to place a bet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;

