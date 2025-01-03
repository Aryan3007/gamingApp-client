/* eslint-disable no-unused-vars */
import axios from "axios";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
// import ProtectedRoute from "./components/ProtectedRoute";
import { server } from "./constants/config";
import { userExist, userNotExist } from "./redux/reducer/userReducer";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./pages/Login"));
// const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MatchDetails = lazy(() => import("./components/MatchDetails"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const App = () => {
  const { user, loading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();



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

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Navbar />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
         
          <Route path="/match/:sportkey/events/:id" element={<MatchDetails />} />

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
