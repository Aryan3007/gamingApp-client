import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaFutbol, FaBasketballBall, FaHockeyPuck } from "react-icons/fa";
import { GiCricketBat, GiBoxingGlove } from "react-icons/gi";

const GamesHeader = ({ activeTab, setActiveTab }) => {
  const sports = [
    { name: "Cricket", icon: <GiCricketBat />, key: "cricket" },
    { name: "Football", icon: <FaFutbol />, key: "football" },
    { name: "Basketball", icon: <FaBasketballBall />, key: "basketball" },
  ];
  

  return (
    <div className="h-14 w-full border overflow-x-auto bg-[#242a31] border-zinc-700 border-dashed rounded-lg p-2 px-4 flex items-center">
      {sports.map((sport) => (
        <div
          key={sport.key}
          className={`flex items-center justify-center cursor-pointer px-4 py-2 gap-2 ${
            activeTab === sport.key ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-400"
          }`}
          onClick={() => setActiveTab(sport.key)}
        >
          <div>{sport.icon}</div>
          <h1>{sport.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default GamesHeader;
