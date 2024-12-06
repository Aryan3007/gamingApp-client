import AllGames from "../components/AllGames";
import LiveGames from "../components/LiveGames";
import Navbar from "../components/Navbar";
import UpcomingGames from "../components/UpcomingGames";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
        {/* Left Sidebar */}
        <div className="md:col-span-3">
          <AllGames />
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-6">
          <LiveGames />
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-3">
          <UpcomingGames />
        </div>
      </div>
    </div>
  );
}
