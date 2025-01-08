import { useState, useEffect } from "react";
import axios from "axios";
import AllGames from "../components/AllGames";
import LiveGames from "../components/LiveGames";
import UpcomingGames from "../components/UpcomingGames";
import BetSlip from "../components/BetSlip";

const Dashboard = () => {
  const [selectedBet, setSelectedBet] = useState(null);
  const [sportsData, setSportsData] = useState([]);
  const [groups, setGroups] = useState([]);

  const handleBetSelect = (bet) => {
    setSelectedBet(bet);
  };

  const handleBetClose = () => {
    setSelectedBet(null);
  };

  const fetchSportsData = async () => {
    try {
      const response = await axios.get(
        "https://api.the-odds-api.com/v4/sports/?apiKey=058da9d96f062511f27d6581b72a6182"
      );
      setSportsData(response.data);

      // Extract unique groups with their keys
      const groupedData = response.data.reduce((acc, sport) => {
        // If the group doesn't already exist, create a new entry
        if (!acc[sport.group]) {
          acc[sport.group] = [];
        }
        acc[sport.group].push(sport.key);
        return acc;
      }, {});

      // Convert the groupedData into an array of objects containing the group and associated keys
      const uniqueGroups = Object.keys(groupedData).map((group) => ({
        group,
        keys: groupedData[group],
      }));

      setGroups(uniqueGroups);

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
        {/* <div className="md:col-span-2 overflow-y-auto">
          <AllGames sportsData={sportsData} />
        </div> */}

        {/* Main Content Area */}
        <div className="md:col-span-7 lg:pt-0 lg:overflow-y-auto">
          <LiveGames sportsCatagory={groups} onBetSelect={handleBetSelect}/>
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
