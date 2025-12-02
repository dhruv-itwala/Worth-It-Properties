import { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(4, "Password is required"),
});

export default function UserLogin() {
  const { user, loginUser, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

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
        width: 260,
        shape: "pill",
      }
    );
  }, [handleGoogleResponse]);

  return (
    <div className="auth-page">
      <h2>User Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ margin: "15px 0", fontWeight: 500 }}>OR</div>

      <div id="googleBtn"></div>
    </div>
  );
}
