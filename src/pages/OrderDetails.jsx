import { useContext, useEffect, useState } from "react";
import api from "../api";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Copy, Check } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams(); // Get order ID from route
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(order._id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to view your order");
      navigate(`/auth?redirect=/order-details/${id}`);
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("✅ Order fetched:", res.data); // 🔍 DEBUG here
        setOrder(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch order:", error);
        alert("Error loading order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Loading order details...</div>;
  if (!order) return <div className="p-6">Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-lg">
      <Link
        className=" bg-gray-100 border  text-2xl rounded-lg font-bold border-gray-200 shadow-sm hover:bg-gray-200 cursor-pointer px-2 pb-2 pt-1"
        to="/my-orders"
      >
        {"←"}
      </Link>
      <h2 className="text-2xl font-bold mt-5 mb-3">Order Summary</h2>

      {/* Order Meta */}
      <div className="mb-4 text-sm ">
        <p className="font-semibold text-blue-800 font-mono">
          {order.items.length} items in the Order
        </p>
      </div>

      {/* Items Ordered */}
      <div className="mt-4">
        {Array.isArray(order.items) && order.items.length > 0 ? (
          <ul className=" text-sm ">
            {order.items.map((item, idx) => {
              const price = item.price || 0;
              const variant =
                order.variants?.find((v) => v.unit === item.selectedUnit) || {};
              const unit = variant.unit || item.selectedUnit || "";
              const quantity = item.quantity || 1;
              const image = item.image;

              return (
                <li key={idx}>
                  <div className="flex justify-between py-[.6rem] sm:p-[.6rem]">
                    <div className="flex gap-4 ">
                      <div className="w-15 border rounded-md border-gray-300 shadow-lg">
                        <img
                          className="w-[80%] py-[.4rem] mx-auto"
                          src={image}
                          alt=""
                        />
                      </div>

                      <div className="mt-1">
                        <h1 className="font-bold text-md">{item.name}</h1>
                        <p className="text-gray-400 font-semibold mt-1">
                          {" "}
                          ({unit}) × {quantity}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 mt-[.35rem]">
                      {item.discount && item.discount !== "0%" && (
                        <span className="text-xs font-sans font-semibold text-green-600">
                          [{item.discount} OFF]
                        </span>
                      )}
                      <p className="text-md font-bold">
                        {" "}
                        ₹{(price * quantity).toFixed(2)}{" "}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No items in this order.</p>
        )}
      </div>
      <div className="mt-4 sm:m-4 border-5 rounded-lg border-gray-100"></div>
      <div className="mt-4 sm:m-4 text-gray-800 text-sm">
        <h1 className="text-lg font-bold mb-5">Bill Details</h1>
        <div className="space-y-1">
          <div className="flex justify-between ">
            <p>MRP</p>
            <p> ₹{order.totalAmount?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="flex justify-between">
            <p>Delievery Charge</p>
            <p className="text-green-700 font-serif"> FREE</p>
          </div>
          <div className="flex justify-between">
            <p className="font-bold">Total </p>
            <p className="font-bold">
              {" "}
              ₹{order.totalAmount?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:m-4 border-5 rounded-lg border-gray-100"></div>
      <div className="mt-4 sm:m-4  text-gray-600 text-xs">
        <h1 className="text-lg font-bold mb-5">Order Detail</h1>
        <div className="space-y-3">
          <div>
            <p>Order id</p>
            <p className="font-semibold text-black">
              {order._id}{" "}
              <button className="ml-1" onClick={handleCopy}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </p>
          </div>
          <div>
            <p>Payment Status</p>
            <p className="font-semibold text-blue-400">Pending</p>
          </div>
          <div>
            <p>Deliever to</p>
            <p className="font-semibold text-black">
              {order.customer?.address || "N/A"}
            </p>
          </div>
          <div>
            <p>Order placed</p>
            <p className="font-semibold text-black">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
