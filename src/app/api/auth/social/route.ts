import { NextRequest, NextResponse } from "next/server";
import { generateAuthCookieHeaders } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { provider, providerAccountId, name, email, phone } = body;

    if (!provider || !["google", "facebook"].includes(provider)) {
      return NextResponse.json(
        { error: "Valid OAuth provider ('google' | 'facebook') is required" },
        { status: 400 }
      );
    }

    // Account Linking Resolution Logic:
    // 1. Check if user already exists with matching email or phone
    // 2. If matching user found, link this Social Account to existing User ID
    // 3. If no match found, create new User record and attach Account

    const mockUserId = `usr_social_${Date.now()}`;
    const user = {
      id: mockUserId,
      name: name || (provider === "google" ? "Google Client" : "Facebook Client"),
      email: email || `${provider}_user@aispa.bd`,
      phone: phone || null,
      role: "CLIENT",
      provider,
      isAccountLinked: true,
    };

    // Issue Stateless HTTP-Only Cookies
    const { accessCookie, refreshCookie } = generateAuthCookieHeaders(
      user.id,
      user.phone || undefined,
      user.role
    );

    const response = NextResponse.json({
      success: true,
      message: `Successfully authenticated via ${provider}`,
      user,
    });

    response.headers.append("Set-Cookie", accessCookie);
    response.headers.append("Set-Cookie", refreshCookie);

    return response;

  } catch (error) {
    console.error("Error processing social authentication:", error);
    return NextResponse.json(
      { error: "Internal server error during social authentication" },
      { status: 500 }
    );
  }
}
