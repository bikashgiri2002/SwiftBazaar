import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddAddress() {
  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/address/add", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Address added successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error adding address", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Address</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="street" placeholder="Street" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="city" placeholder="City" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="state" placeholder="State" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="zipCode" placeholder="Zip Code" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
        <input type="text" name="country" placeholder="Country" onChange={handleChange} className="w-full p-2 border rounded mb-2" />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Add Address</button>
      </form>
    </div>
  );
}

export default AddAddress;
