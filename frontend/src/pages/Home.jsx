import { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/public/products");
      setProducts(response.data);
      setFilteredProducts(response.data); // Initially show all products
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/public/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (categoryId === "all") {
      setFilteredProducts(products);
      setSelectedCategory(null);
    } else {
      const filtered = products.filter((product) => product.category === categoryId);
      setFilteredProducts(filtered);
      setSelectedCategory(categoryId);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar for Categories */}
      <div className="w-1/4 p-4 bg-gray-100 min-h-screen">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul>
          <li 
            className={`cursor-pointer p-2 ${selectedCategory === null ? "font-bold text-blue-500" : ""}`} 
            onClick={() => handleCategoryClick("all")}
          >
            All Products
          </li>
          {categories.map((category) => (
            <li 
              key={category._id} 
              className={`cursor-pointer p-2 ${selectedCategory === category._id ? "font-bold text-blue-500" : ""}`} 
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Products Grid */}
      <div className="w-3/4 p-6">
        <h1 className="text-3xl font-bold mb-4">Available Products</h1>
        <div className="grid grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product._id} className="border p-4 rounded-lg shadow-md bg-white">
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
                <p className="text-green-500 font-bold mt-2">${product.price}</p>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
