import PropTypes from "prop-types";
import BetSlip from "../BetSlip";

const Bookmaker = ({ data, onBetSelect, selectedBet, onCloseBetSlip }) => {
  const handleOddsClick = (market, runner, type, odds) => {
    const betData = {
      gameId: market.event?.event?.id,
      home_team: market.event?.runners?.[0]?.name,
      away_team: market.event?.runners?.[1]?.name,
      selectedTeam: runner.name,
      betType: type,
      odds: odds,
    };
    onBetSelect(betData);
  };

  const renderOddsBox = (odds, market, runner, type) => {
    if (!odds || odds.price === 0) {
      return (
        <div
          className={`w-full sm:w-12 md:w-16 h-8 ${
            type === "Back" ? "bg-[#00b3ff36]" : "bg-[#ff7a7e42]"
          } rounded flex flex-col items-center justify-center`}
        ></div>
      );
    }

    return (
      <button
        onClick={() => handleOddsClick(market, runner, type, odds.price)}
        className={`w-full sm:w-12 md:w-16 h-8 ${
          type === "Back" ? "bg-[#00B2FF] hover:bg-[#00A1E6]" : "bg-[#FF7A7F] hover:bg-[#FF6B6F]"
        } rounded flex flex-col items-center justify-center transition-colors`}
      >
        <span className="text-black text-xs sm:text-sm font-semibold">{odds.price}</span>
      </button>
    );
  };

  return (
    <div className="space-y-4 mt-4">
      {data.map((market, index) => {
        if (!market.odds?.runners || market.market.status === "SUSPENDED") return null;

        return (
          <div key={index}>
            <div className="bg-[#1a2027] rounded-lg overflow-hidden">
              <div className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3 bg-[#2c3847]">
                <h3 className="text-white font-medium w-full sm:w-auto mb-2 sm:mb-0">{market.market.name}</h3>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-gray-400 text-xs sm:text-sm">
                    Min: {market.minStake || 10} | Max: {market.maxStake || "5L"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-[#2c3847] bg-[#242a31]">
                {market.odds.runners.map((runner, idx) => (
                  <div key={idx} className="flex flex-wrap sm:flex-nowrap justify-between items-center p-3">
                    <span className="text-white text-sm w-full sm:w-[200px] mb-2 sm:mb-0">{runner.name}</span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="grid grid-cols-3 gap-1 w-1/2">
                        {[2, 1, 0].map((i) => (
                          <div key={`back-${i}`}>{renderOddsBox(runner.back[i], market, runner, "Back")}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-1 w-1/2">
                        {[0, 1, 2].map((i) => (
                          <div key={`lay-${i}`}>{renderOddsBox(runner.lay[i], market, runner, "Lay")}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* BetSlip for mobile */}
            {selectedBet && selectedBet.gameId === market.event?.event?.id && (
              <div className="md:hidden mt-2">
                <BetSlip match={selectedBet} onClose={onCloseBetSlip} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Prop Validation
Bookmaker.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      market: PropTypes.shape({
        name: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
      }).isRequired,
      event: PropTypes.shape({
        event: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
        runners: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
          })
        ),
      }),
      minStake: PropTypes.number,
      maxStake: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      odds: PropTypes.shape({
        runners: PropTypes.arrayOf(
          PropTypes.shape({
            name: PropTypes.string.isRequired,
            back: PropTypes.arrayOf(
              PropTypes.shape({
                price: PropTypes.number,
              })
            ),
            lay: PropTypes.arrayOf(
              PropTypes.shape({
                price: PropTypes.number,
              })
            ),
          })
        ),
      }),
    })
  ).isRequired,
  onBetSelect: PropTypes.func.isRequired,
  selectedBet: PropTypes.shape({
    gameId: PropTypes.string,
    home_team: PropTypes.string,
    away_team: PropTypes.string,
    selectedTeam: PropTypes.string,
    betType: PropTypes.string,
    odds: PropTypes.number,
  }),
  onCloseBetSlip: PropTypes.func.isRequired,
};

export default Bookmaker;
