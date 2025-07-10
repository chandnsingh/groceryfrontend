import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import HeaderCart from "./HeaderCart";
import { useCart } from "../context/CartContext";
import { Menu, X } from "lucide-react";

const Header = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const { setCart, syncTokenFromStorage } = useCart();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setCart([]);
    syncTokenFromStorage();
    setUser(null);
    setShowDropdown(false);
    navigate("/auth");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative z-50">
      <div>
        <nav className="flex justify-between sm:justify-center gap-5 items-center px-4 py-3 bg-white shadow-md">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              className="h-7"
              src="https://cdn-icons-png.flaticon.com/128/869/869432.png"
              alt="store"
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-yellow-500 bg-clip-text text-transparent">
              JMB Store
            </h1>
          </div>

          {/* Hamburger Icon */}
          <button className="md:hidden" onClick={toggleMenu}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Search Bar */}
            <div
              tabIndex="0"
              className="border border-gray-200 rounded-lg flex items-center focus-within:outline-2 focus-within:outline-green-700 shadow"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/128/622/622669.png"
                alt="icon"
                className="w-[12px] h-[12px] mx-4 my-3"
              />
              <input
                className="w-90 sm:w-100 focus:outline-none"
                type="text"
                placeholder="Search for products"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <HeaderCart />

            {/* ✅ My Orders Link */}
            {user && (
              <Link to="/my-orders">
                <div className="flex shadow-md text-[.83rem] font-semibold text-green-600 hover:underline bg-green-100 px-3 py-2 rounded-md">
                  <img
                    className="h-5 mr-2"
                    src="https://cdn-icons-png.flaticon.com/128/6815/6815043.png"
                    alt="cart"
                  />
                  <p>My Orders</p>
                </div>
              </Link>
            )}

            {!user ? (
              <Link
                to="/auth"
                className="shadow-md py-2 rounded-md bg-blue-200 text-blue-700 font-semibold text-[0.83rem] px-3"
              >
                Login / Signup
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 hover:bg-gray-200 shadow"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
                    alt="profile"
                    className="h-5"
                  />
                  <span className="text-[0.83rem] font-semibold">
                    {user.name.split(" ")[0]}
                  </span>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {user?.isAdmin && (
              <Link
                to="/admin"
                className="text-[0.83rem] py-2 shadow-md bg-gray-700 text-gray-200 font-bold px-3 outline-none p-3 rounded-md"
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay when menu is open */}
      <div>
        {menuOpen && (
          <div
            className="fixed inset-0 backdrop-blur-xs z-40"
            onClick={toggleMenu}
          ></div>
        )}
      </div>

      {/* Sidebar Menu (Mobile) */}
      <div className="mobile">
        <div
          className={`fixed top-0 left-0 h-full w-[75%] max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <p className="text-md font-semibold">
                Welcome {user?.name?.split(" ")[0] || "Guest"}
              </p>
              <p className="text-xs font-bold text-green-700">
                JMD Grocery Shop
              </p>
            </div>
            <button onClick={toggleMenu}>
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-4 p-4">
            <Link
              to="/"
              onClick={toggleMenu}
              className="text-sm font-medium hover:underline"
            >
              Home
            </Link>
            <Link
              to="/cart"
              onClick={toggleMenu}
              className="text-sm font-medium hover:underline"
            >
              Cart
            </Link>

            {/* ✅ My Orders in Mobile Menu */}
            {user && (
              <Link
                to="/my-orders"
                onClick={toggleMenu}
                className="text-sm font-medium hover:underline"
              >
                My Orders
              </Link>
            )}

            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={toggleMenu}
                className="text-sm font-medium hover:underline"
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/about"
              onClick={toggleMenu}
              className="text-sm font-medium hover:underline"
            >
              About
            </Link>
            <Link
              to="/terms"
              onClick={toggleMenu}
              className="text-sm font-medium hover:underline"
            >
              Terms & Conditions
            </Link>

            {!user ? (
              <Link
                to="/auth"
                onClick={toggleMenu}
                className="text-sm font-medium bg-blue-300 text-blue-700 px-4 py-2 rounded"
              >
                Login / Signup
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
                className="text-sm font-medium bg-red-200 border text-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            )}
          </nav>
          {/* 🔍 Mobile Search Bar and Cart - visible only on mobile */}
        </div>
      </div>
      {/* 🔍 Mobile Search Bar and Cart - visible only on mobile */}
      <div className="block md:hidden p-2 bg-white shadow-sm border-1 border-gray-200 mx-3 my-4 rounded-xl">
        <div className="flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/622/622669.png"
            alt="search"
            className="w-[16px] h-[16px]"
          />
          <input
            type="text"
            placeholder="Search for products"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (location.pathname !== "/") navigate("/");
            }}
            className="w-full rounded-lg px-3 py-1 text-sm focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
