import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";

const schema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "Min 8 characters")
    .max(16, "Max 16 characters")
    .regex(/[A-Z]/, "Must contain one uppercase letter")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Must contain one special character"),
});

const UpdatePassword = () => {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");
      await api.put("/user/password", data);
      setSuccess("Password updated successfully");
      reset();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)]  flex items-center justify-center px-4">
      <div className="w-full max-w-sm border-2 p-10 rounded-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mx-auto mb-4">
            <span className="text-background text-sm font-medium">R</span>
          </div>
          <h1 className="text-xl font-medium tracking-tight mb-1">
            Update Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Change your account password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {/* Current password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium">Current Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("oldPassword")}
              className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
            />
            {errors.oldPassword && (
              <p className="text-[12px] text-destructive">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium">New Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("newPassword")}
              className="h-9 rounded-lg text-sm hover:border-foreground/30 focus-visible:ring-1 focus-visible:ring-foreground/30 transition-colors"
            />
            {errors.newPassword ? (
              <p className="text-[12px] text-destructive">
                {errors.newPassword.message}
              </p>
            ) : (
              <p className="text-[12px] text-muted-foreground">
                8–16 chars, one uppercase, one special character
              </p>
            )}
          </div>

          {/* Server messages */}
          {error && <p className="text-[12px] text-destructive">{error}</p>}
          {success && <p className="text-[12px] text-green-600">{success}</p>}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 h-9 w-full rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-85 hover:bg-foreground transition-opacity disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
