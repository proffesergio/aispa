import { NextRequest, NextResponse } from "next/server";
import { adminRegisterSchema } from "@/lib/validations/admin-auth";
import { generateAuthCookieHeaders } from "@/lib/auth/jwt";
import { UserService } from "@/lib/services/user-service";
import crypto from "crypto";

/**
 * Timing-safe string comparison to prevent side-channel timing attacks
 */
function timingSafeCheck(providedKey: string, actualKey: string): boolean {
  if (!providedKey || !actualKey) return false;
  const providedBuffer = Buffer.from(providedKey, "utf-8");
  const actualBuffer = Buffer.from(actualKey, "utf-8");

  if (providedBuffer.length !== actualBuffer.length) {
    // Perform dummy timing-safe comparison to equalize execution time
    crypto.timingSafeEqual(providedBuffer, providedBuffer);
    return false;
  }

  return crypto.timingSafeEqual(providedBuffer, actualBuffer);
}

/**
 * Dedicated Admin Registration Route (/api/admin/register)
 * Protected by high-entropy ADMIN_SECRET_SIGNUP_KEY with timing-safe comparison
 * and ambiguous error responses for failed attempts.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json().catch(() => null);

    if (!rawBody || typeof rawBody !== "object") {
      // Ambiguous error response to prevent parameter discovery
      return NextResponse.json(
        { error: "ERR_INVALID_REQUEST", message: "The server could not process the request." },
        { status: 400 }
      );
    }

    // 1. Zod Validation
    const validationResult = adminRegisterSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "ERR_VALIDATION_FAILED",
          message: "Request failed validation criteria.",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, password, adminKey, adminSecretKey, role } = validationResult.data;
    const suppliedSecret = adminSecretKey || adminKey || "";

    // 2. Secret Passkey Authorization Check
    const expectedSecret =
      process.env.ADMIN_SECRET_SIGNUP_KEY ||
      process.env.ADMIN_SECRET_KEY ||
      "";

    // If server environment is unconfigured or secret key is invalid:
    if (!expectedSecret || !timingSafeCheck(suppliedSecret, expectedSecret)) {
      // Ambiguous error response to prevent system reconnaissance / brute-force scanning
      return NextResponse.json(
        {
          error: "ERR_UNAUTHORIZED_ACTION",
          message: "The requested operation cannot be fulfilled with the provided payload.",
        },
        { status: 401 }
      );
    }

    // 3. Format Phone and Hash Password
    const formattedPhone = `+880${phone.replace(/\D/g, "")}`;
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");

    // 4. Create Admin Record in Supabase
    let adminUser;
    try {
      adminUser = await UserService.createAdminUser({
        name,
        email,
        phone: formattedPhone,
        passwordHash,
        role: role || "ADMIN",
      });
    } catch (dbErr: any) {
      if (dbErr.message?.includes("already exists")) {
        return NextResponse.json(
          { error: "ERR_CONFLICT", message: dbErr.message },
          { status: 409 }
        );
      }
      throw dbErr;
    }

    // 5. Generate Signed Admin JWT Tokens and Secure Cookie Headers
    const { accessCookie, refreshCookie } = generateAuthCookieHeaders(
      adminUser.id,
      adminUser.phone || undefined,
      adminUser.role
    );

    const sanitizedUser = {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      phone: adminUser.phone,
      role: adminUser.role,
      createdAt: adminUser.created_at,
    };

    // 6. Return Success Response with HttpOnly Session Cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Admin account registered and verified successfully.",
        user: sanitizedUser,
      },
      { status: 201 }
    );

    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;
  } catch (error: any) {
    console.error("[Admin Register] Unexpected error:", error);
    return NextResponse.json(
      { error: "ERR_INTERNAL_FAILURE", message: "An unexpected processing error occurred." },
      { status: 500 }
    );
  }
}
