import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import MatchDetails from "./components/MatchDetails"
import AdminDashboard from "./pages/admin/AdminDashboard"
import { Toaster } from 'react-hot-toast';


function App() {

  return (
    <>
    <Navbar/>
    <div className="pt-10">
    <Toaster />


      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/match/:id" element={<MatchDetails />} />
        <Route path="/admin_dashboard" element={<AdminDashboard />} />

      </Routes>
    </div>
    </>
  )
}

export default App
