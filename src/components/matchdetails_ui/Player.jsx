import { memo, useState, useEffect, useRef } from "react";
import isEqual from "react-fast-compare";
import BetSlip from "../BetSlip";

const PlayerComponent = ({ data, onBetSelect }) => {
  const [selectedBet, setSelectedBet] = useState(null);
  const prevDataRef = useRef();

  useEffect(() => {
    if (prevDataRef.current) {
      const newlySuspended = data.filter(
        (market) =>
          market.odds?.status === "SUSPENDED" &&
          prevDataRef.current.find(
            (prevMarket) =>
              prevMarket.market.id === market.market.id &&
              prevMarket.odds?.status !== "SUSPENDED"
          )
      );
      if (newlySuspended.length > 0) {
        // Update the lastUpdated field for newly suspended markets
        newlySuspended.forEach((market) => {
          market.lastUpdated = new Date().toISOString();
        });
      }
    }
    prevDataRef.current = data;
  }, [data]);

  const handleOddsClick = (market, odds, type, price, size) => {
    const betData = {
      home_team: market.runners?.[0]?.name || "Fancy",
      away_team: market.runners?.[1]?.name || "Fancy",
      eventId: market.eventId || "",
      marketId: market.market?.id || "",
      selectionId: odds?.selectionId || null,
      fancyNumber: price,
      stake: 0,
      odds: size,
      category: "fancy",
      type: type.toLowerCase(),
      gameId: market.market?.id || "",
      eventName: market.market?.name || "Unknown Market",
      selectedTeam: market.market?.name || "Unknown Market",
      betType: type,
      size: size,
    };
    setSelectedBet(betData);
    onBetSelect(betData);
  };

  const renderOddsBox = (odds, market, type) => {
    if (!odds) {
      return (
        <div
          className={`w-full sm:w-12 lg:min-w-[100px] min-w-[70px] md:w-16 h-10 ${
            type === "Back" ? "bg-[#00b3ff36]" : "bg-[#ff7a7e42]"
          } rounded flex items-center justify-center`}
        >
          <span className="text-gray-500 text-xs">-</span>
        </div>
      );
    }
    const isActive = odds && odds.price > 0 && odds.size > 0;

    return (
      <button
        className={`w-full sm:w-12 lg:min-w-[100px] min-w-[70px] md:w-16 h-10 ${
          type === "Back"
            ? isActive
              ? "bg-[#00B2FF] hover:bg-[#00A1E6]"
              : "bg-[#00b3ff36]"
            : isActive
            ? "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
            : "bg-[#ff7a7e42]"
        } rounded flex flex-col items-center justify-center transition-colors`}
        onClick={() =>
          isActive && handleOddsClick(market, odds, type, odds.price, odds.size)
        }
        disabled={!isActive}
      >
        {isActive ? (
          <>
            <span className="text-black text-sm font-semibold">
              {odds.price.toFixed(2)}
            </span>
            <span className="text-black text-xs">{Math.floor(odds.size)}</span>
          </>
        ) : (
          <span className="text-red-500 font-semibold text-xs">Suspended</span>
        )}
      </button>
    );
  };

  const sortMarkets = (markets) => {
    const activeMarkets = markets.filter(
      (market) => market.odds?.status !== "SUSPENDED"
    );
    const suspendedMarkets = markets
      .filter((market) => market.odds?.status === "SUSPENDED")
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    return [...activeMarkets, ...suspendedMarkets.slice(0, 5)];
  };

  if (!Array.isArray(data)) {
    return <div className="text-white">No player data available</div>;
  }

  return (
    <div className="space-y-0 bg-[#1a2027] rounded-lg overflow-hidden mt-4">
      <div className="flex flex-row sm:flex-nowrap justify-between items-center p-3 bg-[#2c3847]">
        <h3 className="text-white font-medium w-full sm:w-auto mb-2 sm:mb-0">
          Player
        </h3>
        <div className="flex flex-row sm:flex-nowrap items-center gap-2 w-full sm:w-auto justify-end sm:justify-end">
          <span className="text-xs bg-[#00B2FF] sm:text-sm  text-center w-full max-w-[70px] lg:min-w-[100px] sm:w-20 text-black py-1 rounded font-semibold">
            Yes
          </span>
          <span className="text-xs sm:text-sm bg-[#FF7A7F] w-full text-center max-w-[70px] lg:min-w-[100px] sm:w-20 text-black py-1 rounded font-semibold">
            No
          </span>
        </div>
      </div>
      {sortMarkets(data)?.map((market, index) => {
        return (
          <div
            key={`${market.market?.id || index}`}
            className="border-b border-[#2c3847]"
          >
            <div className="flex items-center justify-between p-3">
              <span className="text-white text-sm">
                {market.market?.name || "Unknown Market"}
              </span>
              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <div className="flex gap-2">
                  {renderOddsBox(market.odds?.back?.[0], market, "Back")}
                  {renderOddsBox(market.odds?.lay?.[0], market, "Lay")}
                </div>
              </div>
            </div>
            {selectedBet && selectedBet.marketId === market.market.id && (
              <div className="lg:hidden mt-2">
                <BetSlip
                  match={selectedBet}
                  onClose={() => setSelectedBet(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const arePropsEqual = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.data, nextProps.data) &&
    prevProps.onBetSelect === nextProps.onBetSelect
  );
};

const Player = memo(PlayerComponent, arePropsEqual);
Player.displayName = "Player";

export default Player;
