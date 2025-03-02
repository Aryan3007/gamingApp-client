/* eslint-disable react/prop-types */
import axios from "axios";
import { Timer, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

const CricketScore = ({ eventId }) => {
  const [scoreData, setScoreData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;

    const fetchScores = async () => {
      try {
        const response = await axios.get(
          `https://testscapi.fpl11.com/api/admin/cricketscore?eventid=${eventId}`
        );

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        const teams = doc.querySelectorAll(".team");

        const team1Name =
          teams[0]?.querySelector(".team_name")?.textContent ||
          "Not Started Yet";
        const team1Run = teams[0]?.querySelector(".run")?.textContent || "0/0";
        const team1Over =
          teams[1]?.querySelectorAll(".over")[0]?.textContent || "(0.0)";
        const team1RR =
          teams[0]?.querySelectorAll(".over")[1]?.textContent ||
          "CRR: 0 | RRR: 0.0";

        const team2Name =
          teams[1]?.querySelector(".team_name")?.textContent ||
          "Not Started Yet";
        const team2Run = teams[1]?.querySelector(".run")?.textContent || "0/0";
        const team2Over =
          teams[0]?.querySelectorAll(".over")[0]?.textContent || "(0.0)";
        const team2RR =
          teams[1]?.querySelectorAll(".over")[1]?.textContent ||
          "CRR: 0 | RRR: 0.0";

        const newScoreData = {
          team1: {
            name: team1Name,
            run: team1Run,
            over: team1Over,
            rr: team1RR,
          },
          team2: {
            name: team2Name,
            run: team2Run,
            over: team2Over,
            rr: team2RR,
          },
        };

        setScoreData(newScoreData);
        localStorage.setItem(
          `cricketScore_${eventId}`,
          JSON.stringify(newScoreData)
        );
      } catch (err) {
        console.error("Error fetching scores:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
    intervalId = setInterval(fetchScores, 500);

    return () => clearInterval(intervalId);
  }, [eventId]);

  if (loading)
    return (
      <div className="text-white h-24 w-full flex justify-center items-center text-center">
        Loading scores...
      </div>
    );

  return (
    <div className="group p-4 sm:p-6 bg-[rgb(var(--color-background-hover))] border-[rgb(var(--color-border))] border my-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md">
   

    <div className="flex items-center justify-between text-[rgb(var(--color-text-primary))]">
      {/* Team 1 */}
      <div className="transition-transform duration-300 group-hover:translate-x-1">
        <div className="flex items-center gap-1 sm:gap-2">
          <Trophy className="w-3 hidden md:flex h-3 sm:w-5 sm:h-5 text-[rgb(var(--color-primary))]" />
          <div>
            <h2 className="font-bold text-xs sm:text-lg truncate max-w-[80px] sm:max-w-full">
              {scoreData.team1.name}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 hidden md:flex text-[rgb(var(--color-text-muted))]" />
              <span className="text-[rgb(var(--color-text-muted))] text-[10px] sm:text-sm">
                RR: {scoreData.team1.rr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center px-2 sm:px-4 flex flex-col items-center">
        <div className="relative">
          <div className="text-sm sm:text-3xl font-bold bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] bg-clip-text text-transparent animate-gradient">
            {scoreData.team1.run}:{scoreData.team2.run}
          </div>
          <div className="flex items-center justify-center gap-1">
            <Timer className="w-2 h-2 sm:w-3 sm:h-3 text-[rgb(var(--color-text-muted))]" />
            <div className="text-[12px] sm:text-xs text-[rgb(var(--color-text-muted))]">
              {scoreData.team2.over}|{scoreData.team1.over}
            </div>
          </div>
        </div>
      </div>

      {/* Team 2 */}
      <div className="transition-transform duration-300 group-hover:-translate-x-1">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="text-right">
            <h2 className="font-bold text-xs sm:text-lg truncate max-w-[80px] sm:max-w-full">
              {scoreData.team2.name}
            </h2>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-[rgb(var(--color-text-muted))] text-[10px] sm:text-sm">
                RR: {scoreData.team2.rr}
              </span>
              <TrendingUp className="w-3 hidden md:flex h-3 text-[rgb(var(--color-text-muted))]" />
            </div>
          </div>
          <Trophy className="w-3 h-3 hidden md:flex sm:w-5 sm:h-5 text-[rgb(var(--color-primary))]" />
        </div>
      </div>

    
    </div>
  </div>
  );
};

export default CricketScore;
