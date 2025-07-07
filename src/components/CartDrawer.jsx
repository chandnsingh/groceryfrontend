import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CartDrawer = () => {
  const { cart, showCartDrawer, setShowCartDrawer } = useCart();
  const navigate = useNavigate();

  if (!showCartDrawer || cart.length === 0) return null;

  const itemImages = cart
    .slice(0, 2)
    .map((item) => item.productId?.image || item.image)
    .filter(Boolean);

  return (
    <AnimatePresence>
      {showCartDrawer && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-13 left-1/2 -translate-x-1/2 z-50 bg-green-700 text-white rounded-full px-5 py-2 flex items-center shadow-xl w-[50%] max-w-md sm:hidden"
        >
          {/* Product Thumbnails */}
          <div className="flex -space-x-3 mr-4">
            {itemImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="cart item"
                className="w-5 h-5 rounded-full border-2 border-white object-cover"
              />
            ))}
          </div>

          {/* Cart Info */}
          <div className="flex-1">
            <p className="text-sm font-bold leading-tight">View cart</p>
            <p className="text-[0.70rem] text-white/90">
              {cart.length} ITEM{cart.length > 1 ? "S" : ""}
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => {
              setShowCartDrawer(false);
              navigate("/cart");
            }}
            className="bg-green-700 hover:bg-green-800 rounded-full p-2"
          >
            <ChevronRight size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
