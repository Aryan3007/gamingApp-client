import { useState } from "react";
import { Menu, X, Wallet, MenuIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({toggleSidebar}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useSelector((state) => state.userReducer);
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Live Casino", href: "#" },
    { name: "Slot", href: "#" },
    { name: "Fantasy Games", href: "#" },
  ];

  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };
  return (
    <nav className="bg-[#181d26] fixed w-full z-[99]">
      <div className="max-w-full mx-auto px-1">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <div className="flex gap-3 justify-center items-center">
              <MenuIcon onClick={toggleSidebar} />
              <h1 className="text-white font-bold text-2xl">Cric/Bet</h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:bg-indigo-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {!loading && user ? (
                <div className="flex gap-2">
                  <button className="flex gap-2 rounded-full px-4 py-1 text-white font-semibold">
                    <Wallet className="text-white" />
                    Wallet :
                    <span className="uppercase">
                      {user?.currency} {user?.amount}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="border border-zinc-500 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150"
                  >
                    Sign Out
                  </button>
                  {user?.role === "admin" ? (
                    <Link to="/admin">
                      <button className="border border-zinc-500 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150">
                        Admin
                      </button>
                    </Link>
                  ) : (
                    <Link to="/profile">
                      <button className="border border-zinc-500 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150">
                        Profile
                      </button>
                    </Link>
                  )}
                </div>
              ) : (
                <Link to={"/login"}>
                  <button className="border border-zinc-500 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className=" inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white "
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:bg-indigo-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="pt-4 pb-3 border-t border-indigo-700">
            <div className=" px-2 space-y-3">
              {!loading && user ? (
                <>
                  <button className="flex gap-2 rounded-full px-4 py-1 text-white font-semibold">
                    <Wallet className="text-white" />
                    Wallet :
                    <span className="uppercase">
                      {user?.currency} {user?.amount}
                    </span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="  text-white px-4 py-1 rounded-md transition duration-150"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link to={"/login"}>
                  <button className="bg-indigo-700 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
