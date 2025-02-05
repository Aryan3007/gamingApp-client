const Other = ({ data }) => {
  return (
    <div className="mt-4">
      <div className="bg-[#1a1f2b] rounded-lg overflow-hidden">
        <div className="bg-[#1e2531] p-4 flex justify-between items-center">
          <h2 className="text-[#4a9eff] text-lg font-medium">Other</h2>
          <div className="flex gap-20">
            <span className="text-rose-500">No</span>
            <span className="text-[#4a9eff]">Yes</span>
          </div>
        </div>

        <div className="divide-y divide-gray-800">
          {data.map((market) => (
            <div key={market.market.id} className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-200">{market.market.name}</h3>
                {market.market.status === "SUSPENDED" ? (
                  <span className="text-red-500 font-medium">SUSPENDED</span>
                ) : (
                  <div className="flex gap-4">
                    <button className="bg-[#2c3340] hover:bg-[#32394a] text-rose-500 w-24 h-16 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">{market.odds?.back[0]?.price || "--"}</span>
                      <span className="text-xs text-gray-400">{market.odds?.back[0]?.size || "0"}</span>
                    </button>
                    <button className="bg-[#2c3340] hover:bg-[#32394a] text-[#4a9eff] w-24 h-16 rounded flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold">{market.odds?.lay[0]?.price || "--"}</span>
                      <span className="text-xs text-gray-400">{market.odds?.lay[0]?.size || "0"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Other

