import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

const HeaderCart = () => {
  const { cart } = useContext(CartContext);

  const uniqueItemCount = cart.length; // ✔️ only count unique items

  return (
    <Link to="/cart">
      <div className="shadow-md py-2 px-3 rounded-md bg-orange-100 text-orange-700 font-semibold text-[0.83rem] flex items-center relative">
        <img
          className="h-5 mr-2"
          src="https://cdn-icons-png.flaticon.com/128/4290/4290854.png"
          alt="cart"
        />
        <p>Cart</p>

        {uniqueItemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {uniqueItemCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default HeaderCart;
