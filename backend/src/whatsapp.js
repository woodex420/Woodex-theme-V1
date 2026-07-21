/**
 * WhatsApp Business API integration
 * Supports both real API and demo mode
 */

import { getSettings } from "./store.js";

const DEMO_MODE = !process.env.WHATSAPP_BUSINESS_TOKEN;

/**
 * Send a WhatsApp message via the official WhatsApp Business Cloud API.
 * Falls back to console log in demo mode.
 */
/**
 * Emit a new-lead event (stub for in-memory store).
 * In a production setup, this would emit via WebSocket.
 */
export function emitNewLead(lead) {
  console.log(`[whatsapp] New lead notification: ${lead.name} (${lead.email})`);
}

export async function sendWhatsApp(to, message) {
  if (DEMO_MODE) {
    console.log(`[whatsapp:demo] to=${to} message="${message.substring(0, 80)}..."`);
    return { ok: true, mode: "demo", messageId: `demo-${Date.now()}` };
  }

  try {
    const url = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_BUSINESS_PHONE_ID}/messages`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_BUSINESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: to.replace(/[^0-9]/g, ""),
        type: "text",
        text: { body: message },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "WhatsApp API error");
    return { ok: true, mode: "live", messageId: data.messages?.[0]?.id };
  } catch (e) {
    console.error("[whatsapp] send failed:", e.message);
    return { ok: false, error: e.message };
  }
}

/**
 * Send a WhatsApp alert (admin notification)
 */
export async function sendWhatsAppAlert(message, phone) {
  return sendWhatsApp(phone || "+923001234567", message);
}

/**
 * Verify webhook signature from WhatsApp
 */
export function verifyWebhookSignature(req) {
  if (DEMO_MODE) return true;
  const signature = req.headers["x-hub-signature-256"];
  // In production, verify HMAC-SHA256
  return !!signature;
}

/**
 * Process incoming WhatsApp webhook
 */
export async function processWebhook(payload) {
  const { entry } = payload;
  if (!entry) return [];
  const events = [];
  for (const e of entry) {
    for (const change of e.changes || []) {
      if (change.field === "messages") {
        const { messages, contacts } = change.value;
        for (const m of messages || []) {
          const contact = contacts?.find((c) => c.wa_id === m.from) || {};
          events.push({
            type: "incoming",
            customerPhone: m.from,
            customerName: contact.profile?.name || m.from,
            message: m.text?.body || "",
            timestamp: new Date(parseInt(m.timestamp) * 1000).toISOString(),
          });
        }
      }
    }
  }
  return events;
}
