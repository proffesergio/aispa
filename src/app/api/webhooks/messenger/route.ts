import { NextRequest, NextResponse } from "next/server";
import { parseMessengerPayload } from "@/lib/omni/webhook-router";

const VERIFY_TOKEN = process.env.MESSENGER_VERIFY_TOKEN || "aispa_fb_verify_token_2026";

/**
 * GET Webhook Verification Handshake for Meta Graph API (Facebook Messenger)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Facebook Messenger Webhook] Verification successful.");
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Forbidden: Token mismatch" }, { status: 403 });
}

/**
 * POST Webhook Receiver for Incoming Facebook Messenger Messages
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[Messenger Webhook Event Received]:", JSON.stringify(payload, null, 2));

    const parsedMessage = parseMessengerPayload(payload);

    if (parsedMessage) {
      console.log(`[Unified Message Mapper] Processed Facebook Messenger Message from PSID ${parsedMessage.senderId}: "${parsedMessage.text}"`);
      // In production: store in DB via Prisma (`await prisma.omniMessage.create(...)`)
    }

    return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error: any) {
    console.error("Messenger Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
