import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Payment from "../components/Payment";
import { motion } from "framer-motion";

const CartPage = () => {
  const { cart, decreaseQuantity, addToCart } = useContext(CartContext);
  const [loadingId, setLoadingId] = useState(null);
  const [incLoadingId, setIncLoadingId] = useState(null);

  let mrpTotal = 0;
  let discountTotal = 0;

  cart.forEach((item) => {
    const product = item.productId || item;
    const selectedUnit = item.selectedUnit;
    const quantity = item.quantity || 1;

    const variant =
      product.variants?.find((v) => v.unit === selectedUnit) || {};

    const discountedPrice = variant?.price || 0;
    const discount = parseFloat(variant?.discount?.replace("%", "") || "0");

    const originalPrice =
      discount > 0 ? discountedPrice / (1 - discount / 100) : discountedPrice;

    const itemMRP = originalPrice * quantity;
    const itemDiscount = itemMRP - discountedPrice * quantity;

    mrpTotal += itemMRP;
    discountTotal += itemDiscount;
  });

  const formattedMRP = mrpTotal.toFixed(2);
  const formattedDiscount = discountTotal.toFixed(2);
  const total = (mrpTotal - discountTotal).toFixed(2);

  return (
    <div className="mx-auto px-4 py-6 max-w-[73rem] mb-10 md:mb-0 sm:min-h-[80vh]">
      <h2 className="text-2xl font-bold">My Cart</h2>

      {cart.length === 0 ? (
        <div className="flex items-center justify-center h-90 flex-col">
          <img
            src="https://www.jiomart.com/msassets/images/empty-cart.svg"
            alt="empty"
            className="w-30 md:w-40"
          />
          <p className="font-bold mt-4">Cart is empty</p>
          <p className="font-semibold text-center text-sm md:text-md text-gray-700">
            It's a nice day to buy the items you saved for later!
          </p>
          <p className="font-semibold text-center text-sm md:text-md">
            or{" "}
            <Link
              className="text-blue-700 font-bold hover:scale-102 mt-1"
              to="/"
            >
              continue shopping
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-5">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 p-6 rounded-lg border border-gray-300 bg-white shadow-md">
            <div className="flex justify-between mb-4">
              <p className="text-lg font-bold mb-2">
                Your Basket{" "}
                <span className="text-gray-400">({cart.length})</span>
              </p>
              <p className="text-lg font-bold text-green-700">₹{total}</p>
            </div>

            {cart.map((item) => {
              const product = item.productId || item;
              const selectedUnit = item.selectedUnit;
              const quantity = item.quantity || 1;
              const variant =
                product.variants?.find((v) => v.unit === selectedUnit) || {};
              const discount = parseFloat(
                variant?.discount?.replace("%", "").trim() || "0"
              );
              const price = variant?.price || 0;
              const originalPrice =
                discount > 0
                  ? (price / (1 - discount / 100)).toFixed(2)
                  : price.toFixed(2);

              const isDecLoading =
                loadingId === `${product._id}-${selectedUnit}`;
              const isIncLoading =
                incLoadingId === `${product._id}-${selectedUnit}`;

              return (
                <div
                  key={`${product._id}-${selectedUnit}`}
                  className="mb-5 border-b border-gray-200 pb-6"
                >
                  <div className="flex gap-5 items-center">
                    <img
                      className="h-20 w-20 object-cover rounded shadow-sm"
                      src={product.image}
                      alt={product.name}
                    />
                    <div>
                      <p className="text-md font-semibold text-gray-800">
                        {product.name}{" "}
                        <span className="text-xs text-gray-500">
                          ({selectedUnit})
                        </span>
                      </p>
                      <div className="flex gap-3 items-center mt-1">
                        <p className="text-md font-bold text-green-800">
                          ₹{price.toFixed(1)}
                        </p>
                        {discount > 0 && (
                          <p className="text-md font-semibold text-gray-400 line-through">
                            ₹{originalPrice}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Sold by: SIMLA DAIRY INDUSTRIES
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        disabled={isDecLoading}
                        className={`w-8 h-8 rounded-full bg-white border border-gray-300 text-xl md:pb-1 font-semibold transition duration-200 flex items-center justify-center ${
                          isDecLoading
                            ? "bg-red-100 text-red-400 cursor-not-allowed"
                            : "hover:bg-red-100 hover:text-red-600"
                        }`}
                        onClick={async () => {
                          setLoadingId(`${product._id}-${selectedUnit}`);
                          await decreaseQuantity(product._id, selectedUnit);
                          setLoadingId(null);
                        }}
                      >
                        −
                      </motion.button>

                      <p className="text-base font-medium text-gray-700 w-4 text-center">
                        {quantity}
                      </p>

                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        disabled={isIncLoading}
                        className={`w-8 h-8 rounded-full bg-white border border-gray-300 md:pb-1 text-xl font-semibold transition duration-200 flex items-center justify-center ${
                          isIncLoading
                            ? "bg-green-100 text-green-400 cursor-not-allowed"
                            : "hover:bg-green-100 hover:text-green-600"
                        }`}
                        onClick={async () => {
                          setIncLoadingId(`${product._id}-${selectedUnit}`);
                          await addToCart(product, selectedUnit);
                          setIncLoadingId(null);
                        }}
                      >
                        +
                      </motion.button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment Summary */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="rounded-lg p-6 border border-gray-300 bg-white shadow-md">
              <p className="text-xl font-bold mb-4">Payment Details</p>
              <Payment label="MRP Total" info={`₹${formattedMRP}`} />
              <hr className="mt-2 text-gray-300" />
              <Payment
                label="Discount"
                info={
                  <span className="text-green-700">-₹{formattedDiscount}</span>
                }
              />
              <hr className="mt-2 text-gray-300" />
              <Payment
                label="Delivery Charge"
                info={<span className="text-green-700">FREE</span>}
              />
              <hr className="mt-2 text-gray-300" />
              <Payment
                label="Total"
                info={<span className="font-bold">₹{total}</span>}
              />
              <p className="text-green-700 flex justify-end font-bold mt-2">
                You Saved ₹{formattedDiscount}
              </p>
            </div>

            <motion.div whileHover={{ scale: 1.03 }} className="w-full">
              <Link
                to="/order"
                className="bg-green-600 text-lg text-white shadow-lg font-semibold px-3 max-w-5xl py-3 rounded-xl text-center hover:bg-green-700 transition"
              >
                Place Order
              </Link>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
