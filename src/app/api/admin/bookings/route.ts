import { NextRequest, NextResponse } from "next/server";
import { authorizeRoles } from "@/lib/auth/rbac";
import { BookingService } from "@/lib/services/booking-service";
import { dispatchWhatsAppTemplateMessage } from "@/lib/omni/webhook-router";

/**
 * GET /api/admin/bookings
 * Retrieves all salon bookings from Supabase with attached sub-services.
 */
export async function GET(req: NextRequest) {
  const auth = authorizeRoles(req, ["ADMIN", "MANAGER", "STYLIST"]);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") || undefined;

    const bookings = await BookingService.getAllBookings(statusFilter);

    // Format for frontend consumption
    const formattedBookings = bookings.map((b) => ({
      id: b.id,
      customerName: b.customer_name,
      customerPhone: b.customer_phone,
      serviceTitle: b.service_title,
      bdtAmount: Number(b.bdt_amount),
      appointmentTime: b.appointment_time,
      status: b.status,
      channel: b.channel,
      notes: b.notes,
      userId: b.user_id,
      services: (b.services || []).map((s) => s.service_name),
      createdAt: b.created_at,
    }));

    return NextResponse.json({ success: true, bookings: formattedBookings });
  } catch (error: any) {
    console.error("[GET /api/admin/bookings] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch bookings from Supabase" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/bookings
 * Updates a booking status and dispatches automated WhatsApp notification.
 */
export async function PATCH(req: NextRequest) {
  const auth = authorizeRoles(req, ["ADMIN", "MANAGER"]);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return auth.response!;
  }

  try {
    const body = await req.json();
    const { bookingId, newStatus } = body;

    if (!bookingId || !newStatus) {
      return NextResponse.json(
        { error: "bookingId and newStatus are required." },
        { status: 400 }
      );
    }

    const updatedBooking = await BookingService.updateStatus(bookingId, newStatus);

    // Trigger WhatsApp Business Template Notification if customer phone exists
    let whatsappResult = null;
    if (
      updatedBooking.customer_phone &&
      (newStatus === "CONFIRMED" || newStatus === "RESCHEDULED")
    ) {
      try {
        whatsappResult = await dispatchWhatsAppTemplateMessage({
          phone: updatedBooking.customer_phone,
          customerName: updatedBooking.customer_name,
          serviceTitle: updatedBooking.service_title,
          appointmentTime: updatedBooking.appointment_time,
          status: newStatus,
        });
      } catch (waErr) {
        console.warn("[PATCH /api/admin/bookings] WhatsApp dispatch warning:", waErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${newStatus}`,
      booking: {
        id: updatedBooking.id,
        customerName: updatedBooking.customer_name,
        customerPhone: updatedBooking.customer_phone,
        serviceTitle: updatedBooking.service_title,
        bdtAmount: Number(updatedBooking.bdt_amount),
        appointmentTime: updatedBooking.appointment_time,
        status: updatedBooking.status,
        channel: updatedBooking.channel,
      },
      whatsappNotification: whatsappResult,
    });
  } catch (error: any) {
    console.error("[PATCH /api/admin/bookings] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update booking status" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/bookings
 * Deletes a booking from Supabase.
 */
export async function DELETE(req: NextRequest) {
  const auth = authorizeRoles(req, ["ADMIN"]);
  if (!auth.authorized && process.env.NODE_ENV === "production") {
    return auth.response!;
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required." }, { status: 400 });
    }

    await BookingService.deleteBooking(id);
    return NextResponse.json({ success: true, message: "Booking removed successfully." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete booking" }, { status: 500 });
  }
}
