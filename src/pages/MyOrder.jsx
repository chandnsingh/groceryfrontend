import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

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
  orders.map((order) => {
    order.items.map((item, idx) => {
      const variant =
        order.variants?.find((v) => v.unit === item.selectedUnit) || {};
      const unit = variant.unit || item.selectedUnit || "";
      const price = item.price || 0;
      const quantity = item.quantity || 1;
    });
  });

  return (
    <div className="max-w-4xl mx-auto mt-2 p-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border-gray-200 border  rounded-lg mb-4 shadow-md bg-white"
            >
              {/* Order Meta */}
              <div className="mb-2 flex justify-between text-sm p-5 px-7 rounded-t-lg text-black bg-gray-200">
                <div className="space-y-1">
                  <p className="font-bold">🕓 Placed on:</p>
                  <p>{new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="space-y-1">
                  <p> Order : #{order._id}</p>
                  <Link
                    to={`/order-details/${order._id}`}
                    className="text-blue-800 font-semibold flex justify-end"
                  >
                    View order details
                  </Link>
                </div>
              </div>
              <div className="mb-1 flex justify-between text-sm p-5 px-7 rounded-t-lg ">
                <div>
                  <div className="mb-2 text-sm">
                    <strong>👤 Name:</strong> {order.customer?.name || "N/A"}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>📞 Phone:</strong> {order.customer?.phone || "N/A"}
                  </div>
                  <div className="mb-2 text-sm">
                    <strong>🏠 Address:</strong>{" "}
                    {order.customer?.address || "N/A"}
                  </div>
                </div>
                <div className="text-lg">
                  {" "}
                  <strong>Total:</strong> <br /> ₹
                  {order.totalAmount?.toFixed(2) || "0.00"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrder;
