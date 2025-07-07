import { useEffect, useState } from "react";
import api from "../api";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return alert("Please login to view your orders");
    }

    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
        alert("Error loading orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded mb-4 shadow-sm bg-white"
          >
            {/* Order Meta */}
            <div className="mb-2 text-sm text-gray-500">
              <strong>🕓 Placed on:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>

            <div className="mb-2 text-sm">
              <strong>👤 Name:</strong> {order.customer?.name || "N/A"}
            </div>
            <div className="mb-2 text-sm">
              <strong>📞 Phone:</strong> {order.customer?.phone || "N/A"}
            </div>
            <div className="mb-2 text-sm">
              <strong>🏠 Address:</strong> {order.customer?.address || "N/A"}
            </div>

            {/* Order Items */}
            <div className="mt-2">
              <h4 className="font-semibold mb-1 text-sm">🧾 Items:</h4>
              <ul className="text-sm list-disc ml-5">
                {order.items.map((item, idx) => {
                  const unit = item.unit || "";
                  const price = item.price || 0;
                  const quantity = item.quantity || 1;
                  return (
                    <li key={idx}>
                      {item.name} ({unit}) × {quantity} = ₹
                      {(price * quantity).toFixed(2)}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Total & Status */}
            <div className="mt-3 text-green-700 font-semibold">
              Total: ₹{order.totalAmount?.toFixed(2) || "0.00"}
            </div>
            <div className="text-sm text-blue-600 mt-1">
              Status: {order.status || "Pending"}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrder;
