import { useState } from "react";
import { Menu, X, Wallet } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, loading } = useSelector((state) => state.userReducer);
  const navItems = [
    { name: "Exchange", href: "#" },
    { name: "Live Casino", href: "#" },
    { name: "Slot", href: "#" },
    { name: "Fantasy Games", href: "#" },
  ];

  return (
    <nav className="bg-gradient-to-r fixed w-full z-[99] from-indigo-500 to-indigo-900">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {/* <img className="h-8 w-auto" src="/placeholder.svg?height=32&width=32" alt="Logo" /> */}
              <h1 className="text-white font-bold text-2xl">Bet/Exch</h1>
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
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* <button className="bg-indigo-600 p-1 rounded-full text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white">
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button> */}

              {!loading && user ? (
                <>
                  <button className="flex gap-2 rounded-full px-4 py-1 text-white font-semibold">
                    <Wallet className="text-white" />
                    Wallet :
                    <span className="uppercase">
                    {user?.currency} {user?.amount}
                    </span>
                  </button>

                  <button className="bg-indigo-700 text-white px-4 py-1 rounded-md hover:bg-indigo-800 transition duration-150">
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

                  <button className="  text-white px-4 py-1 rounded-md transition duration-150">
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
