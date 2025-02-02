import { useState } from 'react'
import { Search, Activity, ChevronRight, ChevronDown } from 'lucide-react'

const sports = [
  { 
    name: "Cricket", 
    count: 9, 
    icon: "🏏",
    subItems: [] 
  },
  { 
    name: "Soccer", 
    count: 20, 
    icon: "⚽",
    subItems: [] 
  },
  { 
    name: "Tennis", 
    count: 3, 
    icon: "🎾",
    subItems: [
      { name: "Men's Australian Open 2025", count: 17 },
      { name: "Nonthaburi Challenger 2025", count: 10 },
      { name: "Women's Australian Open 2025", count: 14 }
    ] 
  },
  { 
    name: "Politics", 
    count: 0, 
    icon: "🗣️",
    subItems: [] 
  },
  { 
    name: "Basketball", 
    count: 0, 
    icon: "🏀",
    subItems: [] 
  },
  { 
    name: "Horse Racing", 
    count: 0, 
    icon: "🏇",
    subItems: [] 
  },
  { 
    name: "Greyhound Racing", 
    count: 0, 
    icon: "🐕",
    subItems: [] 
  },
  { 
    name: "Kabaddi", 
    count: 0, 
    icon: "🤼",
    subItems: [] 
  },
  { 
    name: "Boxing", 
    count: 0, 
    icon: "🥊",
    subItems: [] 
  }
]

export default function AllGames() {
  const [openSport, setOpenSport] = useState(null)

  return (
    <div className="min-h-screen bg-[#21252b] border-r border-dashed border-zinc-700 text-gray-300 p-4 w-full">
      <div className="flex items-center gap-2 mb-6">
        <Search className="w-5 h-5" />
        <span className="text-sm">95K</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-5 h-5" />
        <span className="text-sm">In Play</span>
        <span className="ml-auto text-[#3ea6ff]">16</span>
      </div>

      <div className="mb-2">
        <span className="text-xs text-gray-500">SPORTS</span>
        <span className="float-right text-[#3ea6ff] text-sm">542</span>
      </div>

      <div className="space-y-1">
        {sports.map((sport) => (
          <div key={sport.name}>
            <button
              onClick={() => setOpenSport(openSport === sport.name ? null : sport.name)}
              className="flex items-center w-full px-2 py-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <span className="mr-2">{sport.icon}</span>
              <span className="text-sm">{sport.name}</span>
              <span className="ml-auto text-[#3ea6ff]">{sport.count}</span>
              {sport.subItems.length > 0 && (
                <span className="ml-2">
                  {openSport === sport.name ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              )}
            </button>
            
            {openSport === sport.name && sport.subItems.length > 0 && (
              <div className="ml-7  space-y-1 mt-1">
                {sport.subItems.map((subItem) => (
                  <div
                    key={subItem.name}
                    className="flex items-center px-2 py-1.5 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="text-sm">{subItem.name}</span>
                    <span className="ml-auto text-[#3ea6ff]">{subItem.count}</span>
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

