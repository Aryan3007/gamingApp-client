import { useState, useEffect, useRef } from 'react'
import {  ChevronDown, ChevronUp, Menu } from 'lucide-react'

export default function AllGames({ sportsData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(null) // Track which group is open
  const menuRef = useRef(null)

  // Group the data by sport category
  const groupedGames = sportsData.reduce((acc, game) => {
    if (!acc[game.group]) {
      acc[game.group] = []
    }
    acc[game.group].push(game)
    return acc
  }, {})

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

  const toggleGroup = (group) => {
    setActiveGroup((prevGroup) => (prevGroup === group ? null : group)) // Toggle open/close group
  }

  return (
    <div className="text-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex gap-2 items-center top-16 left-4 z-50 p-2 mt-4 ml-2 bg-gray-800 rounded-md hover:bg-gray-700"
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
        <div className="p-4 pt-0">
          <div className="space-y-2">
            {Object.keys(groupedGames).map((group) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className="w-full flex gap-4 text-left py-2 px-4 bg-gray-800 rounded-md text-white hover:bg-gray-600"
                >
                  {group} <span>{activeGroup === group ? <ChevronUp/> : <ChevronDown />}</span>
                </button>
                {activeGroup === group && (
                  <div className="pl-4 mt-2 space-y-1">
                    {groupedGames[group].map((game) => (
                      <div
                        key={game.key}
                        className="p-2 px-1 text-gray-400 hover:text-gray-100 rounded cursor-pointer"
                      >
                        <span>{game.title}</span>
                      </div>
                    ))}
                  </div>
                )}
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
