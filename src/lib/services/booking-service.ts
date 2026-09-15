import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type BookingRow = Database["public"]["Tables"]["booking_requests"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["booking_requests"]["Insert"];

export interface BookingWithServices extends BookingRow {
  services?: { service_name: string; duration: number }[];
}

export interface CreateBookingInput {
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  packageId?: string | null;
  bdtAmount: number;
  appointmentTime: string; // ISO string
  channel?: "WEBSITE" | "WHATSAPP" | "MESSENGER";
  notes?: string;
  userId?: string | null;
  services?: (string | { name: string; duration?: number })[];
}

/**
 * Controller / Service Layer for Salon Booking Management (Supabase Native)
 */
export class BookingService {
  /**
   * Fetches all bookings with attached sub-services (Admin/Manager use)
   */
  static async getAllBookings(statusFilter?: string): Promise<BookingWithServices[]> {
    let query = supabaseAdmin
      .from("booking_requests")
      .select("*, services:booking_services(service_name, duration)")
      .order("appointment_time", { ascending: false });

    if (statusFilter && statusFilter !== "ALL") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[BookingService.getAllBookings] Error:", error);
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }

    return (data as BookingWithServices[]) || [];
  }

  /**
   * Fetches bookings associated with a specific customer
   */
  static async getCustomerBookings(userId: string, phone?: string): Promise<BookingWithServices[]> {
    let query = supabaseAdmin
      .from("booking_requests")
      .select("*, services:booking_services(service_name, duration)")
      .order("appointment_time", { ascending: false });

    if (phone) {
      query = query.or(`user_id.eq.${userId},customer_phone.eq.${phone}`);
    } else {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[BookingService.getCustomerBookings] Error:", error);
      throw new Error(`Failed to fetch user bookings: ${error.message}`);
    }

    return (data as BookingWithServices[]) || [];
  }

  /**
   * Fetches a single booking by ID
   */
  static async getBookingById(id: string): Promise<BookingWithServices | null> {
    const { data, error } = await supabaseAdmin
      .from("booking_requests")
      .select("*, services:booking_services(service_name, duration)")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error("[BookingService.getBookingById] Error:", error);
      throw new Error(`Failed to fetch booking: ${error.message}`);
    }

    return data as BookingWithServices | null;
  }

  /**
   * Creates a booking with multiple sub-services using Supabase RPC for atomic transaction handling
   */
  static async createBookingWithRPC(input: CreateBookingInput): Promise<any> {
    const formattedServices = (input.services || []).map((s) =>
      typeof s === "string" ? { name: s, duration: 30 } : { name: s.name, duration: s.duration || 30 }
    );

    const { data, error } = await supabaseAdmin.rpc("create_booking_with_services", {
      p_customer_name: input.customerName,
      p_customer_phone: input.customerPhone,
      p_service_title: input.serviceTitle,
      p_package_id: input.packageId || null,
      p_bdt_amount: input.bdtAmount,
      p_appointment_time: input.appointmentTime,
      p_channel: input.channel || "WEBSITE",
      p_notes: input.notes || null,
      p_user_id: input.userId || null,
      p_sub_services: formattedServices,
    });

    if (error) {
      console.warn("[BookingService.createBookingWithRPC] RPC failed, falling back to manual transaction:", error.message);
      return this.createBookingManual(input);
    }

    return data;
  }

  /**
   * Fallback multi-table creation in case the RPC function is not installed in the database yet
   */
  static async createBookingManual(input: CreateBookingInput): Promise<BookingWithServices> {
    const { data: booking, error: bookingErr } = await supabaseAdmin
      .from("booking_requests")
      .insert({
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        service_title: input.serviceTitle,
        package_id: input.packageId || null,
        bdt_amount: input.bdtAmount,
        appointment_time: input.appointmentTime,
        status: "PENDING",
        channel: input.channel || "WEBSITE",
        notes: input.notes || null,
        user_id: input.userId || null,
      })
      .select()
      .single();

    if (bookingErr || !booking) {
      console.error("[BookingService.createBookingManual] Error creating master booking:", bookingErr);
      throw new Error(`Failed to create booking request: ${bookingErr?.message}`);
    }

    if (input.services && input.services.length > 0) {
      const serviceRecords = input.services.map((s) => ({
        booking_id: booking.id,
        service_name: typeof s === "string" ? s : s.name,
        duration: typeof s === "string" ? 30 : s.duration || 30,
      }));

      const { error: svcErr } = await supabaseAdmin
        .from("booking_services")
        .insert(serviceRecords);

      if (svcErr) {
        console.warn("[BookingService.createBookingManual] Warning creating sub-services:", svcErr);
      }
    }

    return this.getBookingById(booking.id) as Promise<BookingWithServices>;
  }

  /**
   * Updates booking status (e.g. PENDING -> CONFIRMED, RESCHEDULED, CANCELLED)
   */
  static async updateStatus(id: string, newStatus: string): Promise<BookingRow> {
    const { data, error } = await supabaseAdmin
      .from("booking_requests")
      .update({ status: newStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[BookingService.updateStatus] Error:", error);
      throw new Error(`Failed to update booking status: ${error.message}`);
    }

    return data;
  }

  /**
   * Deletes a booking request
   */
  static async deleteBooking(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("booking_requests")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[BookingService.deleteBooking] Error:", error);
      throw new Error(`Failed to delete booking: ${error.message}`);
    }

    return true;
  }
}
