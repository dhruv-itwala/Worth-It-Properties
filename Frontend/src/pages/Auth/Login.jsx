// src/pages/Auth/Login.jsx
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { notifyError } from "../../utils/toast";
import styles from "./Auth.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  // Google callback
  const handleGoogleResponse = useCallback(
    async (response) => {
      try {
        const user = await loginWithGoogle(response.credential);

        if (!user) return;

        if (!user.profileCompleted) {
          return navigate("/complete-profile");
        }

        navigate("/");
      } catch {
        notifyError("Google Sign-in failed. Try again.");
      }
    },
    [loginWithGoogle, navigate]
  );

  useEffect(() => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("googleLoginBtn"),
      {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 280,
      }
    );
  }, [handleGoogleResponse]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.card}>
        <h2>Welcome to WorthIt</h2>
        <p className={styles.subtitle}>Login with Google to continue</p>

        <div id="googleLoginBtn"></div>
      </div>
    </div>
  );
};

export default Login;
