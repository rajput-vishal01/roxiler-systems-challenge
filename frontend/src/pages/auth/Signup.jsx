import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/authStore";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must be at most 16 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Must contain at least one special character",
    ),
  address: z.string().max(400, "Address must be at most 400 characters"),
});

const inputClass =
  "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors";

const Signup = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      const res = await api.post("/signup", data);
      const { user, accessToken } = res.data;
      setAuth(user, accessToken);
      navigate("/user/stores");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm border-2 rounded-2xl p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mx-auto mb-4">
            <span className="text-background text-sm font-medium">R</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight mb-1">
            Create account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up to start rating stores
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-[13px] font-medium">
              Full Name
            </label>
            <input
              id="name"
              placeholder="John Doe Normal Platform User"
              {...register("name")}
              className={inputClass}
            />
            {errors.name ? (
              <p className="text-[12px] text-destructive">
                {errors.name.message}
              </p>
            ) : (
              <p className="text-[12px] text-muted-foreground">
                Min 2, max 60 characters
              </p>
            )}
          </div>

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
              className={inputClass}
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
              className={inputClass}
            />
            {errors.password ? (
              <p className="text-[12px] text-destructive">
                {errors.password.message}
              </p>
            ) : (
              <p className="text-[12px] text-muted-foreground">
                8–16 chars, one uppercase, one special character
              </p>
            )}
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-[13px] font-medium">
              Address
            </label>
            <textarea
              id="address"
              rows={3}
              placeholder="123 Main Street, City, State"
              {...register("address")}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30 hover:border-foreground/30 transition-colors resize-none"
            />
            {errors.address && (
              <p className="text-[12px] text-destructive">
                {errors.address.message}
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
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>

          {/* Footer link */}
          <p className="text-[13px] text-center text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-foreground underline underline-offset-4 hover:opacity-70 transition-opacity cursor-pointer"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
