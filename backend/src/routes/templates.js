import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "editor"));

// ============= BUILT-IN TEMPLATES (WhatsApp) =============
const builtInTemplates = [
  {
    id: "t-1",
    name: "Welcome Greeting",
    channel: "whatsapp",
    body: "Hi {{name}}! 👋 Welcome to WP Interior Studio. Thanks for your interest in our {{service}} services. How can we help you today?",
    variables: ["name", "service"],
    category: "greeting",
    isActive: true,
  },
  {
    id: "t-2",
    name: "Initial Response",
    channel: "whatsapp",
    body: "Hi {{name}}, thanks for reaching out about {{service}}. We'd love to schedule a free 30-minute consultation with you. Are you available this week?",
    variables: ["name", "service"],
    category: "greeting",
    isActive: true,
  },
  {
    id: "t-3",
    name: "Follow-up After Consultation",
    channel: "whatsapp",
    body: "Hi {{name}}, thanks for our consultation on {{date}}. As promised, here's the proposal for your {{service}} project. Let me know if you have any questions!",
    variables: ["name", "date", "service"],
    category: "follow-up",
    isActive: true,
  },
  {
    id: "t-4",
    name: "Project Kickoff",
    channel: "whatsapp",
    body: "🎉 Exciting news {{name}}! Your {{service}} project kicks off on {{date}}. We'll be in touch with the first deliverables within 48 hours. Welcome aboard!",
    variables: ["name", "service", "date"],
    category: "thank-you",
    isActive: true,
  },
];

function ensureBuiltIns() {
  const all = getMemory();
  if (!all.templates) all.templates = [];
  builtInTemplates.forEach((bt) => {
    if (!all.templates.find((t) => t.id === bt.id)) {
      all.templates.push(bt);
    }
  });
}

router.get("/", async (_req, res) => {
  try {
    ensureBuiltIns();
    const items = await findAll("Template", {}, "templates");
    res.json({ templates: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.templates) all.templates = [];
    const id = uuid();
    const newT = { _id: id, id, ...req.body, isActive: req.body.isActive ?? true };
    all.templates.push(newT);
    res.status(201).json({ template: newT });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.templates?.findIndex((t) => t._id === req.params.id || t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.templates[idx] = { ...all.templates[idx], ...req.body };
    res.json({ template: all.templates[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.templates?.findIndex((t) => t._id === req.params.id || t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.templates.splice(idx, 1);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============= TEMPLATE RENDERING =============
router.post("/render", (req, res) => {
  try {
    const { templateId, templateBody, variables } = req.body;
    let body = templateBody;
    if (templateId) {
      const all = getMemory();
      const t = all.templates?.find((x) => x._id === templateId || x.id === templateId);
      if (!t) return res.status(404).json({ error: "Template not found" });
      body = t.body;
      Object.entries(variables || {}).forEach(([k, v]) => {
        body = body.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v);
      });
    } else if (templateBody) {
      Object.entries(variables || {}).forEach(([k, v]) => {
        body = body.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), v);
      });
    }
    res.json({ rendered: body });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as templatesRouter };
