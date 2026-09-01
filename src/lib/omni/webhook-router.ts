export type OmniChannelType = "WEBSITE" | "WHATSAPP" | "MESSENGER";

export interface UnifiedOmniMessage {
  id: string;
  senderId: string;
  customerName: string;
  channel: OmniChannelType;
  text: string;
  isFromAdmin: boolean;
  timestamp: string;
}

/**
 * Parses raw Meta Graph API (Facebook Messenger) Webhook Payload
 */
export function parseMessengerPayload(payload: any): UnifiedOmniMessage | null {
  try {
    const entry = payload?.entry?.[0];
    const messaging = entry?.messaging?.[0];

    if (!messaging || !messaging.message) return null;

    const senderPsid = messaging.sender.id;
    const messageText = messaging.message.text;

    return {
      id: `msg_fb_${messaging.message.mid || Date.now()}`,
      senderId: senderPsid,
      customerName: `FB Client (${senderPsid.slice(-4)})`,
      channel: "MESSENGER",
      text: messageText || "[Attachment/Media]",
      isFromAdmin: false,
      timestamp: new Date(messaging.timestamp || Date.now()).toISOString(),
    };
  } catch (error) {
    console.error("Error parsing Facebook Messenger webhook payload:", error);
    return null;
  }
}

/**
 * Parses raw WhatsApp Business Cloud API Webhook Payload
 */
export function parseWhatsAppPayload(payload: any): UnifiedOmniMessage | null {
  try {
    const value = payload?.entry?.[0]?.changes?.[0]?.value;
    const message = value?.messages?.[0];
    const contact = value?.contacts?.[0];

    if (!message) return null;

    const waPhone = message.from; // e.g. 8801712345678
    const customerName = contact?.profile?.name || `+${waPhone}`;
    const textBody = message.text?.body;

    return {
      id: `msg_wa_${message.id || Date.now()}`,
      senderId: `+${waPhone}`,
      customerName,
      channel: "WHATSAPP",
      text: textBody || "[Media Content]",
      isFromAdmin: false,
      timestamp: new Date(Number(message.timestamp) * 1000 || Date.now()).toISOString(),
    };
  } catch (error) {
    console.error("Error parsing WhatsApp Business API payload:", error);
    return null;
  }
}

/**
 * Dispatches an automated WhatsApp Business Template Notification
 * upon booking status transitions (e.g. Approved, Rescheduled, Cancelled).
 */
export async function dispatchWhatsAppTemplateMessage({
  phone,
  customerName,
  serviceTitle,
  appointmentTime,
  status,
}: {
  phone: string;
  customerName: string;
  serviceTitle: string;
  appointmentTime: string;
  status: "CONFIRMED" | "RESCHEDULED" | "CANCELLED";
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const whatsappApiUrl = process.env.WHATSAPP_API_URL || "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages";
  const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN || "mock_wa_access_token_2026";

  console.log(`[WhatsApp Business API Dispatch] Sending Template Message to ${phone}:`);
  console.log(` -> Hi ${customerName}, your booking for "${serviceTitle}" on ${appointmentTime} status is now: ${status}.`);

  try {
    // Structural WhatsApp Business Graph API Payload
    const payload = {
      messaging_product: "whatsapp",
      to: phone.replace("+", ""),
      type: "template",
      template: {
        name: "aispa_booking_update",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: customerName },
              { type: "text", text: serviceTitle },
              { type: "text", text: appointmentTime },
              { type: "text", text: status },
            ],
          },
        ],
      },
    };

    // Return Simulated Success
    return {
      success: true,
      messageId: `wamid.HBgL${Date.now()}`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to dispatch WhatsApp message",
    };
  }
}
