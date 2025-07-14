import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  ShoppingCart,
  ListChecks, // ✅ Lucide icon for orders
} from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-sm h-13 pt-4">
      <div className="flex justify-around items-center h-full pb-[env(safe-area-inset-bottom)]">
        <Link
          to="/"
          className={`flex flex-col items-center text-xs ${
            isActive("/") ? "text-blue-600 font-bold" : "text-gray-500"
          }`}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/search"
          className={`flex flex-col items-center text-xs ${
            isActive("/search") ? "text-blue-600 font-bold" : "text-gray-500"
          }`}
        >
          <Search size={20} />
          Search
        </Link>

        <Link
          to="/cart"
          className={`flex flex-col items-center text-xs ${
            isActive("/cart") ? "text-blue-600 font-bold" : "text-gray-500"
          }`}
        >
          <ShoppingCart size={20} />
          Cart
        </Link>

        <Link
          to="/my-orders"
          className={`flex flex-col items-center text-xs ${
            isActive("/my-orders") ? "text-blue-600 font-bold" : "text-gray-500"
          }`}
        >
          <ListChecks size={20} />
          Orders
        </Link>
      </div>
    </div>
  );
};

export default MobileBottomNav;
