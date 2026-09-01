import crypto from "crypto";

export interface GeneratedOTP {
  code: string;
  hash: string;
  expiresAt: Date;
}

/**
 * Normalizes any Bangladeshi phone input into canonical E.164 format (+8801XXXXXXXXX)
 */
export function normalizeBDPhone(phoneInput: string): string | null {
  const digitsOnly = phoneInput.replace(/\D/g, "");

  // Match 88013-88019 (13 digits)
  if (digitsOnly.length === 13 && digitsOnly.startsWith("8801")) {
    const subscriber = digitsOnly.slice(3);
    if (/^1[3-9]\d{8}$/.test(subscriber)) {
      return `+${digitsOnly}`;
    }
  }

  // Match 013-019 (11 digits)
  if (digitsOnly.length === 11 && digitsOnly.startsWith("01")) {
    if (/^01[3-9]\d{8}$/.test(digitsOnly)) {
      return `+880${digitsOnly.slice(1)}`;
    }
  }

  // Match 13-19 without leading 0 (10 digits)
  if (digitsOnly.length === 10 && /^1[3-9]\d{8}$/.test(digitsOnly)) {
    return `+880${digitsOnly}`;
  }

  return null;
}

/**
 * Generates a cryptographically secure 6-digit numerical OTP,
 * calculates its SHA-256 hash, and sets a 3-minute expiration timestamp.
 */
export function generateSecureOTP(): GeneratedOTP {
  // Generate cryptographically random 6-digit number (100000 - 999999)
  const codeInt = crypto.randomInt(100000, 1000000);
  const code = codeInt.toString();

  // Create SHA-256 Hash
  const hash = hashOTP(code);

  // Set strict 3-minute expiration
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  return { code, hash, expiresAt };
}

/**
 * Creates SHA-256 hash of an OTP string
 */
export function hashOTP(otpCode: string): string {
  const secretSalt = process.env.OTP_SECRET_SALT || "aispa_bd_secret_salt_2026";
  return crypto
    .createHmac("sha256", secretSalt)
    .update(otpCode)
    .digest("hex");
}

/**
 * Timing-safe comparison of user inputted OTP against stored hash
 */
export function verifyOTPHash(userInputOtp: string, storedHash: string): boolean {
  const inputHash = hashOTP(userInputOtp);
  
  const inputBuffer = Buffer.from(inputHash, "hex");
  const storedBuffer = Buffer.from(storedHash, "hex");

  if (inputBuffer.length !== storedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, storedBuffer);
}
