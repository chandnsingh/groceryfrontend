import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api";

const OrderForm = () => {
  const { cart, clearCart } = useContext(CartContext);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      const orderData = {
        customer: form,
        items: cart.map(({ _id, name, quantity }) => ({
          productId: _id,
          name,
          quantity,
        })),
      };

      await api.post("/orders", orderData);

      setSuccess(true);
      clearCart();
      setForm({ name: "", phone: "", address: "" });
      setError("");
    } catch (err) {
      console.error("Order submission failed:", err);
      setError("Failed to place order. Try again.");
      setSuccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border border-gray-300 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">📦 Place Your Order</h2>

      {success && (
        <p className="text-green-600 font-medium mb-2">
          ✅ Order placed successfully!
        </p>
      )}
      {error && <p className="text-red-600 mb-2">❌ {error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-green-300"
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded resize-none h-24 focus:outline-none focus:ring focus:ring-green-300"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Submit Order
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
