import { useState } from 'react'
import { Menu } from 'lucide-react'

export default function AllGames() {
  const [isOpen, setIsOpen] = useState(false)

  const games = [
    { id: 1, name: 'Cricket', count: 20 },
    { id: 2, name: 'Football', count: 211 },
    { id: 3, name: 'Tennis', count: 49 },
    { id: 4, name: 'Table Tennis', count: 72 },
    { id: 5, name: 'Badminton', count: 3 },
    { id: 6, name: 'Esoccer', count: 16 },
    { id: 7, name: 'Basketball', count: 179 },
    { id: 8, name: 'Volleyball', count: 69 },
    { id: 9, name: 'Snooker', count: 32 },
    { id: 10, name: 'Ice Hockey', count: 77 },
  ]

  return (
    <div className="bg-gray-900 text-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-4 hover:bg-gray-800"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">All Sports</h2>
          <div className="space-y-2">
            {games.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center p-2 hover:bg-gray-800 rounded cursor-pointer"
              >
                <span>{game.name}</span>
                <span className="text-gray-400">({game.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

