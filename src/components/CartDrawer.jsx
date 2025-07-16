import { useCart } from "../context/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { cart, showCartDrawer, setShowCartDrawer } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isVisible =
    showCartDrawer &&
    cart.length > 0 &&
    /^\/$|^\/product\/[^/]+$/.test(location.pathname);

  const itemImages = cart
    .slice(0, 2)
    .map((item) => item.productId?.image || item.image)
    .filter(Boolean);

  const handleClick = () => {
    setShowCartDrawer(false);
    navigate("/cart");
  };

  const handleClickWithDelay = () => {
    setTimeout(() => {
      handleClick();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="cart-drawer"
          initial={{ y: 200, opacity: 0 }} // Start lower opacity
          animate={{ y: 0, opacity: 1 }} // Full opacity at final position
          exit={{ y: 200, opacity: 0 }} // Fade out + slide down on exit
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-17 left-1/2 active:bg-green-900 transition -translate-x-1/2 z-50 bg-green-700/98 text-white rounded-full py-2 flex gap-3 items-center shadow-xl max-w-md sm:hidden cursor-pointer"
          onClick={handleClickWithDelay}
        >
          {/* Product Thumbnails */}
          <div className="flex -space-x-3 pl-3">
            {itemImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="cart item"
                className="w-6 h-6 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>

          {/* Cart Info */}
          <div className="flex-1 text-center">
            <p className="text-sm font-bold leading-tight">View cart</p>
            <p className="text-[0.70rem] text-white/90">
              {cart.length} ITEM{cart.length > 1 ? "S" : ""}
            </p>
          </div>

          {/* Chevron icon */}
          <div className="pr-3 text-bold rounded-full pointer-events-none">
            <ChevronRight size={20} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
