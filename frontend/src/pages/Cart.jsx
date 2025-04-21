import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/cart/items",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCart(response.data);
      } catch (error) {
        console.error(
          "Error fetching cart items:",
          error.response?.data || error
        );
      }
    };

    fetchCartItems();
  }, [navigate]);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem("userToken");
    if (!cart?._id || !productId) return;

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/cart/remove/${cart._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { productId },
        }
      );

      setCart(response.data.cart);
    } catch (error) {
      console.error(
        "Error removing item from cart:",
        error.response?.data || error
      );
    }
  };

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("userToken");
    if (!cart) return;

    try {
      await axios.post(
        "http://localhost:5000/api/users/order/place",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("🎉 Order placed successfully!");
      setCart(null);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Error placing order. Please try again."
      );
      // Optionally, you can log the error for debugging
      console.error("Error placing order:", error.response?.data || error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        🛒 Your Cart
      </h2>

      {cart && cart.products.length > 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          {cart.products.map((item, index) => (
            <div
              key={item.product?._id || `cart-item-${index}`}
              className="flex items-center justify-between p-4 border-b"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.product?.name || "Unknown Product"}
                </h3>
                <p className="text-gray-600">
                  Price:{" "}
                  <span className="text-gray-900 font-medium">
                    ${item.product?.price || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </p>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleRemove(item.product?._id)}
                disabled={!item.product?._id}
              >
                ❌ Remove
              </button>
            </div>
          ))}

          {/* Total Amount Section */}
          <div className="mt-6 flex justify-between items-center text-xl font-bold text-gray-800">
            <span>Total:</span>
            <span>
              $
              {cart.products.reduce(
                (total, item) =>
                  total + (item.product?.price || 0) * item.quantity,
                0
              )}
            </span>
          </div>

          {/* Place Order Button */}
          <button
            className="mt-6 w-full bg-blue-500 text-white py-3 rounded text-lg font-semibold hover:bg-blue-600 transition"
            onClick={handlePlaceOrder}
          >
            ✅ Place Order
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-600">Your cart is empty. 🛒</p>
      )}
    </div>
  );
}

export default Cart;
