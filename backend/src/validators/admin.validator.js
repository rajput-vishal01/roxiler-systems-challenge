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

export const addUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  address: z.string().max(400, "Address must be at most 400 characters"),
  role: z.enum(["ADMIN", "USER", "STORE_OWNER"], {
    errorMap: () => ({ message: "Role must be ADMIN, USER or STORE_OWNER" }),
  }),
});

export const addStoreSchema = z.object({
  name: z
    .string()
    .min(20, "Name must be at least 2 characters")
    .max(60, "Name must be at most 60 characters"),
  email: z.string().email("Invalid email address"),
  address: z.string().max(400, "Address must be at most 400 characters"),
  ownerId: z.number({ required_error: "Owner ID is required" }),
});
