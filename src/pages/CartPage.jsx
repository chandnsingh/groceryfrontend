import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import Payment from "../components/Payment";

const CartPage = () => {
  const { cart, decreaseQuantity, addToCart } = useContext(CartContext);

  let mrpTotal = 0;
  let discountTotal = 0;

  cart.forEach((item) => {
    const product = item.productId || item;
    const selectedUnit = item.selectedUnit;
    const quantity = item.quantity || 1;

    // ✅ Find correct variant
    const variant =
      product.variants?.find((v) => v.unit === selectedUnit) || {};

    // ✅ Extract discounted price (used across your app)
    const discountedPrice = variant?.price || 0;
    const discount = parseFloat(variant?.discount?.replace("%", "") || "0");

    // ✅ Compute original price from discounted one
    const originalPrice =
      discount > 0 ? discountedPrice / (1 - discount / 100) : discountedPrice;

    // ✅ Totals
    const itemMRP = originalPrice * quantity;
    const itemDiscount = itemMRP - discountedPrice * quantity;

    mrpTotal += itemMRP;
    discountTotal += itemDiscount;
  });

  // ✅ Final totals
  const formattedMRP = mrpTotal.toFixed(2);
  const formattedDiscount = discountTotal.toFixed(2);
  const total = (mrpTotal - discountTotal).toFixed(2);

  return (
    <div className="mx-auto px-4 py-6 max-w-[73rem] min-h-[80vh]">
      <h2 className="text-2xl font-bold">My Cart</h2>

      {cart.length === 0 ? (
        <div className="flex items-center justify-center h-80 flex-col">
          <img
            src="https://www.jiomart.com/msassets/images/empty-cart.svg"
            alt="empty"
          />
          <p className="font-bold mt-2">Cart is empty</p>
          <p className="font-semibold text-gray-700">
            It's a nice day to buy the items you saved for later!
          </p>
          <Link className="text-blue-600" to="/">
            or continue shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-5">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3 p-6 rounded-lg border border-gray-300 bg-white shadow-sm">
            <div className="flex justify-between">
              <p className="text-lg font-bold">
                Your Basket{" "}
                <span className="text-gray-400">({cart.length})</span>
              </p>
              <p className="text-lg font-bold">₹{total}</p>
            </div>

            <div>
              {cart.map((item) => {
                const product = item.productId || item;
                const selectedUnit = item.selectedUnit;
                const quantity = item.quantity || 1;

                const variant =
                  product.variants?.find((v) => v.unit === selectedUnit) || {};

                const discount = parseFloat(
                  variant?.discount?.replace("%", "").trim() || "0"
                );

                // Treat variant.price as the discounted price (like on homepage)
                const price = variant?.price || 0;

                const originalPrice =
                  discount > 0
                    ? (price / (1 - discount / 100)).toFixed(2)
                    : price.toFixed(2);

                return (
                  <div key={`${product._id}-${selectedUnit}`}>
                    <div className="flex mt-6 gap-5">
                      <img
                        className="h-20 w-20 object-cover rounded"
                        src={product.image}
                        alt={product.name}
                      />
                      <div>
                        <p className="text-md font-semibold text-gray-700">
                          {product.name}
                          <span className="text-xs ml-2 text-gray-500">
                            ({selectedUnit})
                          </span>
                        </p>
                        <div className="flex gap-3 items-center">
                          <p className="text-md font-bold text-green-800">
                            ₹{price.toFixed(1)}
                          </p>
                          {discount > 0 && (
                            <p className="text-md font-semibold text-gray-400 line-through">
                              ₹{originalPrice}
                            </p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          Sold by: SIMLA DAIRY INDUSTRIES
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between gap-2 mt-2">
                      <p>{""}</p>
                      <div className="flex gap-3">
                        <button
                          className="border rounded-full w-8 h-8 pb-1 font-bold"
                          onClick={() =>
                            decreaseQuantity(product._id, selectedUnit)
                          }
                        >
                          −
                        </button>
                        <p className="mt-1">{quantity}</p>
                        <button
                          className="border rounded-full w-8 h-8 pb-1 font-bold"
                          onClick={() => addToCart(product, selectedUnit)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <hr className="mt-5 text-gray-200" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            <div className="rounded-lg p-6 border border-gray-300 bg-white shadow-sm">
              <div className="flex justify-between">
                <p className="text-xl font-bold">Payment Details</p>
              </div>

              <div className="mt-3">
                <Payment label="MRP Total" info={`₹${formattedMRP}`} />
                <hr className="mt-2 text-gray-300" />
                <Payment
                  label="Discount"
                  info={
                    <span className="text-green-700">
                      -₹{formattedDiscount}
                    </span>
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
                <p className="text-green-700 flex justify-end font-bold">
                  You Saved ₹{formattedDiscount}
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                className="bg-green-600 text-lg text-white shadow-lg font-semibold p-3 rounded-2xl w-full text-center"
                to="/order"
              >
                Place Order
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
