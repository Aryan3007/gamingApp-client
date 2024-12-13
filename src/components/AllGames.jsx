import { useState, useEffect, useRef } from 'react'
import { Menu } from 'lucide-react'

export default function AllGames() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className=" text-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden  flex gap-2 items-center top-16 left-4 z-50 p-2 mt-4 ml-2 bg-gray-800 rounded-md hover:bg-gray-700"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" /> All Sports
      </button>

      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 lg:w-auto md:bg-transparent bg-gray-800 mt-4 rounded-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold lg:mt-0 mt-12 mb-4">All Sports</h2>
          <div className="space-y-2 lg:pt-4">
            {games.map((game) => (
              <div
                key={game.id}
                className="flex justify-between items-center p-2 px-1 hover:bg-gray-800 rounded cursor-pointer"
              >
                <span>{game.name}</span>
                <span className="text-gray-400">({game.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  )
}

