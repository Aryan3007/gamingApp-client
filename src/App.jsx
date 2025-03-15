import axios from "axios";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import ProtectedRoute from "./components/ProtectedRoute";
import { server } from "./constants/config";
import {
  setLoading,
  userExist,
  userNotExist,
} from "./redux/reducer/userReducer";
import Withdrawl from "./pages/admin/Withdrawl";
const AccountsPayouts = lazy(() => import("./pages/legal/AccountsPayouts"));
const KycPage = lazy(() => import("./pages/legal/KycPage"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const SelfExclusion = lazy(() => import("./pages/legal/SelfExclusion"));
const AmlPolicy = lazy(() => import("./pages/legal/AmlPolicy"));
const About = lazy(() => import("./pages/About"));
const ResponsibleGambling = lazy(() =>
  import("./pages/legal/ResponsibleGambling")
);
const TermsConditions = lazy(() => import("./pages/legal/TermsConditions"));
const DisputeResolution = lazy(() => import("./pages/legal/DisputeResolution"));
const BettingRules = lazy(() => import("./pages/legal/BettingRules"));
const FairnessRng = lazy(() => import("./pages/legal/FairnessRng"));
import SuperAdminLayout from "./pages/superadmin/SuperAdminLayout";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import UserLayout from "./pages/user/UserLayout";

// Lazy loading components for better performance
const Loader = lazy(() => import("./components/Loader"));
const Navbar = lazy(() => import("./components/Navbar"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
const MyBets = lazy(() => import("./pages/MyBets"));
const Casino = lazy(() => import("./pages/Casino"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MatchDetails = lazy(() => import("./pages/MatchDetails"));
const Profile = lazy(() => import("./pages/Profile"));
const AllGames = lazy(() => import("./components/AllGames"));
const Layout = lazy(() => import("./pages/admin/Layout"));
const WebsiteManagement = lazy(() => import("./pages/admin/WebsiteManagement"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const Allrequests = lazy(() => import("./pages/admin/Allrequests"));

// Create API instance
const api = axios.create({
  baseURL: server,
  withCredentials: true,
});

// Socket configuration with improved connection options
const socket = io(server, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
});

const App = () => {
  const { user, loading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const [showsidebar, setShowSideBar] = useState(false);
  const [sportsData, setSportsData] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = useCallback(() => {
    setShowSideBar((prev) => !prev);
  }, []);

  const handleClickOutside = useCallback((event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setShowSideBar(false);
    }
  }, []);

  // User authentication setup
  useEffect(() => {
    const fetchUser = async () => {
      try {
        dispatch(setLoading(true));
        const token = localStorage.getItem("authToken");

        if (!token) {
          const retryFetchUser = async (retries) => {
            if (retries <= 0) {
              localStorage.removeItem("authToken");
              dispatch(userNotExist());
              return;
            }

            try {
              const response = await api.get("api/v1/user/me", {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.data.user.status === "banned") {
                toast.error("Your account has been banned.", { icon: "⚠️" });
                localStorage.removeItem("authToken");
                dispatch(userNotExist());
                return;
              }
            } catch (error) {
              console.error("Retrying authentication error:", error);
              setTimeout(() => retryFetchUser(retries - 1), 1000);
            }
          };

          retryFetchUser(5);
          return;
        }

        const response = await api.get("api/v1/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.user.status === "banned") {
          toast.error("Your account has been banned.", { icon: "⚠️" });
          localStorage.removeItem("authToken");
          dispatch(userNotExist());
          return;
        }

        dispatch(userExist(response.data.user));
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.removeItem("authToken");
        dispatch(userNotExist());

        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
        } else if (error.response) {
          toast.error(error.response.data.message || "Authentication failed");
        } else {
          toast.error("Connection error. Please try again later.");
        }
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);

  // Socket connection management
  useEffect(() => {
    // Connect socket
    socket.connect();

    // Socket event handlers
    const onConnect = () => {
      console.log("Socket connected successfully");
      setSocketConnected(true);
    };

    const onDisconnect = (reason) => {
      console.log(`Socket disconnected: ${reason}`);
      setSocketConnected(false);
    };

    const onConnectError = (err) => {
      console.error("Socket connection error:", err.message);
      setSocketConnected(false);
    };

    const onSportsData = (data) => {
      if (data) {
        setSportsData(data);
        // Handle different data formats
      } else {
        console.warn("Received unexpected sportsData format:", data);
      }
    };

    // Register socket event listeners
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("sportsData", onSportsData);

    // Cleanup on component unmount
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("sportsData", onSportsData);
      socket.disconnect();
    };
  }, []);

  // Sidebar click outside handler
  useEffect(() => {
    if (showsidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showsidebar, handleClickOutside]);

  if (loading) {
    return (
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Loader />
      </Suspense>
    );
  }

  return (
    <Router>
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        {window.location.pathname !== "/login" && (
          <Navbar showsidebar={showsidebar} toggleSidebar={toggleSidebar} />
        )}
        {showsidebar && window.location.pathname !== "/login" && (
          <div
            ref={sidebarRef}
            className="md:col-span-2 lg:hidden fixed h-full w-80  overflow-y-auto z-[99] shadow-lg"
          >
            <AllGames sportsData={socketConnected ? sportsData : []} />
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Dashboard
                sportsData={socketConnected ? sportsData : []}
                showsidebar={showsidebar}
                toggleSidebar={toggleSidebar}
              />
            }
          />
          <Route
            path="/match/:sportId/:eventId/:eventname"
            element={
              <MatchDetails sportsData={socketConnected ? sportsData : []} />
            }
          />

          <Route path="/casino" element={<Casino />} />
          <Route path="/slot" element={<Casino />} />
          <Route path="/fantasy" element={<Casino />} />

          {/* Public Route: Login */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!user}>
                <Login />
              </ProtectedRoute>
            }
          />

          {/* Protected Route: Only logged-in users */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={user}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mybets"
            element={
              <ProtectedRoute isAuthenticated={user}>
                <MyBets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/*"
            element={
              <ProtectedRoute isAuthenticated={user}>
                <UserLayout>
                  <Routes>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/reports" element={<SuperAdminDashboard />} />
                    <Route
                      path="/dashboard"
                      element={<SuperAdminDashboard />}
                    />
                  </Routes>
                </UserLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                isAuthenticated={user}
                adminOnly={true}
                admin={user?.role === "admin"}
              >
                <Layout>
                  <Routes>
                    <Route path="/user/:userId" element={<Withdrawl />} />
                    <Route path="/requests" element={<Allrequests />} />
                    <Route
                      path="/usermanagement"
                      element={<UserManagement />}
                    />
                    <Route path="/management" element={<WebsiteManagement />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Suoer Admin Protected Route */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute
                isAuthenticated={user}
                superAdminOnly={true}
                admin={user?.role === "super_admin"}
              >
                <SuperAdminLayout>
                  <Routes>
                    <Route
                      path="/dashboard"
                      element={<SuperAdminDashboard />}
                    />
                    <Route path="/reports" element={<SuperAdminDashboard />} />
                    <Route
                      path="/dashboard"
                      element={<SuperAdminDashboard />}
                    />
                  </Routes>
                </SuperAdminLayout>
              </ProtectedRoute>
            }
          />

          {/* Terms and Conditions */}
          <Route path="/kyc" element={<KycPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/self-exclusion" element={<SelfExclusion />} />
          <Route path="/aml" element={<AmlPolicy />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/responsible-gambling"
            element={<ResponsibleGambling />}
          />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/betting-rules" element={<BettingRules />} />
          <Route path="/dispute" element={<DisputeResolution />} />
          <Route path="/fairness" element={<FairnessRng />} />
          <Route path="/accounts" element={<AccountsPayouts />} />
          <Route path="/about" element={<About />} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
