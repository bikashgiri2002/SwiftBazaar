import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      console.log("Sending request with:", form);
      const response = await axios.post("http://localhost:5000/api/users/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Login successful:", response.data);
      localStorage.setItem("userToken", response.data.token);
      localStorage.setItem("userName", response.data.user.name);

      // ✅ Dispatch a custom event to update authentication state in App.jsx
      window.dispatchEvent(new Event("authChange"));

      navigate("/dashboard"); // Redirect after setting token
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 text-center mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
          required
        />
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
