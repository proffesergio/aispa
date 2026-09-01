import { NextRequest, NextResponse } from "next/server";
import { adminRegisterSchema } from "@/lib/validations/admin-auth";
import { generateAuthCookieHeaders } from "@/lib/auth/jwt";
import crypto from "crypto";

const EXPECTED_ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "AISPA-ADMIN-SECRET-2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validationResult = adminRegisterSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, phone, password, adminKey, role } = validationResult.data;

    // 2. Secret Passkey Authorization Check
    if (adminKey !== EXPECTED_ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Forbidden: Invalid Admin Secret Authorization Key. Please contact system administrator." },
        { status: 403 }
      );
    }

    const formattedPhone = `+880${phone.replace(/\D/g, "")}`;
    const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
    const adminId = `admin_${Date.now()}`;

    // 3. Generate Signed Admin JWT Tokens and Cookie Headers
    const { accessCookie, refreshCookie } = generateAuthCookieHeaders(adminId, formattedPhone, role);

    const adminUser = {
      id: adminId,
      phone: formattedPhone,
      email,
      name,
      role,
    };

    // 4. Create Response with HttpOnly Session Cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Admin account registered successfully",
        user: adminUser,
      },
      { status: 201 }
    );

    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;
  } catch (error: any) {
    console.error("Admin registration error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error during admin registration" },
      { status: 500 }
    );
  }
}
