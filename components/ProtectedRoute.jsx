import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("user_role");
  
  // If no token or not admin role, redirect to login
  if (!token || userRole !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

export default ProtectedRoute;