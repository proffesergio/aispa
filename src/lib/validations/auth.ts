import { z } from "zod";
import { Language, translations } from "@/lib/i18n/dict";

/**
 * Creates Zod schema for Bangladeshi Phone Number validation (+88013 - +88019)
 */
export function getPhoneFormSchema(lang: Language) {
  const t = translations[lang];

  return z.object({
    phone: z
      .string()
      .min(1, { message: t.invalidPhoneErr })
      .refine(
        (val) => {
          const cleanNum = val.replace(/\D/g, "");
          return /^1[3-9]\d{8}$/.test(cleanNum);
        },
        { message: t.invalidPhoneErr }
      ),
  });
}

export type PhoneFormValues = z.infer<ReturnType<typeof getPhoneFormSchema>>;

/**
 * Creates Zod schema for 6-Digit OTP verification
 */
export function getOtpFormSchema(lang: Language) {
  const t = translations[lang];

  return z.object({
    otp: z
      .string()
      .length(6, { message: t.invalidOtpErr })
      .regex(/^\d{6}$/, { message: t.invalidOtpErr }),
  });
}

export type OtpFormValues = z.infer<ReturnType<typeof getOtpFormSchema>>;

/**
 * Creates Zod schema for User Profile Registration
 */
export function getRegisterFormSchema(lang: Language) {
  const t = translations[lang];

  return z.object({
    name: z
      .string()
      .min(2, { message: lang === "bn" ? "কমপক্ষে ২ অক্ষরের নাম লিখুন" : "Name must be at least 2 characters" }),
    phone: z
      .string()
      .refine(
        (val) => /^1[3-9]\d{8}$/.test(val.replace(/\D/g, "")),
        { message: t.invalidPhoneErr }
      ),
    email: z
      .string()
      .email({ message: lang === "bn" ? "সঠিক ইমেইল ঠিকানা লিখুন" : "Please enter a valid email address" })
      .optional()
      .or(z.literal("")),
    preferredLang: z.enum(["en", "bn"]).default("en"),
  });
}

export type RegisterFormValues = z.infer<ReturnType<typeof getRegisterFormSchema>>;
