// ManageCategories.jsx
import { useState, useEffect } from "react";
import axios from "axios";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const response = await axios.get("http://localhost:5000/api/public/categories");
    setCategories(response.data);
  };

  const addCategory = async () => {
    await axios.post("http://localhost:5000/api/admin/add-category", { name }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    fetchCategories();
  };

  const removeCategory = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/remove-category/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    });
    fetchCategories();
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Manage Categories</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name" className="w-full p-2 border rounded mb-2" />
      <button onClick={addCategory} className="w-full bg-blue-500 text-white p-2 rounded">Add Category</button>
      <ul className="mt-4">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between p-2 border-b">
            {cat.name}
            <button onClick={() => removeCategory(cat._id)} className="text-red-500">Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ManageCategories;