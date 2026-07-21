import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";
import { sendWhatsAppAlert, emitNewLead } from "../whatsapp.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "editor"));

router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    let items = await findAll("Lead", {}, "leads");
    if (status) items = items.filter((i) => i.status === status);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) =>
        `${i.name} ${i.email} ${i.message}`.toLowerCase().includes(s)
      );
    }
    res.json({ leads: items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lead = await findById("Lead", req.params.id, "leads");
    if (!lead) return res.status(404).json({ error: "Not found" });
    res.json({ lead });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public POST endpoint for form submissions (no auth required)
export const publicLeadsRouter = Router();
publicLeadsRouter.post("/", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: "name, email and message are required" });
    }
    const all = getMemory();
    if (!all.leads) all.leads = [];
    const lead = {
      _id: uuid(),
      id: uuid(),
      name,
      email,
      phone: phone || "",
      service: service || "",
      message,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    all.leads.unshift(lead);

    // Real-time notification
    emitNewLead(lead);

    // WhatsApp alert
    const settings = await (await import("../store.js")).getSettings();
    if (settings.whatsappAlertsEnabled && settings.alertOnNewLead) {
      await sendWhatsAppAlert(
        `🔔 New lead: ${name} (${email})${service ? ` — interested in ${service}` : ""}\n\n"${message.substring(0, 200)}"`,
        settings.alertPhone
      );
    }

    res.status(201).json({ lead });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin routes
router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.leads?.findIndex((l) => l._id === req.params.id || l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.leads[idx] = { ...all.leads[idx], ...req.body };
    res.json({ lead: all.leads[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.leads?.findIndex((l) => l._id === req.params.id || l.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.leads.splice(idx, 1);
    res.json({ ok: true, lead: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/:id/notify", async (req, res) => {
  try {
    const lead = await findById("Lead", req.params.id, "leads");
    if (!lead) return res.status(404).json({ error: "Not found" });
    const settings = await (await import("../store.js")).getSettings();
    const message = req.body.message || `🔔 Follow-up needed: ${lead.name} (${lead.email})\n\n"${lead.message.substring(0, 200)}"`;
    const result = await sendWhatsAppAlert(message, settings.alertPhone);
    res.json({ ok: true, sent: result });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as leadsRouter };
