import { useEffect, useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const OrderSkeleton = () => {
  return (
    <div className="border-gray-200 border rounded-lg mb-7 shadow-md bg-white animate-pulse">
      <div className="mb-2 flex justify-between text-[0.8rem] px-2 py-2 rounded-t-lg bg-gray-200">
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
          <div className="h-2 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-3 w-28 bg-gray-300 rounded"></div>
          <div className="h-2 w-20 bg-gray-300 rounded ml-auto"></div>
        </div>
      </div>
      <div className="flex justify-between text-xs p-4">
        <div className="space-y-3">
          <div className="h-3 w-40 bg-gray-300 rounded"></div>
          <div className="h-3 w-36 bg-gray-300 rounded"></div>
          <div className="h-3 w-48 bg-gray-300 rounded"></div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-3 w-16 bg-gray-300 rounded"></div>
          <div className="h-3 w-12 bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
};

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate(`/auth`);
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
        navigate(`/auth`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="max-w-4xl mx-auto mt-2 p-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Orders</h2>
      <div>
        {loading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : orders.length === 0 ? (
          <div className="text-center mt-10 mb-2 font-semibold text-lg text-yellow-800">
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link to="/" className=" text-blue-700 text-xl underline">
              Home
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="border-gray-200 border rounded-lg mb-7 shadow-md bg-white"
            >
              <div className="mb-2 flex justify-between text-[0.8rem] px-2 sm:px-4 py-2 rounded-t-lg text-black bg-gray-200">
                <div className="space-y-1">
                  <p className="font-semibold text-md">🕓 Placed on:</p>
                  <p className="text-[.65rem]">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-md font-semibold">
                    Order:{" "}
                    <span className="font-normal text-[.65rem]">
                      #{order._id}
                    </span>
                  </p>
                  <Link
                    to={`/order-details/${order._id}`}
                    className="text-blue-800 font-semibold flex justify-end text-xs"
                  >
                    View order details
                  </Link>
                </div>
              </div>
              <div className="flex justify-between text-xs p-4 rounded-t-lg">
                <div>
                  <div className="mb-2">
                    <strong>👤 Name:</strong> {order.customer?.name || "N/A"}
                  </div>
                  <div className="mb-2">
                    <strong>📞 Phone:</strong> {order.customer?.phone || "N/A"}
                  </div>
                  <div className="mb-2">
                    <strong>🏠 Address:</strong>{" "}
                    {order.customer?.address || "N/A"}
                  </div>
                </div>
                <div className="text-[1rem] flex flex-col items-center">
                  <strong>Total:</strong> ₹
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
