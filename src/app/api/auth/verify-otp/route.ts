import { NextRequest, NextResponse } from "next/server";
import { normalizeBDPhone, verifyOTPHash } from "@/lib/auth/otp";
import { generateAuthCookieHeaders } from "@/lib/auth/jwt";
import { otpAttemptStore } from "../send-otp/route";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone: rawPhone, otp } = body;

    if (!rawPhone || !otp) {
      return NextResponse.json(
        { error: "Phone number and 6-digit OTP are required" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeBDPhone(rawPhone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: "Invalid Bangladeshi phone number" },
        { status: 400 }
      );
    }

    // 1. Retrieve OTP Attempt Record
    const attemptRecord = otpAttemptStore.get(normalizedPhone);

    if (!attemptRecord) {
      return NextResponse.json(
        { error: "No active OTP request found for this phone number. Please request a new code." },
        { status: 404 }
      );
    }

    // 2. Check Expiration (3-minute window)
    if (new Date() > attemptRecord.expiresAt) {
      otpAttemptStore.delete(normalizedPhone);
      return NextResponse.json(
        { error: "OTP code has expired. Please request a new code." },
        { status: 410 }
      );
    }

    // 3. Check Attempt Threshold (Max 3 wrong tries)
    if (attemptRecord.attempts >= 3) {
      otpAttemptStore.delete(normalizedPhone);
      return NextResponse.json(
        { error: "Too many failed attempts. OTP has been invalidated for security." },
        { status: 429 }
      );
    }

    // 4. Timing-safe OTP Hash Verification
    const isValid = verifyOTPHash(otp, attemptRecord.hash);
    if (!isValid) {
      attemptRecord.attempts += 1;
      return NextResponse.json(
        { error: `Invalid verification code. ${3 - attemptRecord.attempts} attempts remaining.` },
        { status: 401 }
      );
    }

    // OTP Successfully Verified -> Delete record to prevent reuse
    otpAttemptStore.delete(normalizedPhone);

    // Mock User ID generation (In DB: prisma.user.upsert)
    const userId = `usr_bd_${Date.now()}`;

    // 5. Issue Stateless HTTP-Only JWT Cookies
    const { accessToken, accessCookie, refreshCookie } = generateAuthCookieHeaders(
      userId,
      normalizedPhone,
      "CLIENT"
    );

    const response = NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
      user: {
        id: userId,
        phone: normalizedPhone,
        role: "CLIENT",
        phoneVerified: true,
      },
    });

    // Set HTTP-only SameSite=Strict cookies in response header
    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;

  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error during verification" },
      { status: 500 }
    );
  }
}
