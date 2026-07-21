import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";
import { emitNewConversation, emitConversationUpdate } from "../socket.js";
import { sendWhatsApp } from "../whatsapp.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "editor"));

router.get("/", async (req, res) => {
  try {
    const { status, channel, assignedAgent } = req.query;
    let items = await findAll("Conversation", {}, "conversations");
    if (status) items = items.filter((i) => i.status === status);
    if (channel) items = items.filter((i) => i.channel === channel);
    if (assignedAgent) items = items.filter((i) => i.assignedAgent === assignedAgent);
    res.json({
      conversations: items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const c = await findById("Conversation", req.params.id, "conversations");
    if (!c) return res.status(404).json({ error: "Not found" });
    res.json({ conversation: c });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.conversations) all.conversations = [];
    const id = uuid();
    const now = new Date().toISOString();
    const conv = {
      _id: id,
      id,
      channel: req.body.channel || "whatsapp",
      customerName: req.body.customerName || "Unknown",
      customerPhone: req.body.customerPhone || "",
      customerEmail: req.body.customerEmail || "",
      service: req.body.service || "",
      status: req.body.status || "queued",
      priority: req.body.priority || "normal",
      assignedAgent: req.body.assignedAgent || null,
      messages: [],
      source: req.body.source || "manual",
      createdAt: now,
      updatedAt: now,
    };
    all.conversations.unshift(conv);
    emitNewConversation(conv);
    res.status(201).json({ conversation: conv });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.conversations?.findIndex((c) => c._id === req.params.id || c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.conversations[idx] = { ...all.conversations[idx], ...req.body, updatedAt: new Date().toISOString() };
    emitConversationUpdate(all.conversations[idx]);
    res.json({ conversation: all.conversations[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.conversations?.findIndex((c) => c._id === req.params.id || c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.conversations.splice(idx, 1);
    res.json({ ok: true, conversation: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/messages", async (req, res) => {
  try {
    const { from, text, sendToCustomer } = req.body;
    if (!from || !text) return res.status(400).json({ error: "from and text required" });
    const all = getMemory();
    const idx = all.conversations?.findIndex((c) => c._id === req.params.id || c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const message = {
      id: uuid(),
      from,
      text,
      timestamp: new Date().toISOString(),
      read: from === "agent",
    };
    all.conversations[idx].messages.push(message);
    all.conversations[idx].updatedAt = new Date().toISOString();
    if (from === "agent") {
      all.conversations[idx].status = "active";
    }
    emitConversationUpdate(all.conversations[idx]);

    // Send via WhatsApp if requested
    if (sendToCustomer && all.conversations[idx].channel === "whatsapp" && all.conversations[idx].customerPhone) {
      try {
        await sendWhatsApp(all.conversations[idx].customerPhone, text);
      } catch (e) {
        console.error("Failed to send WhatsApp:", e.message);
      }
    }

    res.status(201).json({ conversation: all.conversations[idx], message });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as conversationsRouter };
