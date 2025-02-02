import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import BetSlip from "../components/BetSlip";
import { io } from "socket.io-client";

const MatchDetails = () => {


  const { id } = useParams(); // Get `id` from route params
  const [sportsData, setSportsData] = useState([]); // Holds all WebSocket data
  const [matchData, setMatchData] = useState(null); // Holds filtered match data
  const [activeTab, setActiveTab] = useState("odds");
  const [selectedBet, setSelectedBet] = useState(null);

 
  useEffect(() => {
    const newSocket = io("http://localhost:3000"); // Connect to WebSocket server

    newSocket.on("updateData", (data) => {
      setSportsData(data); // Store all data
      
      // Convert `id` from params to a number for comparison (if `id` in WebSocket data is a number)
      const numericId = parseInt(id, 10);
      
      // Filter the match data based on `id`
      const filteredData = data.find((match) => match.id === numericId);
      
      setMatchData(filteredData); // Set the filtered match data
      console.log("Filtered match data:", filteredData); // Debug filtered data
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
    };
  }, [id]); // Re-run effect if `id` changes


  return (
    <div className="bg-gray-900 pt-16 lg:h-[calc(100vh-64px)] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Match Info */}
          <div className="lg:col-span-3 bg-gray-800 rounded-lg p-4 mb-4">
            <h1 className="text-2xl font-bold mb-2 text-white">
              {matchData?.home.name} v/s {matchData?.away.name}
            </h1>
            <p className="text-blue-400 mb-4">LIVE</p>
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="font-bold text-white">{matchData?.tournament.name}</h2>
              </div>
              
            </div>
            <p className="text-sm text-white"></p>
            <ChevronDown className="mx-auto mt-2 text-white" />
          </div>

          {/* Match Odds */}
          <div className="lg:col-span-2 gap-4 flex flex-col">
            {/* Tabs */}
            <div className="bg-gray-800 uppercase flex justify-evenly rounded-lg p-4 text-white">
              <p
                className={`cursor-pointer ${
                  activeTab === "odds" && "border-b-4 border-blue-500"
                }`}
                onClick={() => setActiveTab("odds")}
              >
                Odds
              </p>
              <p
                className={`cursor-pointer ${
                  activeTab === "line" && "border-b-4 border-blue-500"
                }`}
                onClick={() => setActiveTab("line")}
              >
                Fancy
              </p>
              <p
                className={`cursor-pointer ${
                  activeTab === "line" && "border-b-4 border-blue-500"
                }`}
                onClick={() => setActiveTab("line")}
              >
                Line
              </p>
              <p
                className={`cursor-pointer ${
                  activeTab === "line" && "border-b-4 border-blue-500"
                }`}
                onClick={() => setActiveTab("line")}
              >
                Line
              </p>
              <p
                className={`cursor-pointer ${
                  activeTab === "line" && "border-b-4 border-blue-500"
                }`}
                onClick={() => setActiveTab("line")}
              >
                Line
              </p>
              {/* Add other tabs here */}
            </div>

            {/* Active Tab Content */}
            {activeTab === "odds" && (
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">Match Odds</h3>
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  <div className="col-span-3"></div>
                  <div className="bg-blue-500 text-center py-1 rounded text-white">
                    Back
                  </div>
                  <div className="bg-pink-500 text-center py-1 rounded text-white">
                    Lay
                  </div>
                </div>
                
              </div>
            )}
            
          </div>

          {/* BetSlip */}
          <div className="lg:col-span-1">
            {selectedBet ? (
              <div className="sticky top-4">
                <BetSlip />
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
