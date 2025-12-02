import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid admin email"),
  password: z.string().min(4, "Password required"),
});

export default function AdminLogin() {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

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
    <div className="auth-page">
      <h2>Admin Panel Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <input type="email" placeholder="Admin Email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button disabled={isSubmitting}>
          {isSubmitting ? "Checking..." : "Login"}
        </button>
      </form>
    </div>
  );
}
