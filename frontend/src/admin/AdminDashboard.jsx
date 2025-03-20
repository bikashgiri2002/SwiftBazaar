// AdminDashboard.jsx
import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
      <div className="flex space-x-4">
        <Link to="/admin/manage-categories" className="px-4 py-2 bg-blue-500 text-white rounded">Manage Categories</Link>
        <Link to="/admin/manage-products" className="px-4 py-2 bg-green-500 text-white rounded">Manage Products</Link>
      </div>
    </div>
  );
}
export default AdminDashboard;