import { useState, useEffect } from "react";
import axios from "axios";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "", stock: "" });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/public/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/public/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle product addition
  const addProduct = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/admin/add-product",
        form,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        }
      );
      fetchProducts();
      setForm({ name: "", description: "", price: "", category: "", stock: "" }); // Reset form
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle product removal
  const removeProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/remove-product/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Products</h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      <select
        name="category"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="stock"
        placeholder="Stock Quantity"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        className="w-full p-2 border rounded mb-2"
      />

      <button onClick={addProduct} className="w-full bg-green-500 text-white p-2 rounded">
        Add Product
      </button>

      <ul className="mt-4">
        {products.map((prod) => (
          <li key={prod._id} className="flex justify-between p-2 border-b">
            {prod.name} - ${prod.price}
            <button onClick={() => removeProduct(prod._id)} className="text-red-500">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageProducts;
