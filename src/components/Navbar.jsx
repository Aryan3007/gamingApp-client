/* eslint-disable react/prop-types */
"use client"

import axios from "axios"
import { Home, Gamepad2, Joystick, Trophy, History, Menu, Wallet, X, LogOut, User, ShieldCheck } from "lucide-react"
import { memo, useEffect, useState } from "react"
import isEqual from "react-fast-compare"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { server } from "../constants/config"
import { userNotExist } from "../redux/reducer/userReducer"

const NavbarComponent = ({ toggleSidebar, showsidebar }) => {
  const { user, loading } = useSelector((state) => state.userReducer)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [wallet, setWallet] = useState(0)

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Casino", href: "/casino", icon: Gamepad2 },
    { name: "Slot", href: "/slot", icon: Joystick },
    { name: "Fantasy", href: "/fantasy", icon: Trophy },
    { name: "My Bets", href: "/mybets", icon: History },
  ]

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("authToken")
      if (!token) return

      try {
        const response = await axios.get(`${server}api/v1/user/me`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setWallet(response?.data.user.amount)
      } catch (error) {
        console.log(error)
        dispatch(userNotExist())
      }
    }

    if (user) {
      fetchUser()
      const interval = setInterval(fetchUser, 1000)
      return () => clearInterval(interval)
    }
  }, [user, dispatch])

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    dispatch(userNotExist())
    navigate("/login")
  }

  return (
    <nav className="bg-[rgb(var(--color-primary))] w-full z-[99] shadow-md">
      <div className="max-w-full mx-auto px-2 sm:px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-14 md:hidden">
          <div className="flex items-center gap-2">
            {showsidebar ? (
              <X className="h-6 w-6 text-white" onClick={toggleSidebar} />
            ) : (
              <Menu className="h-6 w-6 text-white" onClick={toggleSidebar} />
            )}
            <div className="flex items-center gap-2">
              <img src="/logo.webp" className="h-8 w-8" alt="Logo" />
              <h1 className="text-white font-semibold text-lg">SHAKTIEX</h1>
            </div>
          </div>

          {/* Mobile Wallet/Auth */}
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[rgb(var(--color-primary-dark))] rounded-full px-3 py-1">
                  <Wallet className="h-4 w-4 text-white" />
                  <span className="text-white uppercase text-sm font-medium">
                    {user?.currency} {wallet.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-white text-sm font-medium bg-[rgb(var(--color-primary-dark))] px-3 py-1 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="text-white text-sm font-medium bg-[rgb(var(--color-primary-dark))] px-3 py-1 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-fit">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.webp" className="h-12 w-12" alt="Logo" />
              <h1 className="text-white font-semibold text-2xl">Shaktiex</h1>
            </div>
            <div className="flex gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "text-yellow-500 bg-[rgb(var(--color-primary-dark))]"
                      : "text-gray-100 hover:text-yellow-500 hover:bg-[rgb(var(--color-primary-dark))]"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-base font-medium">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Wallet/Auth */}
          <div className="flex items-center gap-3">
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2 bg-[rgb(var(--color-primary-dark))] rounded-full px-4 py-1.5">
                  <Wallet className="h-5 w-5 text-white" />
                  <span className="text-white font-medium">Wallet:</span>
                  <span className="text-yellow-500 font-semibold">
                    {user?.currency} {wallet.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-white bg-[rgb(var(--color-primary-dark))] px-4 py-1.5 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                  {user?.role === "admin" ? (
                    <Link to="/admin">
                      <button className="flex items-center gap-2 text-white bg-[rgb(var(--color-primary-dark))] px-4 py-1.5 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                        <ShieldCheck className="h-4 w-4" />
                        Admin
                      </button>
                    </Link>
                  ) : (
                    <Link to="/profile">
                      <button className="flex items-center gap-2 text-white bg-[rgb(var(--color-primary-dark))] px-4 py-1.5 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                        <User className="h-4 w-4" />
                        Profile
                      </button>
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="text-white bg-[rgb(var(--color-primary-dark))] px-4 py-1.5 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation - Two Columns */}
        <div className="flex items-center justify-center gap-2 pb-2 md:hidden">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex justify-center items-center bg-[rgb(var(--color-primary-dark))] text-gray-100 py-2 px-2 rounded-lg hover:bg-[rgb(var(--color-primary-darker))] transition-colors text-xs font-medium ${
                index === navItems.length - 1 && navItems.length % 2 !== 0 ? "col-span-2" : ""
              } ${location.pathname === item.href ? "text-white" : "hover:text-yellow-500"}`}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

const arePropsEqual = (prevProps, nextProps) => {
  return isEqual(prevProps.toggleSidebar, nextProps.toggleSidebar) && prevProps.showsidebar === nextProps.showsidebar
}

const Navbar = memo(NavbarComponent, arePropsEqual)
Navbar.displayName = "Navbar"

export default Navbar

