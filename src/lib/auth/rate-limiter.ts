interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory sliding window store (can be seamlessly backed by Redis in production)
const ipRateLimitStore = new Map<string, RateLimitRecord>();
const phoneRateLimitStore = new Map<string, RateLimitRecord>();

/**
 * Clean expired rate limit records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipRateLimitStore.entries()) {
    if (now > record.resetAt) ipRateLimitStore.delete(key);
  }
  for (const [key, record] of phoneRateLimitStore.entries()) {
    if (now > record.resetAt) phoneRateLimitStore.delete(key);
  }
}, 60000); // Cleanup every minute

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
  retryAfterSeconds?: number;
}

/**
 * Enforces rate limiting on SMS OTP generation endpoint
 * @param phone E.164 Phone number
 * @param ip Client IP Address
 */
export function checkOTPRateLimit(phone: string, ip: string): RateLimitCheckResult {
  const now = Date.now();
  const WINDOW_MS = 10 * 60 * 1000; // 10 minutes window
  const MAX_PHONE_ATTEMPTS = 3;       // Max 3 OTP requests per phone per 10m
  const MAX_IP_ATTEMPTS = 5;          // Max 5 OTP requests per IP per 10m

  // 1. Check Phone Number Rate Limit
  const phoneRecord = phoneRateLimitStore.get(phone);
  if (phoneRecord && now < phoneRecord.resetAt) {
    if (phoneRecord.count >= MAX_PHONE_ATTEMPTS) {
      const retryAfter = Math.ceil((phoneRecord.resetAt - now) / 1000);
      return {
        allowed: false,
        reason: "Too many OTP requests for this phone number. Please wait before retrying.",
        retryAfterSeconds: retryAfter,
      };
    }
  }

  // 2. Check IP Rate Limit
  const ipRecord = ipRateLimitStore.get(ip);
  if (ipRecord && now < ipRecord.resetAt) {
    if (ipRecord.count >= MAX_IP_ATTEMPTS) {
      const retryAfter = Math.ceil((ipRecord.resetAt - now) / 1000);
      return {
        allowed: false,
        reason: "Too many requests from your network IP. Please wait before retrying.",
        retryAfterSeconds: retryAfter,
      };
    }
  }

  // Record Phone Attempt
  if (!phoneRecord || now >= phoneRecord.resetAt) {
    phoneRateLimitStore.set(phone, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    phoneRecord.count += 1;
  }

  // Record IP Attempt
  if (!ipRecord || now >= ipRecord.resetAt) {
    ipRateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    ipRecord.count += 1;
  }

  return { allowed: true };
}
