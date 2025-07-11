import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      localStorage.setItem("orderForm", JSON.stringify(form));
      navigate("/auth?redirect=/order");
      return;
    }

    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all fields");
      return;
    }

    const items = cart.map((item) => {
      const product = item.productId || item;
      const variant =
        product.variants?.find((v) => v.unit === item.selectedUnit) || {};

      const price = variant.price || item.price || 0;
      const discount = variant.discount || "0%";
      const unit = variant.unit || item.selectedUnit || "";

      return {
        _id: product._id,
        name: product.name,
        unit,
        price,
        discount,
        quantity: item.quantity,
        image: product.image || "", // ✅ this fixes your issue
      };
    });

    const totalAmount = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    try {
      setLoading(true);

      await api.post(
        "/orders",
        { customer: form, items, totalAmount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await clearCart();
      alert("Order placed successfully!");
      window.scrollTo({ top: 0, behavior: "auto" });
      navigate("/");
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("Failed to place order. Try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    const savedForm = localStorage.getItem("orderForm");
    if (savedForm) {
      setForm(JSON.parse(savedForm));
      localStorage.removeItem("orderForm");
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
      }));
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">🛍️ Place Your Order</h2>

      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleInputChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleInputChange}
        className="w-full mb-2 p-2 border rounded"
      />
      <textarea
        name="address"
        placeholder="Delivery Address"
        value={form.address}
        onChange={handleInputChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <div className="mb-4 border rounded p-3 bg-gray-50">
        <h3 className="font-semibold mb-2">🧾 Order Summary:</h3>
        {cart.length === 0 ? (
          <p className="text-sm text-gray-500">Your cart is empty.</p>
        ) : (
          <ul className="text-sm space-y-1">
            {cart.map((item, index) => {
              const product = item.productId || item;
              const variant =
                product.variants?.find((v) => v.unit === item.selectedUnit) ||
                {};

              const name = product.name || "Unnamed";
              const unit = variant.unit || item.selectedUnit || "";
              const quantity = item.quantity || 1;

              const discount = parseFloat(
                (variant.discount || "0").toString().replace("%", "")
              );

              const discountedPrice = variant.price || item.price || 0;

              const originalPrice =
                discount > 0
                  ? discountedPrice / (1 - discount / 100)
                  : discountedPrice;

              const itemTotal = discountedPrice * quantity;
              const itemMRP = originalPrice * quantity;

              return (
                <li key={index}>
                  <div className="flex justify-between p-[.6rem]">
                    <div className="flex gap-3 ">
                      <div className="w-12 h-12 border rounded-md border-gray-300 shadow-lg">
                        <img className="p-1" src={product.image} alt="" />
                      </div>

                      <div>
                        <h1 className="font-bold text-md">{name}</h1>
                        <p className="text-gray-400 font-semibold">
                          {" "}
                          ({unit}) × {quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-1">
                      <p className="text-md font-bold">
                        {" "}
                        ₹{(discountedPrice * item.quantity).toFixed(2)}{" "}
                      </p>
                      <p className="text-sm text-gray-500 font-semibold line-through">
                        {" "}
                        ₹{(originalPrice * item.quantity).toFixed(2)}{" "}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}

            <li className="font-bold m-2">
              Total: ₹
              {cart
                .reduce((sum, item) => {
                  const product = item.productId || item;
                  const variant =
                    product.variants?.find(
                      (v) => v.unit === item.selectedUnit
                    ) || {};
                  const price = variant.price || item.price || 0;
                  return sum + price * item.quantity;
                }, 0)
                .toFixed(2)}
            </li>
          </ul>
        )}
      </div>

      <button
        onClick={placeOrder}
        disabled={loading || cart.length === 0}
        className={`w-full py-2 rounded font-semibold text-white ${
          loading || cart.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

export default OrderPage;
