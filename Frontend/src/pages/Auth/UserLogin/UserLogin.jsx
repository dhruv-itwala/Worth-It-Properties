import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./UserLogin.module.css";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password is required"),
});

export default function UserLogin() {
  const { user, loginUser, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  // redirect if already logged in
  useEffect(() => {
    if (!loading && user) navigate("/");
  }, [loading, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData) => {
    const loggedIn = await loginUser(formData);
    if (!loggedIn) return;
    if (!loggedIn.profileCompleted) return navigate("/complete-profile");
    navigate("/");
  };

  const handleGoogleResponse = useCallback(
    async (response) => {
      const userData = await loginWithGoogle(response.credential);
      if (!userData) return;
      if (!userData.profileCompleted) return navigate("/complete-profile");
      navigate("/");
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
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: 350,
        shape: "pill",
      }
    );
  }, [handleGoogleResponse]);

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>User Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL FIELD */}
          <input
            type="email"
            placeholder="Email"
            className={styles.input}
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          {/* PASSWORD FIELD WITH EYE ICON */}
          <div className={styles.inputBox}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={styles.input}
              {...register("password")}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <p className={styles.error}>{errors.password.message}</p>
          )}

          <button className={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className={styles.or}>OR</div>

        <div className={styles.googleBox}>
          <div id="googleBtn"></div>
        </div>
      </div>
    </div>
  );
}
