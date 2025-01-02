import { useState, useEffect } from "react";
import axios from "axios";
import AllGames from "../components/AllGames";
import LiveGames from "../components/LiveGames";
import UpcomingGames from "../components/UpcomingGames";
import BetSlip from "../components/BetSlip";

const Dashboard = () => {
  const [selectedBet, setSelectedBet] = useState(null);
  const [sportsData, setSportsData] = useState([]);

  const handleBetSelect = (bet) => {
    setSelectedBet(bet);
  };

  const handleBetClose = () => {
    setSelectedBet(null);
  };

  // Fetch sports data
  const fetchSportsData = async () => {
    try {
      const response = await axios.get(
        "https://api.the-odds-api.com/v4/sports/?apiKey=360301b3df8aa33a83a9541e04ee5ef0"
      );
      setSportsData(response.data);
    } catch (error) {
      console.error("Error fetching sports data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchSportsData();
  }, []);

  return (
    <div className="bg-gray-900 pt-12">
      {/* Main Content */}
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12  p-0 lg:p-2 lg:h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="md:col-span-2 overflow-y-auto">
          {/* Pass sports data as props to AllGames */}
          <AllGames sportsData={sportsData} />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-7 lg:pt-0 lg:overflow-y-auto">
          <LiveGames
            sportsCatagory={sportsData}
            onBetSelect={handleBetSelect}
          />
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
};

export default Dashboard;
