import { NextRequest, NextResponse } from "next/server";
import { parseWhatsAppPayload } from "@/lib/omni/webhook-router";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "aispa_wa_verify_token_2026";

/**
 * GET Webhook Verification Handshake for Meta WhatsApp Cloud API
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] Verification successful.");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden: Token mismatch" }, { status: 403 });
}

/**
 * POST Webhook Receiver for Incoming WhatsApp Messages
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[WhatsApp Webhook Event Received]:", JSON.stringify(payload, null, 2));

    const parsedMessage = parseWhatsAppPayload(payload);

    if (parsedMessage) {
      console.log(`[Unified Message Mapper] Processed WhatsApp Message from ${parsedMessage.customerName} (${parsedMessage.senderId}): "${parsedMessage.text}"`);
      // In production: store in DB via Prisma (`await prisma.omniMessage.create(...)`)
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("WhatsApp Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
