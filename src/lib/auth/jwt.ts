import crypto from "crypto";

export interface JWTPayload {
  userId: string;
  phone?: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "aispa_secure_jwt_secret_key_2026_bd";
const ACCESS_TOKEN_EXPIRY = 15 * 60; // 15 Minutes
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60; // 7 Days

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf-8");
}

function signHMAC(data: string, secret: string): string {
  return crypto
    .createHmac("sha256", secret)
    .update(data)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Creates a signed JWT Token
 */
export function createJWT(payload: Omit<JWTPayload, "iat" | "exp">, expiresInSeconds: number): string {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = signHMAC(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes a signed JWT Token
 */
export function verifyJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const expectedSignature = signHMAC(`${encodedHeader}.${encodedPayload}`, JWT_SECRET);

    if (signature !== expectedSignature) {
      return null; // Invalid signature
    }

    const payload: JWTPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return null; // Expired token
    }

    return payload;
  } catch (err) {
    return null;
  }
}

/**
 * Generates Auth Cookie headers for HTTP-only SameSite=Strict security
 */
export function generateAuthCookieHeaders(userId: string, phone?: string, role = "CLIENT") {
  const accessToken = createJWT({ userId, phone, role }, ACCESS_TOKEN_EXPIRY);
  const refreshToken = createJWT({ userId, phone, role }, REFRESH_TOKEN_EXPIRY);

  const isProduction = process.env.NODE_ENV === "production";
  const secureFlag = isProduction ? "Secure; " : "";

  const accessCookie = `aispa_access=${accessToken}; Path=/; HttpOnly; ${secureFlag}SameSite=Strict; Max-Age=${ACCESS_TOKEN_EXPIRY}`;
  const refreshCookie = `aispa_refresh=${refreshToken}; Path=/; HttpOnly; ${secureFlag}SameSite=Strict; Max-Age=${REFRESH_TOKEN_EXPIRY}`;

  return { accessToken, refreshToken, accessCookie, refreshCookie };
}
