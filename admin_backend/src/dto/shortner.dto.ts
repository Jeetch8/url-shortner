import { z } from "zod";

export const CreateShortendLinkSchema = z.object({
  original_url: z.string().url({ message: "Provided URL is invalid" }),
  link_cloaking: z.boolean().default(false),
  passwordProtected: z.object({
    enabled: z.boolean().default(false),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/, {
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
      })
      .nullable(),
  }),
});
