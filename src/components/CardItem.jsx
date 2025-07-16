import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";

const CardItem = (props) => {
  const { cart, addToCart, removeFromCart, decreaseQuantity } =
    useContext(CartContext);

  const product = props.productData;
  if (!product) return null;

  const productId = product._id;
  const isOutOfStock = !product.inStock;

  const variants = props.variants || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);

  const cartItem = cart.find(
    (item) =>
      item.productId._id === productId &&
      item.selectedUnit === selectedVariant?.unit
  );

  const quantity = cartItem ? cartItem.quantity : 0;

  const increase = () => addToCart(product, selectedVariant.unit);
  const decrease = () => {
    if (quantity > 1) {
      decreaseQuantity(productId, selectedVariant.unit);
    } else {
      removeFromCart(productId, selectedVariant.unit);
    }
  };

  const handleAdd = () => {
    addToCart(product, selectedVariant.unit);
  };

  const discountValue = parseFloat(selectedVariant?.discount || "0");
  const currentPrice = selectedVariant?.price || 0;
  const originalPrice =
    discountValue > 0
      ? (currentPrice / (1 - discountValue / 100)).toFixed(1)
      : currentPrice.toFixed(1);

  const rating = Math.floor(props.rating || 0);
  const reviews = props.reviews || 0;

  return (
    <div className="flex flex-col justify-between h-full relative">
      {/* 🔗 Clickable Image */}
      <Link
        to={`/product/${productId}`}
        state={{ name: product.name, category: product.category }}
        className="relative w-full h-36 block"
      >
        <img
          src={props.img}
          alt={props.name}
          className={`w-full h-full object-cover rounded-md transition-opacity duration-300 ${
            !product.inStock ? "opacity-40 blur-sm" : ""
          }`}
        />

        {discountValue > 0 && (
          <div className="absolute top-0 left-0 bg-green-800 text-white px-2 font-sans font-bold text-[0.6rem] p-1 rounded-tl-md rounded-br-md z-10">
            {selectedVariant.discount} OFF
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <p className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              Out of Stock
            </p>
          </div>
        )}
      </Link>

      {/* 🔗 Clickable Title */}
      <Link
        to={`/product/${productId}`}
        state={{ name: product.name, category: product.category }}
        className="my-2 mx-2 font-semibold text-md truncate hover:underline"
      >
        {props.name}
      </Link>

      <select
        className="w-full max-w-[180px] p-1 border border-gray-300 rounded-md text-xs"
        value={selectedVariant?.unit}
        onChange={(e) => {
          const variant = variants.find((v) => v.unit === e.target.value);
          setSelectedVariant(variant);
        }}
        disabled={isOutOfStock}
      >
        {variants.map((variant, index) => (
          <option key={index} value={variant.unit}>
            {variant.unit}
          </option>
        ))}
      </select>

      <div className="pt-2 h-12">
        <p className="text-gray-500 text-xs overflow-hidden line-clamp-2">
          {props.description}
        </p>
      </div>

      <div className="pb-2 flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            const fillPercent = Math.max(0, Math.min(1, rating - i));
            return (
              <div key={i} className="relative w-3 h-3">
                <svg
                  viewBox="0 0 20 20"
                  className="absolute top-0 left-0 w-full h-full text-gray-300"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                <svg
                  viewBox="0 0 20 20"
                  className="absolute top-0 left-0 w-full h-full text-yellow-400"
                  fill="currentColor"
                  style={{
                    clipPath: `inset(0 ${100 - fillPercent * 100}% 0 0)`,
                  }}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            );
          })}
        </div>

        <span className="text-xs text-gray-500 ml-1">({reviews})</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="mt-[0.4rem]">
          {discountValue > 0 && (
            <p className="font-semibold  text-[.75rem]  text-gray-400 line-through">
              ₹{originalPrice}
            </p>
          )}
          <p className="font-semibold text-[.95rem] text-green-800">
            ₹{currentPrice}
          </p>
        </div>

        {isOutOfStock ? (
          <button
            disabled
            className="bg-gray-300 text-gray-600 px-2 py-1 mt-4 rounded-md text-[0.80rem] cursor-not-allowed"
          >
            Unavailable
          </button>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            {quantity === 0 ? (
              <motion.button
                key="add"
                onClick={handleAdd}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 mt-4 border rounded-md text-[0.80rem] font-semibold text-green-100 px-3 py-1 hover:bg-green-400 transition-transform transform hover:scale-105 shadow-green-900 duration-150"
              >
                Add
              </motion.button>
            ) : (
              <motion.div
                key="quantity"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="flex items-center mt-4 gap-[0.5rem] border border-gray-200 rounded"
              >
                <button
                  onClick={decrease}
                  className="bg-red-300 border border-red-700 text-[.80rem]  py-[0.15rem] px-[0.50rem] rounded text-red-700 font-bold hover:bg-red-400"
                >
                  −
                </button>
                <span className="text-green-800 text-[.80rem]  font-bold">
                  {quantity}
                </span>
                <button
                  onClick={increase}
                  className="bg-green-300 text-[.80rem] border border-green-700  py-[0.15rem] px-[0.50rem] rounded text-green-700 font-bold hover:bg-green-400"
                >
                  +
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CardItem;
