import { z } from "zod";

export const UpdatePasswordSchema = z.object({
  newPassword: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    }),
  oldPassword: z
    .string()
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
      message:
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
    }),
});
