import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Store category ID
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/public/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/public/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const handleFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/users/cart/add",
        { productId: product._id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Product added to cart");
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">🛍️ Explore Our Products</h2>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded-lg shadow-md transition-all ${
            selectedCategory === "" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"
          }`}
          onClick={() => handleFilter("")}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`px-4 py-2 rounded-lg shadow-md transition-all ${
              selectedCategory === category._id ? "bg-blue-500 text-white" : "bg-white text-gray-700 border"
            }`}
            onClick={() => handleFilter(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Category: {categories.find((c) => c._id === product.category)?.name || "Unknown"}
              </p>
              <button
                className="mt-3 w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-all"
                onClick={() => handleAddToCart(product)}
              >
                🛒 Add to Cart
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
