import { useState } from 'react';
import AllGames from "../components/AllGames";
import LiveGames from "../components/LiveGames";
import UpcomingGames from "../components/UpcomingGames";
import BetSlip from "../components/BetSlip";

export default function Dashboard() {
  const [selectedBet, setSelectedBet] = useState(null);

  const handleBetSelect = (bet) => {
    setSelectedBet(bet);
  };

  const handleBetClose = () => {
    setSelectedBet(null);
  };

  return (
    <div className="bg-gray-900">
      {/* Main Content */}
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12  p-0 lg:p-2 lg:h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="md:col-span-2 overflow-y-auto">
          <AllGames />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-7 lg:pt-0 lg:overflow-y-auto">
          <LiveGames onBetSelect={handleBetSelect} />
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-3 mt-4 md:flex hidden overflow-y-auto">
          {selectedBet ? (
            <BetSlip match={selectedBet} onClose={handleBetClose} />
          ) : (
            <UpcomingGames />
          )}
        </div>
      </div>
    </div>
  );
}
