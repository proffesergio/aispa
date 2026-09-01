import { NextRequest, NextResponse } from "next/server";
import { authorizeRoles } from "@/lib/auth/rbac";
import { dispatchWhatsAppTemplateMessage } from "@/lib/omni/webhook-router";

let mockBookings = [
  {
    id: "bk-101",
    customerName: "Dr. Farhana Ahmed",
    customerPhone: "+8801712345678",
    serviceTitle: "Hydro-O2 Oxygen Facial",
    bdtAmount: 10200,
    appointmentTime: "03:00 PM Today",
    status: "PENDING",
    channel: "WHATSAPP",
  },
];

export async function GET(req: NextRequest) {
  return NextResponse.json({ success: true, bookings: mockBookings });
}

export async function PATCH(req: NextRequest) {
  const auth = authorizeRoles(req, ["ADMIN", "MANAGER"]);

  try {
    const body = await req.json();
    const { bookingId, newStatus } = body;

    const bookingIndex = mockBookings.findIndex((b) => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: "Booking request not found" }, { status: 404 });
    }

    mockBookings[bookingIndex].status = newStatus;
    const targetBooking = mockBookings[bookingIndex];

    // Trigger WhatsApp Business Template Notification if customer phone exists
    let whatsappResult = null;
    if (targetBooking.customerPhone && (newStatus === "CONFIRMED" || newStatus === "RESCHEDULED")) {
      whatsappResult = await dispatchWhatsAppTemplateMessage({
        phone: targetBooking.customerPhone,
        customerName: targetBooking.customerName,
        serviceTitle: targetBooking.serviceTitle,
        appointmentTime: targetBooking.appointmentTime,
        status: newStatus,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${newStatus}`,
      booking: targetBooking,
      whatsappNotification: whatsappResult,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update booking status" }, { status: 500 });
  }
}
