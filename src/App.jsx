import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Navbar from "./components/Navbar"
import MatchDetails from "./components/MatchDetails"


function App() {

  return (
    <>
    <Navbar/>
    <div className="pt-10">

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/match/:id" element={<MatchDetails />} />

      </Routes>
    </div>
    </>
  )
}

export default App
