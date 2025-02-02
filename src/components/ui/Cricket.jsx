import GameOdds from "../GameOdds";

const Cricket = ({ liveData }) => {

    return (
      <div className=" pt-2">
        <GameOdds liveData={liveData}/>
      </div>
    );
  };
  
  export default Cricket;
  