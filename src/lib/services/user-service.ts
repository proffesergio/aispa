import { supabaseAdmin } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type UserRow = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export interface CreateAdminUserInput {
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  role?: string;
}

/**
 * Controller / Service Layer for User Accounts & Admin Profiles (Supabase Native)
 */
export class UserService {
  /**
   * Finds a user by ID
   */
  static async findById(id: string): Promise<UserRow | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[UserService.findById] Error:", error);
      throw new Error(`Failed to find user by ID: ${error.message}`);
    }

    return data;
  }

  /**
   * Finds a user by Bangladeshi phone number
   */
  static async findByPhone(phone: string): Promise<UserRow | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();

    if (error) {
      console.error("[UserService.findByPhone] Error:", error);
      throw new Error(`Failed to find user by phone: ${error.message}`);
    }

    return data;
  }

  /**
   * Finds a user by email
   */
  static async findByEmail(email: string): Promise<UserRow | null> {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("[UserService.findByEmail] Error:", error);
      throw new Error(`Failed to find user by email: ${error.message}`);
    }

    return data;
  }

  /**
   * Upserts a client user verified via OTP
   */
  static async upsertOTPUser(phone: string): Promise<UserRow> {
    const existing = await this.findByPhone(phone);
    if (existing) {
      const { data, error } = await supabaseAdmin
        .from("users")
        .update({
          phone_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.error("[UserService.upsertOTPUser] Update error:", error);
        throw new Error(error.message);
      }
      return data;
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        phone,
        role: "CLIENT",
        phone_verified: true,
        preferred_lang: "en",
      })
      .select()
      .single();

    if (error) {
      console.error("[UserService.upsertOTPUser] Insert error:", error);
      throw new Error(`Failed to create client user: ${error.message}`);
    }

    return data;
  }

  /**
   * Creates an Admin/Manager account securely
   */
  static async createAdminUser(input: CreateAdminUserInput): Promise<UserRow> {
    // Check if user already exists
    const existing = await this.findByEmail(input.email);
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        name: input.name,
        email: input.email,
        phone: input.phone,
        password_hash: input.passwordHash || null,
        role: input.role || "ADMIN",
        phone_verified: true,
        email_verified: new Date().toISOString(),
        preferred_lang: "en",
      })
      .select()
      .single();

    if (error) {
      console.error("[UserService.createAdminUser] Insert error:", error);
      throw new Error(`Failed to register admin profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Links or upserts a social OAuth provider account (Google/Facebook)
   */
  static async handleSocialAuth(
    provider: string,
    providerAccountId: string,
    userData: { name?: string; email?: string; phone?: string; avatar?: string }
  ): Promise<UserRow> {
    // 1. Check if account link exists
    const { data: existingAccount } = await supabaseAdmin
      .from("accounts")
      .select("*, users(*)")
      .eq("provider", provider)
      .eq("provider_account_id", providerAccountId)
      .maybeSingle();

    if (existingAccount && (existingAccount as any).users) {
      return (existingAccount as any).users as UserRow;
    }

    // 2. Check if user exists by email
    let user: UserRow | null = null;
    if (userData.email) {
      user = await this.findByEmail(userData.email);
    }

    // 3. Create user if not found
    if (!user) {
      const { data: newUser, error: userErr } = await supabaseAdmin
        .from("users")
        .insert({
          name: userData.name || `${provider} user`,
          email: userData.email || null,
          phone: userData.phone || null,
          avatar: userData.avatar || null,
          role: "CLIENT",
          preferred_lang: "en",
        })
        .select()
        .single();

      if (userErr || !newUser) {
        throw new Error(`Failed to create user during social login: ${userErr?.message}`);
      }
      user = newUser;
    }

    // 4. Attach social account
    await supabaseAdmin.from("accounts").upsert({
      user_id: user.id,
      type: "oauth",
      provider,
      provider_account_id: providerAccountId,
    });

    return user;
  }
}
