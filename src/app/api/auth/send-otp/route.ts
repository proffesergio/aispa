import { NextRequest, NextResponse } from "next/server";
import { normalizeBDPhone, generateSecureOTP } from "@/lib/auth/otp";
import { checkOTPRateLimit } from "@/lib/auth/rate-limiter";

// Global Mock DB Store for OTP Attempts (Used in server runtime)
export const otpAttemptStore = new Map<
  string,
  { hash: string; expiresAt: Date; attempts: number }
>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawPhone = body.phone;

    if (!rawPhone) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    // 1. Normalize Bangladeshi Phone Number
    const normalizedPhone = normalizeBDPhone(rawPhone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Invalid Bangladeshi mobile number format (+88013-019XXXXXXXX)" },
        { status: 400 }
      );
    }

    // 2. Client IP Throttling & Rate Limit Check
    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkOTPRateLimit(normalizedPhone, clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.reason, retryAfterSeconds: rateLimit.retryAfterSeconds },
        { status: 429 }
      );
    }

    // 3. Generate Cryptographic 6-digit OTP & SHA-256 Hash
    const { code, hash, expiresAt } = generateSecureOTP();

    // 4. Store Hash with 3-minute expiration
    otpAttemptStore.set(normalizedPhone, {
      hash,
      expiresAt,
      attempts: 0,
    });

    console.log(`[SMS Gateway Dispatch] Sent OTP code: ${code} to ${normalizedPhone}`);

    // Return Success Response (Omit raw code in production response)
    return NextResponse.json({
      success: true,
      message: "Verification code sent via SMS",
      phone: normalizedPhone,
      expiresInSeconds: 180, // 3 Minutes
      // In development, return debug hint
      debugOtp: process.env.NODE_ENV !== "production" ? code : undefined,
    });

  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing OTP request" },
      { status: 500 }
    );
  }
}
