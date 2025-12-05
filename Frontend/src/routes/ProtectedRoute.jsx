// Frontend/src/routes/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  profileRequired = true,
  allowedRoles = null, // e.g. ['owner','builder']
}) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (profileRequired && !user.profileCompleted)
    return <Navigate to="/complete-profile" />;

  if (allowedRoles && Array.isArray(allowedRoles)) {
    if (!allowedRoles.includes(user.role))
      return <Navigate to="/unauthorized" />;
  }

  return children;
}
