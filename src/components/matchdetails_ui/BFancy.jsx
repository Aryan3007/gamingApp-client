const BFancy = ({ data }) => {
  return (
    <div className="mt-4">
      {data?.map((market) => (
        <div key={market.market.id} className="mb-4 p-4 bg-[#262a31] border-dashed border-zinc-700 rounded-lg border">
          <h3 className="text-lg font-medium mb-2">{market.market.name}</h3>
          <div className="flex justify-between">
            <div>
              <span className="text-blue-500">Back: </span>
              {market.odds.back[0].price}
            </div>
            <div>
              <span className="text-pink-500">Lay: </span>
              {market.odds.lay[0].price}
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">Status: {market.market.status}</p>
        </div>
      ))}
    </div>
  )
}

export default BFancy

