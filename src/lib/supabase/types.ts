export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          phone: string | null;
          email: string | null;
          name: string | null;
          avatar: string | null;
          role: string;
          preferred_lang: string;
          phone_verified: boolean;
          email_verified: string | null;
          password_hash: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          name?: string | null;
          avatar?: string | null;
          role?: string;
          preferred_lang?: string;
          phone_verified?: boolean;
          email_verified?: string | null;
          password_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          email?: string | null;
          name?: string | null;
          avatar?: string | null;
          role?: string;
          preferred_lang?: string;
          phone_verified?: boolean;
          email_verified?: string | null;
          password_hash?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      otp_attempts: {
        Row: {
          id: string;
          phone: string;
          otp_hash: string;
          expires_at: string;
          attempts_count: number;
          is_verified: boolean;
          ip_address: string | null;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          otp_hash: string;
          expires_at: string;
          attempts_count?: number;
          is_verified?: boolean;
          ip_address?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          otp_hash?: string;
          expires_at?: string;
          attempts_count?: number;
          is_verified?: boolean;
          ip_address?: string | null;
          user_id?: string | null;
          created_at?: string;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          provider: string;
          provider_account_id: string;
          refresh_token: string | null;
          access_token: string | null;
          expires_at: number | null;
          token_type: string | null;
          scope: string | null;
          id_token: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          provider: string;
          provider_account_id: string;
          refresh_token?: string | null;
          access_token?: string | null;
          expires_at?: number | null;
          token_type?: string | null;
          scope?: string | null;
          id_token?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          provider?: string;
          provider_account_id?: string;
          refresh_token?: string | null;
          access_token?: string | null;
          expires_at?: number | null;
          token_type?: string | null;
          scope?: string | null;
          id_token?: string | null;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          session_token: string;
          user_id: string;
          expires: string;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_token: string;
          user_id: string;
          expires: string;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_token?: string;
          user_id?: string;
          expires?: string;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      packages: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          description: string;
          description_bn: string | null;
          bdt_price: number;
          bdt_promo_price: number | null;
          duration_mins: number;
          is_active: boolean;
          is_promotional: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          description: string;
          description_bn?: string | null;
          bdt_price: number;
          bdt_promo_price?: number | null;
          duration_mins?: number;
          is_active?: boolean;
          is_promotional?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          description?: string;
          description_bn?: string | null;
          bdt_price?: number;
          bdt_promo_price?: number | null;
          duration_mins?: number;
          is_active?: boolean;
          is_promotional?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      package_services: {
        Row: {
          id: string;
          package_id: string;
          name: string;
          duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          package_id: string;
          name: string;
          duration?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          package_id?: string;
          name?: string;
          duration?: number;
          created_at?: string;
        };
      };
      stylist_shifts: {
        Row: {
          id: string;
          stylist_name: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked: boolean;
          override_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          stylist_name: string;
          date: string;
          start_time: string;
          end_time: string;
          is_blocked?: boolean;
          override_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          stylist_name?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          is_blocked?: boolean;
          override_reason?: string | null;
          created_at?: string;
        };
      };
      emergency_notices: {
        Row: {
          id: string;
          title: string;
          title_bn: string | null;
          message: string;
          message_bn: string | null;
          priority_level: string;
          is_global_active: boolean;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_bn?: string | null;
          message: string;
          message_bn?: string | null;
          priority_level?: string;
          is_global_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_bn?: string | null;
          message?: string;
          message_bn?: string | null;
          priority_level?: string;
          is_global_active?: boolean;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      booking_requests: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          service_title: string;
          package_id: string | null;
          bdt_amount: number;
          appointment_time: string;
          status: string;
          channel: string;
          notes: string | null;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          service_title: string;
          package_id?: string | null;
          bdt_amount: number;
          appointment_time: string;
          status?: string;
          channel?: string;
          notes?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string;
          service_title?: string;
          package_id?: string | null;
          bdt_amount?: number;
          appointment_time?: string;
          status?: string;
          channel?: string;
          notes?: string | null;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      booking_services: {
        Row: {
          id: string;
          booking_id: string;
          service_name: string;
          duration: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          service_name: string;
          duration?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          service_name?: string;
          duration?: number;
          created_at?: string;
        };
      };
      omni_messages: {
        Row: {
          id: string;
          sender_id: string;
          customer_name: string;
          channel: string;
          text: string;
          is_from_admin: boolean;
          is_read: boolean;
          user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          customer_name: string;
          channel?: string;
          text: string;
          is_from_admin?: boolean;
          is_read?: boolean;
          user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          customer_name?: string;
          channel?: string;
          text?: string;
          is_from_admin?: boolean;
          is_read?: boolean;
          user_id?: string | null;
          created_at?: string;
        };
      };
      localized_translations: {
        Row: {
          id: string;
          key: string;
          locale: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          locale: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          locale?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      create_package_with_services: {
        Args: {
          p_title: string;
          p_title_bn?: string | null;
          p_description: string;
          p_description_bn?: string | null;
          p_bdt_price: number;
          p_bdt_promo_price?: number | null;
          p_duration_mins?: number | null;
          p_is_active?: boolean | null;
          p_is_promotional?: boolean | null;
          p_services?: Json | null;
        };
        Returns: Json;
      };
      create_booking_with_services: {
        Args: {
          p_customer_name: string;
          p_customer_phone: string;
          p_service_title: string;
          p_package_id?: string | null;
          p_bdt_amount: number;
          p_appointment_time: string;
          p_channel?: string | null;
          p_notes?: string | null;
          p_user_id?: string | null;
          p_sub_services?: Json | null;
        };
        Returns: Json;
      };
      get_salon_kpi_overview: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Enums: {
      user_role: "CLIENT" | "STYLIST" | "MANAGER" | "ADMIN";
      app_language: "en" | "bn";
      booking_status_type: "PENDING" | "CONFIRMED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED";
      omni_channel_type: "WEBSITE" | "WHATSAPP" | "MESSENGER";
    };
  };
}
