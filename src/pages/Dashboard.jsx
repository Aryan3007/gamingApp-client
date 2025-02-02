import { useState, useEffect } from "react";
import axios from "axios";
import BetSlip from "../components/BetSlip";
import AllGames from "../components/AllGames";
import Navbar from "../components/Navbar";
import GamesHeader from "../components/GamesHeader";
import Cricket from "../components/ui/Cricket";
import Football from "../components/ui/Football";
import Basketball from "../components/ui/Basketball";
import io from 'socket.io-client'
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("cricket");
  const [showsidebar, setShowSideBar] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [liveSportsData, setLiveSportsData] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchSportsData = async () => {
      try {
        const response = await axios.get(
          "https://testscapi.fpl11.com/api/admin/GetMasterbysports?sid=4"
        );
        setSportsData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sports data:", error);
      }
    };

    fetchSportsData();
  }, []);

//   const socket = io("http://localhost:3000");
// socket.on("sportsData", (data) => {
//   setSportsData(data)
//   console.log("sports Data:", data);
// });




  const toggleSidebar = () => {
    setShowSideBar(!showsidebar);
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "cricket":
        return <Cricket liveData={sportsData} />;
      case "football":
        return <Football liveData={sportsData} />;
      case "basketball":
        return <Basketball liveData={sportsData} />;
      default:
        return <div>Select a sport to display</div>;
    }
  };

  return (
    <>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="bg-[#21252b] pt-12">
        <div className="max-w-full grid grid-cols-1 md:grid-cols-12 lg:h-[calc(100vh-48px)]">
          {/* Sidebar */}
          <div className="md:col-span-2 md:flex hidden bg-[#21252b] overflow-y-auto">
            <AllGames sportsData={sportsData} />
          </div>
          {showsidebar ? (
            <div className="md:col-span-2 md:hidden bg-[#21252b] overflow-y-auto">
              <AllGames sportsData={sportsData} />
            </div>
          ) : null}

          {/* Main Content */}
          <div className="md:col-span-7 rounded-lg p-2 lg:pt-2 lg:overflow-y-auto">
            <GamesHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            {renderActiveComponent()}
          </div>

          {/* Right Sidebar */}
          <div className="md:col-span-3 border-l border-zinc-700 border-dashed md:flex hidden overflow-y-auto">
            <BetSlip />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
