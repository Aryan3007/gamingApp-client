import { useEffect, useState } from "react";
import Bookmaker from "../components/matchdetails_ui/Bookmaker";
import Fancy from "../components/matchdetails_ui/Fancy";
import Player from "../components/matchdetails_ui/Player";
import Other from "../components/matchdetails_ui/Other";
import BFancy from "../components/matchdetails_ui/BFancy";
import OddEven from "../components/matchdetails_ui/OddEven";
import Line from "../components/matchdetails_ui/Line";
import MatchOdds from "../components/matchdetails_ui/MatchOdds";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import BetSlip from "../components/BetSlip";
import CricketScore from "../components/matchdetails_ui/CircketScore";
import { server } from "../constants/config";

const MatchDetails = () => {
  const [activeTab, setActiveTab] = useState("bookmaker")
  const [data, setData] = useState(null)
  const [bookmakers, setBookmakers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { eventId } = useParams()
  const [selectedBet, setSelectedBet] = useState(null)

  // Component mapping object
  const tabComponents = {
    bookmaker: Bookmaker,
    fancy: Fancy,
    player: Player,
    other: Other,
    b_fancy: BFancy,
    odd_even: OddEven,
    line: Line,
  }

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.")
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${server}/api/v1/getMarkets?eventId=${eventId}`)

        if (response.status !== 200) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`)
        }
        setBookmakers(response.data.getBookmaker)
        const categorizedData = categorizeMarkets(response.data)
        setData(categorizedData)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.response?.data?.message || "Something went wrong!")
      } finally {
        setLoading(false)
      }
    }

    // Call the API initially
    fetchData()

    // Set an interval to call the API every 50 seconds
    const intervalId = setInterval(fetchData, 50000)

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId)
  }, [eventId])

  const categorizeMarkets = (rawData) => {
    const categories = {
      bookmaker: rawData.getBookmaker || [],
      fancy: [],
      player: [],
      other: [],
      b_fancy: [],
      odd_even: [],
      line: [],
    }

    if (rawData.getFancy) {
      rawData.getFancy.forEach((market) => {
        const name = market.market.name.toLowerCase()
        if (name.includes("run")) {
          categories.fancy.push(market)
        } else if (name.includes("player")) {
          categories.player.push(market)
        } else if (name.includes("odd") || name.includes("even")) {
          categories.odd_even.push(market)
        } else if (name.includes("line")) {
          categories.line.push(market)
        } else if (name.startsWith("b ")) {
          categories.b_fancy.push(market)
        } else {
          categories.other.push(market)
        }
      })
    }

    // Filter out empty categories
    const filteredCategories = Object.fromEntries(Object.entries(categories).filter(([_, value]) => value.length > 0))

    return {
      ...rawData,
      categorizedMarkets: filteredCategories,
    }
  }

  const renderActiveComponent = () => {
    if (!data || !data.categorizedMarkets) return null

    const ActiveComponent = tabComponents[activeTab]
    if (!ActiveComponent) return null

    return <ActiveComponent onBetSelect={handleBetSelection} data={data.categorizedMarkets[activeTab]} />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleBetSelection = (betData) => {
    setSelectedBet(betData)
  }

  const handleCloseBetSlip = () => {
    setSelectedBet(null)
  }

  if (loading) return <Loader />
  if (error) return <p className="text-red-500">Error: {error}</p>

  return (
    <div className="max-w-full mx-auto pt-28 md:pt-12 grid grid-cols-1 md:grid-cols-12 lg:h-screen">
      {/* Main Content */}
      <div className="md:col-span-9 px-4 rounded-lg p-2 lg:pt-2 lg:overflow-y-auto ">
        {/* Match Score */}
        <div className="p-4 bg-[#262a31] border-dashed border-zinc-700 rounded-lg border">
          <h1 className="text-2xl font-semibold">{data?.eventDetail?.event.name}</h1>
          <div className="flex items-center gap-2 mt-1 text-gray-400">
            {formatDate(data?.eventDetail?.event.startDate)}
          </div>
        </div>

        <CricketScore eventId={eventId} />

        {/* Match Odds */}
        <MatchOdds onBetSelect={handleBetSelection} eventId={eventId} />

        {/* Navigation Tabs */}
        <div className="flex bg-[#262a31] border-dashed border-zinc-700 overflow-x-auto rounded-lg border p-4">
          {Object.keys(data?.categorizedMarkets || {}).map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                activeTab === tab ? "text-blue-500 border-b-2 border-blue-500" : "hover:text-blue-500"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Dynamic Content Rendering */}
        {renderActiveComponent()}
      </div>

      {/* Bet Slip - Fixed on Right for Large Screens, Moves Below for Small Screens */}
      <div className="md:col-span-3 md:flex hidden overflow-y-auto">
        <BetSlip match={selectedBet} onClose={handleCloseBetSlip} />
      </div>
    </div>
  )
}

export default MatchDetails

