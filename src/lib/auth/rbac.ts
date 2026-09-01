import { NextRequest, NextResponse } from "next/server";
import { verifyJWT, JWTPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

/**
 * RBAC Verification Helper
 * Verifies JWT token and asserts required roles (e.g. ADMIN, MANAGER)
 */
export function authorizeRoles(req: NextRequest, allowedRoles: string[]): {
  authorized: boolean;
  user?: JWTPayload;
  response?: NextResponse;
} {
  // Extract token from Cookie or Authorization Bearer header
  const token =
    req.cookies.get("aispa_access")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyJWT(token);

  if (!decoded) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      ),
    };
  }

  if (!allowedRoles.includes(decoded.role)) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: `Forbidden: Requires one of [${allowedRoles.join(", ")}] roles` },
        { status: 403 }
      ),
    };
  }

  return { authorized: true, user: decoded };
}
