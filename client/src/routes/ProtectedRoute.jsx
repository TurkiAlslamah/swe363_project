import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  // Not logged in - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role - redirect to unauthorized
  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // All checks passed - render the protected component
  return children;
}