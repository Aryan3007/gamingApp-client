/* eslint-disable react/prop-types */
"use client"

import axios from "axios"
import { Home, Gamepad2, Joystick, Trophy, History, Menu, Wallet, X, User } from 'lucide-react'
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
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileDropdownOpen])

  return (
    <nav className="bg-[rgb(var(--color-primary))] w-full z-[99] shadow-md">
      <div className="max-w-full mx-auto p-2 sm:px-4">
        {/* Mobile Header */}
        <div className="flex items-center justify-between h-fit lg:hidden">
          <div className="flex items-center gap-2">
            {showsidebar ? (
              <X className="h-6 w-6 text-white" onClick={toggleSidebar} />
            ) : (
              <Menu className="h-6 w-6 text-white" onClick={toggleSidebar} />
            )}
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">SHAKTIEX</h1>
            </div>
          </div>

          {/* Mobile Wallet/Auth */}
          <div className="flex items-center gap-2">
            {!loading && user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-[rgb(var(--color-primary-dark))] rounded-full px-3 py-1">
                  <Wallet className="h-4 w-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {user?.currency} {wallet.toFixed(2)}
                  </span>
                </div>
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="text-white text-sm font-medium bg-[rgb(var(--color-primary-dark))] px-3 py-1 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                  >
                    Profile
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-[rgb(var(--color-primary-dark))] rounded-lg shadow-lg py-1 z-10">
                      <div className="px-3 py-2 border-b border-[rgb(var(--color-primary-darker))]">
                        <p className="text-white text-sm font-medium">{user?.name || 'User'}</p>
                      </div>
                      <Link to="/profile">
                        <button className="w-full text-left px-3 py-2 text-white text-sm hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                          My Profile
                        </button>
                      </Link>
                      {user?.role === "admin" && (
                        <Link to="/admin">
                          <button className="w-full text-left px-3 py-2 text-white text-sm hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                            Admin Panel
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-white text-sm hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
              <Link to="/login">
                <button className="text-white text-sm font-medium bg-[rgb(var(--color-primary-dark))] px-3 py-1 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                  Login
                </button>
              </Link>
              
              </>
            )}
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex h-fit">
          {/* Left: Logo & Company Name */}
          <div className="flex items-center gap-2 w-1/4">
            <img src="/logo.webp" className="h-12 w-12" alt="Logo" />
            <h1 className="text-white font-semibold text-2xl">Shaktiex</h1>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center justify-center flex-1">
            <div className="flex gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
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

          {/* Right: Auth & Wallet */}
          <div className="flex items-center justify-end w-1/4 gap-3">
            {!loading && user ? (
              <>
                <div className="flex items-center gap-2 bg-[rgb(var(--color-primary-dark))] rounded-full px-4 py-1.5">
                  <Wallet className="h-5 w-5 text-white" />
                  <span className="text-yellow-500 font-semibold">
                  <span className="uppercase"> {user?.currency} </span>{wallet.toFixed(2)}
                  </span>
                </div>
                <div className="relative profile-dropdown">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 text-white bg-[rgb(var(--color-primary-dark))] px-4 py-1.5 rounded-full hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[rgb(var(--color-primary-dark))] rounded-lg shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-[rgb(var(--color-primary-darker))]">
                        <p className="text-white capitalize font-medium">{user?.name || 'User'}</p>
                      </div>
                      <Link to="/profile">
                        <button className="w-full text-left px-4 py-2 text-white hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                          My Profile
                        </button>
                      </Link>
                      {user?.role === "admin" && (
                        <Link to="/admin">
                          <button className="w-full text-left px-4 py-2 text-white hover:bg-[rgb(var(--color-primary-darker))] transition-colors">
                            Admin Panel
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-[rgb(var(--color-primary-darker))] transition-colors"
                      >
                        Logout
                      </button>
                    </div>
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
        <div className="flex items-center justify-center gap-2 pt-2 lg:hidden">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex justify-center items-center text-gray-100 py-2 px-2 rounded-lg  transition-colors text-sm font-medium ${
                index === navItems.length - 1 && navItems.length % 2 !== 0 ? "col-span-2" : ""
              } ${location.pathname === item.href ? "text-yellow-500" : "hover:text-yellow-500"}`}
            >
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

