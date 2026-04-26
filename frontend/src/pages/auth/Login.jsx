import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      const res = await api.post("/login", data);
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);

      if (user.role === "ADMIN") navigate("/admin/dashboard");
      else if (user.role === "USER") navigate("/user/stores");
      else if (user.role === "STORE_OWNER") navigate("/store-owner/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm border-2 rounded-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mx-auto mb-4">
            <span className="text-background text-sm font-medium">R</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Login to your Roxiler account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[13px] font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...register("email")}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors"
            />
            {errors.email && (
              <p className="text-[12px] text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[13px] font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors"
            />
            {errors.password && (
              <p className="text-[12px] text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Server error */}
          {error && (
            <p className="text-[12px] text-destructive text-center">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-9 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Footer link */}
          <p className="text-[13px] text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
