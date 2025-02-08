/* eslint-disable no-unused-vars */
import axios from "axios";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { server } from "./constants/config";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { io } from "socket.io-client";

const Loader = lazy(() => import("./components/Loader"));
const Navbar = lazy(() => import("./components/Navbar"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MatchDetails = lazy(() => import("./pages/MatchDetails"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const AllGames = lazy(() => import("./components/AllGames"));

const socket = io(server);

const App = () => {
  const { user, loading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showsidebar, setShowSideBar] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken");
      await axios
        .get(`${server}/api/v1/user/me`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => dispatch(userExist(data.user)))
        .catch(() => dispatch(userNotExist()));
    };
    fetchUser();
  }, [dispatch]);

  const toggleSidebar = useCallback(() => {
    setShowSideBar(!showsidebar);
  }, [showsidebar]);

  useEffect(() => {
    socket.on("sportsData", (data) => {
      setSportsData(data);
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar(false);
      }
    }
    if (showsidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showsidebar, toggleSidebar]);

  return loading ? (
    <Suspense fallback={<Loader />}><Loader /></Suspense>
  ) : (
    <Router>
      <Suspense fallback={<Loader />}>
        <Navbar showsidebar={showsidebar} toggleSidebar={toggleSidebar} />
        {showsidebar && (
          <div
            ref={sidebarRef}
            className="md:col-span-2 lg:hidden fixed top-0 left-0 h-full w-80 bg-[#21252b] overflow-y-auto z-[99] shadow-lg"
          >
            <AllGames sportsData={sportsData} />
          </div>
        )}
        <Routes>
          <Route path="/" element={<Dashboard sportsData={sportsData} showsidebar={showsidebar} toggleSidebar={toggleSidebar} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/match/:eventId" element={<MatchDetails sportsData={sportsData} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
