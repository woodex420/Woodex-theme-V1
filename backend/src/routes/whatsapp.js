import { Router } from "express";
import { sendWhatsApp, sendWhatsAppAlert, processWebhook, verifyWebhookSignature } from "../whatsapp.js";
import { getMemory, getSettings } from "../store.js";
import { authRequired, authRole } from "../middleware.js";
import { v4 as uuid } from "uuid";

const router = Router();

// ============= ADMIN ROUTES =============
router.use(authRequired);
router.use(authRole("admin", "manager"));

router.post("/send", async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ error: "to and message required" });
    const result = await sendWhatsApp(to, message);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/test", async (req, res) => {
  try {
    const { to } = req.body;
    const settings = await getSettings();
    const phone = to || settings.alertPhone;
    const result = await sendWhatsAppAlert("🧪 Test alert from WP Interior admin. Support system is working.", phone);
    res.json({ ...result, to: phone });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============= WEBHOOK ROUTES (PUBLIC) =============
export const publicWhatsappRouter = Router();

publicWhatsappRouter.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.status(403).send("Forbidden");
});

publicWhatsappRouter.post("/webhook", async (req, res) => {
  try {
    if (!verifyWebhookSignature(req)) {
      return res.status(401).json({ error: "Invalid signature" });
    }
    const events = await processWebhook(req.body);
    // Auto-create conversations
    const all = getMemory();
    if (!all.conversations) all.conversations = [];
    for (const ev of events) {
      const existing = all.conversations.find(
        (c) => c.customerPhone === ev.customerPhone && c.status !== "resolved"
      );
      if (existing) {
        existing.messages.push({
          id: uuid(),
          from: "customer",
          text: ev.message,
          timestamp: ev.timestamp,
          read: false,
        });
        existing.updatedAt = ev.timestamp;
        existing.status = existing.status === "queued" ? "active" : existing.status;
      } else {
        all.conversations.unshift({
          _id: uuid(),
          id: uuid(),
          channel: "whatsapp",
          customerName: ev.customerName,
          customerPhone: ev.customerPhone,
          service: "",
          status: "queued",
          priority: "normal",
          messages: [{
            id: uuid(),
            from: "customer",
            text: ev.message,
            timestamp: ev.timestamp,
            read: false,
          }],
          source: "whatsapp",
          createdAt: ev.timestamp,
          updatedAt: ev.timestamp,
        });
      }
    }
    res.json({ ok: true, events: events.length });
  } catch (e) {
    console.error("Webhook error:", e);
    res.status(500).json({ error: e.message });
  }
});

export { router as whatsappRouter };
