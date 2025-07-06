import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  try {
    const decoded = jwtDecode(token);
    if (!decoded.isAdmin) {
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
