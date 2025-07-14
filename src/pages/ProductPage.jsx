// ✅ ProductPage.jsx (Revamped as per your request)

import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { CartContext } from "../context/CartContext";
import { AnimatePresence, motion } from "framer-motion";
import ImagePreviewModal from "../components/ImagePreviewModel";

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const { cart, addToCart, decreaseQuantity, removeFromCart } =
    useContext(CartContext);
  const [previewSrc, setPreviewSrc] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        setProduct(res.data);
        setSelectedVariant(res.data.variants?.[0] || null);
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    };
    fetchProduct();
  }, [id]);
  // Dynamically manage scroll based on previewSrc
  useEffect(() => {
    if (previewSrc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [previewSrc]);

  if (!product || !selectedVariant)
    return (
      <div className="max-w-5xl mx-auto m-5 px-4 py-6 animate-pulse">
        <div className="flex flex-col md:flex-row gap-5 md:gap-15">
          {/* Left Skeleton for Image */}
          <div className="w-full md:w-[46%] h-[400px] bg-gray-200 rounded-xl"></div>

          {/* Right Skeleton for Info */}
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>

            <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>

            <div className="h-10 bg-gray-200 rounded w-40 mt-4"></div>

            <div className="h-4 bg-gray-200 rounded w-full mt-5"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>

            <div className="h-10 bg-gray-200 rounded w-1/3 mt-5"></div>
          </div>
        </div>

        {/* Features & Details Skeleton */}
        <div className="border border-gray-200 shadow-md rounded-lg mt-10 p-5 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/6"></div>
        </div>
      </div>
    );

  const { name, image, description, category, inStock, rating, reviews } =
    product;
  const discountValue = parseFloat(selectedVariant.discount || "0");
  const currentPrice = selectedVariant.price || 0;
  const originalPrice =
    discountValue > 0
      ? (currentPrice / (1 - discountValue / 100)).toFixed(0)
      : null;

  const productId = product._id;
  const cartItem = cart.find(
    (item) =>
      item.productId._id === productId &&
      item.selectedUnit === selectedVariant.unit
  );
  const quantity = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = !inStock;

  const increase = () => addToCart(product, selectedVariant.unit);
  const decrease = () => {
    if (quantity > 1) {
      decreaseQuantity(productId, selectedVariant.unit);
    } else {
      removeFromCart(productId, selectedVariant.unit);
    }
  };

  return (
    <div className="max-w-5xl mx-auto m-5 px-4 py-6">
      <div className="flex flex-col md:flex-row gap-5 md:gap-15 items-start">
        <div className="w-full md:w-[46%] border border-gray-200 shadow rounded-xl">
          <img
            src={image || "https://via.placeholder.com/300"}
            alt={name}
            className="mx-auto w-[90%] sm:w-3/4 py-5 sm:py-10 max-w-md cursor-pointer transition-transform hover:scale-102"
            onClick={() => setPreviewSrc(image)} // ✅ Open fullscreen modal
          />

          <ImagePreviewModal
            src={previewSrc}
            onClose={() => setPreviewSrc(null)}
          />
        </div>

        <div className="w-full md:w-1/2 mt-2">
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-gray-500 capitalize">{category}</p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => {
              const fillPercent = Math.max(
                0,
                Math.min(1, Math.floor(rating) - i)
              );
              return (
                <div key={i} className="relative w-4 h-4">
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
            <span className="ml-2 text-sm text-gray-500">({reviews || 0})</span>
          </div>

          {/* Price */}
          <div>
            <p className=" font-bold text-[1.5rem] ">
              Price: <span className="text-[1.5rem]"> ₹{currentPrice} </span>
              <span className="text-sm font-semibold text-gray-800">
                <span className="text-xl">/</span> {selectedVariant.unit}
              </span>
            </p>
            {discountValue > 0 && (
              <p className="text-white font-bold text-xs px-2 py-1 rounded-md inline bg-[#70d197] mb-1">
                {discountValue}% OFF
              </p>
            )}
          </div>

          {/* Select Variant */}
          <select
            className="border mt-4 p-1 w-30 rounded-md text-sm mb-4"
            value={selectedVariant.unit}
            onChange={(e) => {
              const found = product.variants.find(
                (v) => v.unit === e.target.value
              );
              setSelectedVariant(found);
            }}
          >
            {product.variants.map((variant, i) => (
              <option key={i} value={variant.unit}>
                {variant.unit}
              </option>
            ))}
          </select>

          {/* Description */}
          <p className="text-gray-700 mb-4 text-sm leading-relaxed">
            {description || "No description available."}
          </p>

          {/* Add to Cart */}
          {isOutOfStock ? (
            <button
              disabled
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded text-sm cursor-not-allowed"
            >
              Out of Stock
            </button>
          ) : (
            <AnimatePresence mode="wait" initial={false}>
              {quantity === 0 ? (
                <motion.button
                  key="add"
                  onClick={increase}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-md text-sm"
                >
                  Add to Cart
                </motion.button>
              ) : (
                <motion.div
                  key="quantity"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3"
                >
                  <button
                    onClick={decrease}
                    className="bg-red-200 px-3 py-1 text-red-800 font-bold rounded hover:bg-red-300"
                  >
                    -
                  </button>
                  <span className="text-green-700 font-bold">{quantity}</span>
                  <button
                    onClick={increase}
                    className="bg-green-200 px-3 py-1 text-green-800 font-bold rounded hover:bg-green-300"
                  >
                    +
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
      <div className="border-gray-200 shadow-md rounded-lg mt-10 p-2 md:p-5 ">
        <h1 className="text-2xl font-bold mb-5 ">Features and Details</h1>
        <p className="text-sm mb-4">
          At JMB, we take pride in offering only the finest quality
          products—carefully sourced, hygienically handled, and thoughtfully
          packaged to meet the everyday needs of your kitchen. Whether it's
          fresh vegetables, ripe seasonal fruits, premium-grade pulses, or pure
          cooking oils, every item is selected with your health and satisfaction
          in mind.
        </p>
        <p className="text-sm mb-4">
          At JMB Store, we take pride in offering only the finest quality
          products—carefully sourced, hygienically handled, and thoughtfully
          packaged to meet the everyday needs of your kitchen. Whether it's
          fresh vegetables, ripe seasonal fruits, premium-grade pulses, or pure
          cooking oils, every item is selected with your health and satisfaction
          in mind.
        </p>
        <p className="text-sm mb-4">
          We understand that quality and value are important, which is why we
          strive to keep our prices fair without compromising on standards.
          Plus, with fast doorstep delivery and a hassle-free shopping
          experience, getting your daily essentials has never been easier.
        </p>
        <p className="text-sm mb-4">
          Discover premium quality you can taste and trust with every product
          from JMB Store. We are committed to bringing fresh, natural, and
          nutritious ingredients straight to your doorstep. Whether you're
          shopping for everyday essentials like fresh vegetables and fruits,
          pantry staples like dals and grains, or cooking necessities like oils
          and spices – every item in our store meets high standards of quality,
          hygiene, and value.
        </p>
        <p className="text-sm mb-4">
          Each product is carefully handpicked and sourced from trusted farms,
          suppliers, and producers. Our fresh produce is harvested at the right
          time to ensure peak ripeness and flavor. Grains and pulses are
          cleaned, sorted, and stored under controlled conditions to maintain
          nutritional integrity. Edible oils and spices are selected for their
          purity, aroma, and health benefits.
        </p>
        <p className="text-sm mb-4">
          We maintain strict quality control at every stage—from procurement and
          storage to packaging and delivery. Our storage facilities follow
          food-grade standards to protect your groceries from contamination,
          moisture, and spoilage. This ensures that the product you receive is
          not only fresh but also safe for your family.
        </p>
        <p className="text-sm mb-4">
          Why shop with us?
          <ul className="mt-2 font-serif">
            <li>✅ Farm-fresh vegetables and seasonal fruits</li>
            <li> ✅ High-grade dals, rice, and pulses</li>
            <li>✅ Pure and unadulterated cooking oils</li>
            <li>✅ Clean, hygienic packaging with zero compromise on safety</li>
            <li> ✅ Fast, reliable doorstep delivery</li>
            <li>✅ Honest pricing and regular offers</li>
          </ul>
        </p>
        <p className="text-sm mb-4">
          Our goal is to make your grocery shopping not just convenient, but
          also healthy and trustworthy. From simple home meals to festive
          cooking, trust JMB Store to deliver the quality your kitchen deserves.
        </p>
      </div>
    </div>
  );
};

export default ProductPage;
