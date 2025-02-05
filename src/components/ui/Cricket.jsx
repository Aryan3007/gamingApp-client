import GameOdds from "../GameOdds"

const Cricket = ({ liveData, onBetSelect }) => {
  return (
    <div className="">
      <GameOdds liveData={liveData} onBetSelect={onBetSelect} />
    </div>
  )
}

export default Cricket

