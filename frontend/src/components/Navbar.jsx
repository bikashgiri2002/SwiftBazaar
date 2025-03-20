import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem("adminToken"));
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(!!localStorage.getItem("userToken"));
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAdminAuthenticated(!!localStorage.getItem("adminToken"));
      setIsUserAuthenticated(!!localStorage.getItem("userToken"));
      setUserName(localStorage.getItem("userName") || "");
    };

    // Listen for custom auth change event
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userName");

    setIsAdminAuthenticated(false);
    setIsUserAuthenticated(false);
    setUserName("");

    // Dispatch auth change event to notify other components
    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-lg">MyApp</Link>
      <div className="flex items-center">
        {isUserAuthenticated ? (
          <>
            <span className="mx-2">Welcome, {userName || "User"} 👋</span>
            <Link to="/dashboard" className="mx-2">Dashboard</Link>
            <Link to="/orders" className="mx-2">Orders</Link>
            <Link to="/cart" className="mx-2">Cart</Link>
            <Link to="/add-address" className="mx-2">Add Address</Link>
            <button onClick={handleLogout} className="mx-2">Logout</button>
          </>
        ) : isAdminAuthenticated ? (
          <>
            <Link to="/admin/dashboard" className="mx-2">Admin Dashboard</Link>
            <Link to="/admin/manage-categories" className="mx-2">Categories</Link>
            <Link to="/admin/manage-products" className="mx-2">Products</Link>
            <button onClick={handleLogout} className="mx-2">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="mx-2">User</Link>
            <Link to="/admin/login" className="mx-2">Admin</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
