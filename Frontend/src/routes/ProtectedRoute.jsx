import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role = null,
  profileRequired = true,
}) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Not logged in? → go to login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Profile incomplete? → force profile setup
  if (profileRequired && !user?.profileCompleted)
    return <Navigate to="/complete-profile" />;

  // Role check
  if (role && !role.includes(user.role)) return <Navigate to="/" />;

  return children;
}
