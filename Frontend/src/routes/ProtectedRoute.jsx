import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, profileRequired = true }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  if (!user) return <Navigate to="/login" />;

  if (profileRequired && !user.profileCompleted)
    return <Navigate to="/complete-profile" />;

  return children;
}
