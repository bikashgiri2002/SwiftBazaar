import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import Orders from "./pages/Orders"; // ✅ Import Orders page
import Navbar from "./components/Navbar";
import Logout from "./components/Logout";
import Home from "./pages/Home";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import ManageCategories from "./admin/ManageCategories";
import ManageProducts from "./admin/ManageProducts";

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem("adminToken"));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!localStorage.getItem("userToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdminAuthenticated(!!localStorage.getItem("adminToken"));
      setIsUserAuthenticated(!!localStorage.getItem("userToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleStorageChange);
    };
  }, []);

  // ✅ Ensure state updates when localStorage changes
  useEffect(() => {
    setIsAdminAuthenticated(!!localStorage.getItem("adminToken"));
  }, [localStorage.getItem("adminToken")]); 

  return (
    <Router>
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={isUserAuthenticated ? <Navigate to="/dashboard" /> : <Home />} />

          {/* User Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={isUserAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/cart" element={isUserAuthenticated ? <Cart /> : <Navigate to="/login" />} />
          <Route path="/add-address" element={isUserAuthenticated ? <AddAddress /> : <Navigate to="/login" />} />
          <Route path="/orders" element={isUserAuthenticated ? <Orders /> : <Navigate to="/login" />} /> 

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />} />
          <Route path="/admin/dashboard" element={isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/manage-categories" element={isAdminAuthenticated ? <ManageCategories /> : <Navigate to="/admin/login" />} />
          <Route path="/admin/manage-products" element={isAdminAuthenticated ? <ManageProducts /> : <Navigate to="/admin/login" />} />

          {/* Logout */}
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
