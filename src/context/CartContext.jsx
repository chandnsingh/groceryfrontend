import { createContext, useState, useEffect, useContext, useRef } from "react";
import axios from "axios";

export const CartContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser?.token || localStorage.getItem("token") || null;
  });

  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const drawerTimerRef = useRef(null);

  const syncTokenFromStorage = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const newToken = storedUser?.token || localStorage.getItem("token");
    setToken(newToken || null);
  };

  useEffect(() => {
    if (token) fetchCart();
    else setCart([]);
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart(
        res.data.map((item) => ({
          ...item,
          productId: item.productId || item,
        }))
      );
    } catch (err) {
      console.error(
        "❌ Error fetching cart:",
        err.response?.data?.message || err.message
      );
    }
  };

  const getVariantPrice = (product, selectedUnit) => {
    const variant = product.variants?.find((v) => v.unit === selectedUnit);
    if (!variant) return 0;

    const basePrice = variant.price || 0;
    const discount =
      parseFloat((variant.discount || "0").replace("%", "")) || 0;

    return Math.round(basePrice - (basePrice * discount) / 100);
  };

  const triggerCartDrawer = () => {
    setShowCartDrawer(true);
    if (drawerTimerRef.current) clearTimeout(drawerTimerRef.current);
    drawerTimerRef.current = setTimeout(() => setShowCartDrawer(false), 5000);
  };

  const addToCart = async (product, selectedUnit = null) => {
    if (!token) {
      window.location.href = "/auth?redirect=/";
      return;
    }

    const unit = selectedUnit || product.variants?.[0]?.unit || product.unit;
    const price = getVariantPrice(product, unit);

    try {
      const existingItem = cart.find(
        (item) =>
          item.productId._id === product._id && item.selectedUnit === unit
      );
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      await axios.post(
        `${BASE_URL}/cart`,
        {
          productId: product._id,
          selectedUnit: unit,
          price,
          quantity: newQuantity,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
      triggerCartDrawer();
    } catch (err) {
      console.error(
        "❌ Error adding to cart:",
        err.response?.data?.message || err.message
      );
    }
  };

  const decreaseQuantity = async (productId, selectedUnit) => {
    const item = cart.find(
      (item) =>
        (item.productId?._id || item.productId) === productId &&
        item.selectedUnit === selectedUnit
    );

    if (!item) return;

    const newQuantity = item.quantity - 1;
    if (newQuantity < 1) return await removeFromCart(productId, selectedUnit);

    try {
      await axios.post(
        `${BASE_URL}/cart`,
        { productId, selectedUnit, price: item.price, quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchCart();
      triggerCartDrawer();
    } catch (err) {
      console.error(
        "❌ Error decreasing quantity:",
        err.response?.data?.message || err.message
      );
    }
  };

  const removeFromCart = async (productId, selectedUnit) => {
    try {
      await axios.delete(`${BASE_URL}/cart/${productId}?unit=${selectedUnit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err) {
      console.error(
        "❌ Error removing from cart:",
        err.response?.data?.message || err.message
      );
    }
  };

  const clearCart = async () => {
    try {
      await axios.put(
        `${BASE_URL}/cart/clear`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart([]);
    } catch (err) {
      console.error(
        "❌ Error clearing cart:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        setToken,
        syncTokenFromStorage,
        showCartDrawer,
        setShowCartDrawer,
        triggerCartDrawer,
        getVariantPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
