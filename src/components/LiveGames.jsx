// import { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import PropTypes from "prop-types";
import GameOdds from "./GameOdds";
export default function LiveGames({ sportsCatagory, onBetSelect }) {
  // const [activeDropdown, setActiveDropdown] = useState(null);

  // const toggleDropdown = (index) => {
  //   setActiveDropdown(activeDropdown === index ? null : index);
  // };

  return (
    <div className="bg-gray-900 h-full p-4">
      {/* Sports Category Header */}
      {/* <div className="h-10 relative w-full flex justify-between items-center bg-gray-800 mb-4 rounded-lg">
        <div className="px-2 justify-between w-full flex items-center">
          <div className="overflow-hidden w-full">
            <div className="flex space-x-8 px-4 overflow-x-auto">
              {sportsCatagory?.map((group, index) => (
                <div key={index} className="">
                  <button
                    className="w-full text-base relative text-nowrap text-white flex items-center gap-2"
                    onClick={() => toggleDropdown(index)}
                  >
                    {group.group}
                  </button>

                  {activeDropdown === index && (
                    <div className="absolute top-full bg-gray-700 text-white rounded-md shadow-lg z-10 w-max mt-1">
                      {group.keys.map((eventKey, keyIndex) => {
                        const readableKey = eventKey
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          ) 
                          .join(" "); 

                        return (
                          <h1
                            key={keyIndex}
                            className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                          >
                            {readableKey}
                          </h1>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> */}
      <GameOdds onBetSelect={onBetSelect} />
    </div>
  );
}

LiveGames.propTypes = {
  onBetSelect: PropTypes.func.isRequired,
  sportsCatagory: PropTypes.array.isRequired,
};
