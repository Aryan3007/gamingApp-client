/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Wallet, X } from "lucide-react";
import { userNotExist } from "../redux/reducer/userReducer";

const Navbar = ({ toggleSidebar, showsidebar }) => {
  const { user, loading } = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();
  const walletAmount = localStorage.getItem("walletAmount");
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Casino", href: "#" },
    { name: "Slot", href: "#" },
    { name: "Fantasy", href: "#" },
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(userNotExist()); // Clear user from Redux state
    navigate("/login");
  };

  const formatAmount = (amount) => {
    if (amount >= 1_000_000_000)
      return (amount / 1_000_000_000).toFixed(2) + "B"; // Billions
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(2) + "M"; // Millions
    return amount.toFixed(2); // Normal display
  };

  return (
    <nav className="bg-[#181d26] bg-opacity-70 backdrop-blur-lg  fixed w-full z-[99]">
      <div className="max-w-full mx-auto px-4">
        <div className="flex items-center justify-between lg:justify-between h-12">
          <div className="flex items-center gap-3">
            {showsidebar ? (
              <X className="lg:hidden flex" onClick={toggleSidebar} />
            ) : (
              <Menu className="lg:hidden flex" onClick={toggleSidebar} />
            )}

            <h1 className="text-white hidden sm:flex font-bold text-base md:text-2xl">
              Cric/Bet
            </h1>
          </div>
          <div className=" hidden md:flex gap-2 py-2 text-center">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-300  hover:text-blue-500 hover:border-b border-blue-500 md:px-3 md:py-2  text-base font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="flex items-center">
            {!loading && user ? (
              <div className="flex gap-2">
                <div className="flex gap-2 cursor-default text-sm rounded-full px-4 py-1 text-white font-semibold">
                  <Wallet className="text-white flex text-sm" />
                  <span className="hidden md:flex">Wallet :</span>

                  <span className="uppercase text-sm">
                    {user?.currency}{" "}
                    {walletAmount || formatAmount(user?.amount)}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="border border-zinc-500 text-sm text-white md:px-4 px-1 py-1 rounded-md hover:bg-blue-500 transition duration-150"
                >
                  Logout
                </button>
                {user?.role === "admin" ? (
                  <Link to="/admin">
                    <button className="border border-zinc-500 text-sm text-white md:px-4 px-1 py-1 rounded-md hover:bg-blue-500 transition duration-150">
                      Admin
                    </button>
                  </Link>
                ) : (
                  <Link to="/profile">
                    <button className="border border-zinc-500 text-sm text-white px-4 py-1 rounded-md hover:bg-blue-500 transition duration-150">
                      Profile
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <Link to={"/login"}>
                <button className="border border-zinc-500 text-white px-4 py-1 rounded-md hover:bg-blue-500 transition duration-150">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className=" md:hidden flex gap-2 py-2 justify-center text-center">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="block text-gray-300 text-sm hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md  font-medium"
          >
            {item.name}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
