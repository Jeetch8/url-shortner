import { z } from "zod";

// RegisterDto schema
export const RegisterDtoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    }),
  email: z.string().email(),
  profile_img: z.string().url().optional(),
});

// LoginDto schema
export const LoginDtoSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    }),
});

export const RequestPasswordResetTokenSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

// Schema for changePassword
export const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
