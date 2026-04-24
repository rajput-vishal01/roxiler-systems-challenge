import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character",
  );

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),

  email: z.string().email("Invalid email address"),

  password: passwordSchema,

  address: z.string().max(400, "Address must be at most 400 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),

  password: z.string().min(1, "Password is required"), // no strict rules on login, just required
});

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),

  newPassword: passwordSchema,
});
