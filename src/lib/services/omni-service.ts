import { supabaseAdmin } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type OmniMessageRow = Database["public"]["Tables"]["omni_messages"]["Row"];

export interface CreateOmniMessageInput {
  senderId: string;
  customerName: string;
  channel: "WEBSITE" | "WHATSAPP" | "MESSENGER";
  text: string;
  isFromAdmin?: boolean;
  userId?: string | null;
}

/**
 * Controller / Service Layer for Omni-Channel WhatsApp & Facebook Messenger Communication (Supabase Native)
 */
export class OmniService {
  /**
   * Fetches all omni messages for the admin inbox hub
   */
  static async getAllMessages(): Promise<OmniMessageRow[]> {
    const { data, error } = await supabaseAdmin
      .from("omni_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[OmniService.getAllMessages] Error:", error);
      return [];
    }

    return data || [];
  }

  /**
   * Persists an incoming webhook message from WhatsApp or Messenger
   */
  static async recordMessage(input: CreateOmniMessageInput): Promise<OmniMessageRow> {
    const { data, error } = await supabaseAdmin
      .from("omni_messages")
      .insert({
        sender_id: input.senderId,
        customer_name: input.customerName,
        channel: input.channel,
        text: input.text,
        is_from_admin: input.isFromAdmin || false,
        is_read: false,
        user_id: input.userId || null,
      })
      .select()
      .single();

    if (error || !data) {
      console.error("[OmniService.recordMessage] Error:", error);
      throw new Error(`Failed to record omni message: ${error?.message}`);
    }

    return data;
  }

  /**
   * Marks a conversation/message as read
   */
  static async markAsRead(id: string): Promise<void> {
    await supabaseAdmin
      .from("omni_messages")
      .update({ is_read: true })
      .eq("id", id);
  }
}
