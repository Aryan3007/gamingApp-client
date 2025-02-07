/* eslint-disable no-unused-vars */
import axios from "axios";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/Loader";
// import ProtectedRoute from "./components/ProtectedRoute";
import { server } from "./constants/config";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import AllGames from "./components/AllGames";
import { io } from "socket.io-client";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MatchDetails = lazy(() => import("./pages/MatchDetails"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const socket = io(server);

const App = () => {
  const { user, loading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showsidebar, setShowSideBar] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const sidebarRef = useRef(null); // Ref for the sidebar

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
  },[showsidebar]);

  useEffect(() => {
    socket.on("sportsData", (data) => {
      setSportsData(data);
    });
  }, []);
  // Function to handle clicks outside of sidebar
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
    <Loader />
  ) : (
    <Router>
      <Navbar showsidebar={showsidebar} toggleSidebar={toggleSidebar} />
      {showsidebar ? (
        <div
          ref={sidebarRef}
          className="md:col-span-2 lg:hidden fixed top-0 left-0 h-full w-80 bg-[#21252b] overflow-y-auto z-[99] shadow-lg"
        >
          <AllGames sportsData={sportsData} />
        </div>
      ) : null}
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                sportsData={sportsData}
                showsidebar={showsidebar}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route path="/login" element={<Login />} />

          <Route path="/match/:eventId" element={<MatchDetails sportsData={sportsData} />} />

          {/* Not logged In Route */}
          {/* <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Login />
              </ProtectedRoute>
            }
          /> */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/admin/register" element={<Register />} /> */}
          {/* Admin Routes */}
          {/* <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin"}
              />
            }
          >
          
          </Route> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
