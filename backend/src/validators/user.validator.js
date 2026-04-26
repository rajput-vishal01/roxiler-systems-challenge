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

export const updatePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: passwordSchema,
});

export const ratingSchema = z.object({
  storeId: z.number({ required_error: "Store ID is required" }),
  value: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
});
