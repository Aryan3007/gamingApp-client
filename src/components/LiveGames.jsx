export default function LiveGames() {
    const liveGames = [
      {
        id: 1,
        type: 'Cricket',
        match: 'South Africa v Sri Lanka',
        event: 'Test Matches',
        odds: { back: '2.08', lay: '2.1' }
      },
      {
        id: 2,
        type: 'Cricket',
        match: 'Western Province v Knights',
        event: 'CSA 4-Day Series Division 1',
        odds: { back: '-', lay: '-' }
      },
      {
        id: 3,
        type: 'Cricket',
        match: 'India T10 v New Zealand T10',
        event: 'Virtual Cricket League',
        odds: { back: '-', lay: '-' }
      },{
        id: 2,
        type: 'Cricket',
        match: 'Western Province v Knights',
        event: 'CSA 4-Day Series Division 1',
        odds: { back: '-', lay: '-' }
      },
      {
        id: 3,
        type: 'Cricket',
        match: 'India T10 v New Zealand T10',
        event: 'Virtual Cricket League',
        odds: { back: '-', lay: '-' }
      }
    ]
  
    return (
      <div className="bg-gray-900 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Live Games</h2>
        <div className="space-y-4">
          {liveGames.map((game) => (
            <div key={game.id} className="bg-gray-800 p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-green-500 text-sm">● LIVE</span>
                  <h3 className="text-white font-medium">{game.match}</h3>
                  <p className="text-gray-400 text-sm">{game.event}</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-blue-500 px-3 py-1 rounded">
                    {game.odds.back}
                  </div>
                  <div className="bg-pink-500 px-3 py-1 rounded">
                    {game.odds.lay}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  