"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Bookmaker from "../components/matchdetails_ui/Bookmaker";
import Fancy from "../components/matchdetails_ui/Fancy";
import Player from "../components/matchdetails_ui/Player";
import Other from "../components/matchdetails_ui/Other";
import BFancy from "../components/matchdetails_ui/BFancy";
import OddEven from "../components/matchdetails_ui/OddEven";
import Line from "../components/matchdetails_ui/Line";
import MatchOdds from "../components/matchdetails_ui/MatchOdds";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import BetSlip from "../components/BetSlip";
import CricketScore from "../components/matchdetails_ui/CircketScore";
import { server } from "../constants/config";
import FullTime from "../components/matchdetails_ui/FullTime";

const MatchDetails = () => {
  const [activeTab, setActiveTab] = useState("bookmaker");
  const [data, setData] = useState(null);
  const [bookmakers, setBookmakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { eventId } = useParams();
  const [selectedBet, setSelectedBet] = useState(null);

  // Component mapping object
  const tabComponents = {
    bookmaker: Bookmaker,
    fancy: Fancy,
    player: Player,
    over: Other,
    b_fancy: BFancy,
    odd_even: OddEven,
    line: Line,
    full_time: FullTime,
  };

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${server}/api/v1/getMarkets?eventId=${eventId}`
        );

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        setBookmakers(response.data.getBookmaker);
        setData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch market data. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 3000);

    return () => clearInterval(intervalId);
  }, [eventId]);

  const categorizedData = useMemo(() => {
    if (!data) return null;

    const categorizeMarkets = (rawData) => {
      const categories = {
        bookmaker: rawData.getBookmaker || [],
        fancy: [],
        player: [],
        over: [],
        b_fancy: [],
        odd_even: [],
        line: [],
        full_time: [],
      };

      if (rawData.getFancy) {
        rawData.getFancy.forEach((market) => {
          const name = market.market.name.toLowerCase();

          if (name.includes("only")) {
            categories.over.push(market);
          } else if (name.includes("over")) {
            categories.fancy.push(market);
          } else if (name.includes("odd_even")) {
            categories.odd_even.push(market);
          } else if (name.includes("innings")) {
            categories.line.push(market);
          } else if (
            name.includes("top") ||
            name.includes("total") ||
            name.includes("most") ||
            name.includes("highest")
          ) {
            categories.full_time.push(market);
          } else if (
            name.startsWith("fall of") ||
            name.startsWith("caught") ||
            name.startsWith("match ")
          ) {
            categories.b_fancy.push(market);
          } else {
            categories.player.push(market);
          }
        });
      }

      return Object.fromEntries(
        Object.entries(categories).filter(([_, value]) => value.length > 0)
      );
    };

    return categorizeMarkets(data);
  }, [data]);

  const fancyData = useMemo(() => {
    return categorizedData?.fancy || [];
  }, [categorizedData]);

  const handleBetSelection = useCallback((bet) => {
    setSelectedBet(bet);
  }, []);

  const activeComponent = useMemo(() => {
    if (!categorizedData) return null;

    const ActiveComponent = tabComponents[activeTab];
    if (!ActiveComponent) return null;

    return (
      <ActiveComponent
        onBetSelect={handleBetSelection}
        data={categorizedData[activeTab]}
      />
    );
  }, [activeTab, categorizedData, handleBetSelection, tabComponents]); // Added tabComponents to dependencies

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) return <Loader message="Loading match details..." />;
  if (error)
    return <p className="text-red-500 p-4 text-center">Error: {error}</p>;

  return (
    <div className="max-w-full mx-auto pt-28 md:pt-12 grid grid-cols-1 md:grid-cols-12 lg:h-screen">
      {/* Main Content */}
      <div className="md:col-span-9 px-4 rounded-lg p-2 lg:pt-2 lg:overflow-y-auto ">
        {/* Match Score */}
        <div className="p-4 bg-[#262a31] border-dashed border-zinc-700 rounded-lg border">
          <h1 className="text-2xl font-semibold">
            {data?.eventDetail?.event.name}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-gray-400">
            {formatDate(data?.eventDetail?.event.startDate)}
          </div>
        </div>

        <CricketScore eventId={eventId} />

        {/* Match Odds */}
        <MatchOdds onBetSelect={handleBetSelection} eventId={eventId} />

        {/* Navigation Tabs */}
        <div className="flex bg-[#262a31] border-dashed border-zinc-700 overflow-x-auto rounded-lg border p-4">
          {Object.keys(categorizedData || {}).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic Content Rendering */}
        {activeComponent}
      </div>

      {/* Bet Slip - Fixed on Right for Large Screens, Moves Below for Small Screens */}
      <div className="md:col-span-3 hidden md:flex overflow-y-auto">
        <BetSlip match={selectedBet} onClose={() => setSelectedBet(null)} />
      </div>
    </div>
  );
};

export default MatchDetails;
