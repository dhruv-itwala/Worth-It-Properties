import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./AdminLogin.module.css";

const schema = z.object({
  email: z.string().email("Invalid admin email"),
  password: z.string().min(4, "Password required"),
});

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    const admin = await loginAdmin(data);
    if (!admin) return;
    navigate("/admin/dashboard");
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h2 className={styles.title}>Admin Panel Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* EMAIL */}
          <input
            type="email"
            placeholder="Admin Email"
            className={styles.input}
            {...register("email")}
          />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}

          {/* PASSWORD WITH EYE ICON */}
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
            {isSubmitting ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
