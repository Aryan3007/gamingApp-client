export default function UpcomingGames() {
    const upcomingGames = [
      {
        id: 1,
        teams: 'New Zealand v England',
        date: '06/12/2024',
        time: '03:30:00 (UTC+05:30)'
      },  {
        id: 2,
        teams: 'New Zealand v England',
        date: '06/12/2024',
        time: '03:30:00 (UTC+05:30)'
      },
      {
        id: 3,
        teams: 'India v Australia',
        date: '07/12/2024',
        time: '14:00:00 (UTC+05:30)'
      }
    ]
  
    return (
      <div className="bg-gray-900 p-4">
        <h2 className="text-xl font-bold text-white mb-4">Upcoming Fixture</h2>
        <div className="space-y-4">
          {upcomingGames.map((game) => (
            <div key={game.id} className="bg-gray-800 p-4 rounded">
              <div className="flex items-center gap-2">
                <span className="text-white">🏏</span>
                <div>
                  <h3 className="text-white">{game.teams}</h3>
                  <p className="text-gray-400 text-sm">
                    {game.date} {game.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  