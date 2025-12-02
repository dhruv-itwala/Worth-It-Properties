import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {user?.name || "User"}</h1>
      <p>{user?.email}</p>

      <div style={{ marginTop: 20 }}>
        <button onClick={handleLogout} style={{ padding: "8px 16px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}
