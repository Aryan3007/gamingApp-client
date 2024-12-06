import AllGames from "../components/AllGames";
import LiveGames from "../components/LiveGames";
import Navbar from "../components/Navbar";
import UpcomingGames from "../components/UpcomingGames";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 p-4 h-[calc(100vh-64px)]">
        {/* Left Sidebar */}
        <div className="md:col-span-3 overflow-y-auto">
          <AllGames />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-6 overflow-y-auto">
          <LiveGames />
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-3 overflow-y-auto">
          <UpcomingGames />
        </div>
      </div>
    </div>
  );
}

