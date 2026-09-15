import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Full name must be at least 2 characters long." }),
  email: z
    .string()
    .email({ message: "Please enter a valid business email address." }),
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .refine((val) => /^1[3-9]\d{8}$/.test(val.replace(/\D/g, "")), {
      message: "Please enter a valid BD mobile number (+88013-019XXXXXXXX).",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  adminKey: z
    .string()
    .min(1, { message: "Admin Secret Passkey is required to register as salon owner." })
    .optional(),
  adminSecretKey: z.string().optional(),
  role: z.enum(["ADMIN", "MANAGER"]).default("ADMIN"),
});

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter your registered admin email." }),
  password: z
    .string()
    .min(1, { message: "Password is required." }),
});

export type AdminRegisterFormValues = z.infer<typeof adminRegisterSchema>;
export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
