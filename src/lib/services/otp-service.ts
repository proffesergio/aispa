import { supabaseAdmin } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type OTPAttemptRow = Database["public"]["Tables"]["otp_attempts"]["Row"];

/**
 * Controller / Service Layer for OTP Attempts & Rate Limiting (Supabase Native)
 */
export class OTPService {
  /**
   * Records a generated OTP attempt in Supabase
   */
  static async recordAttempt(
    phone: string,
    otpHash: string,
    expiresAt: Date,
    ipAddress?: string
  ): Promise<OTPAttemptRow> {
    // Invalidate previous unverified OTPs for this phone
    await supabaseAdmin
      .from("otp_attempts")
      .delete()
      .eq("phone", phone)
      .eq("is_verified", false);

    const { data, error } = await supabaseAdmin
      .from("otp_attempts")
      .insert({
        phone,
        otp_hash: otpHash,
        expires_at: expiresAt.toISOString(),
        attempts_count: 0,
        is_verified: false,
        ip_address: ipAddress || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[OTPService.recordAttempt] Error:", error);
      throw new Error(`Failed to record OTP attempt: ${error?.message}`);
    }

    return data;
  }

  /**
   * Retrieves active unverified OTP attempt for a phone
   */
  static async getActiveAttempt(phone: string): Promise<OTPAttemptRow | null> {
    const { data, error } = await supabaseAdmin
      .from("otp_attempts")
      .select("*")
      .eq("phone", phone)
      .eq("is_verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("[OTPService.getActiveAttempt] Error:", error);
      return null;
    }

    return data;
  }

  /**
   * Increments failed attempt count
   */
  static async incrementAttempts(id: string, currentCount: number): Promise<void> {
    await supabaseAdmin
      .from("otp_attempts")
      .update({ attempts_count: currentCount + 1 })
      .eq("id", id);
  }

  /**
   * Marks OTP attempt as verified and clears pending attempts
   */
  static async markVerified(id: string): Promise<void> {
    await supabaseAdmin
      .from("otp_attempts")
      .update({ is_verified: true })
      .eq("id", id);
  }

  /**
   * Deletes OTP attempt record after successful login
   */
  static async clearAttempts(phone: string): Promise<void> {
    await supabaseAdmin
      .from("otp_attempts")
      .delete()
      .eq("phone", phone);
  }
}
