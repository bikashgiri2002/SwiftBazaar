import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error fetching orders. Please try again later.";
        console.error("Error fetching orders:", error.response?.data || error);
        alert(errorMessage); // Display error message in alert
      }
    };

    fetchOrders();
  }, [navigate]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">📦 Your Orders</h2>
      {orders.length > 0 ? (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white p-6 rounded-lg shadow-lg mb-6 border-l-4 border-blue-500"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">Order ID: {order._id}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "Delivered"
                    ? "bg-green-500 text-white"
                    : order.status === "Pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Order Details */}
            <p className="text-gray-600 mt-2">
              Total Amount: <span className="font-bold text-gray-900">${order.totalAmount}</span>
            </p>

            {/* Products List */}
            <h4 className="mt-4 text-md font-semibold text-gray-800">🛍️ Products:</h4>
            <ul className="mt-2 space-y-1">
              {order.products.map((item) => (
                <li key={item.product?._id || item.product} className="ml-4 text-gray-700">
                  - {item.product?.name || "Product not found"}{" "}
                  <span className="text-gray-500">x {item.quantity}</span>
                </li>
              ))}
            </ul>

            {/* Shipping Address */}
            <h4 className="mt-4 text-md font-semibold text-gray-800">📍 Shipping Address:</h4>
            {order.address && typeof order.address === "object" ? (
              <p className="text-gray-700 mt-1">
                {order.address.street}, {order.address.city}, {order.address.state},{" "}
                {order.address.zipCode}, {order.address.country}
              </p>
            ) : (
              <p className="text-gray-500">Address not available</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">You have no orders.</p>
      )}
    </div>
  );
}

export default Orders;