import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("adminToken");
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;
