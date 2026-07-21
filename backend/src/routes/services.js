import { Router } from "express";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

// Public GET router — no auth required
const publicRouter = Router();

publicRouter.get("/", async (_req, res) => {
  try {
    const items = await findAll("Service", {}, "services");
    res.json({ services: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

publicRouter.get("/:id", async (req, res) => {
  try {
    const s = await findById("Service", req.params.id, "services");
    if (!s) return res.status(404).json({ error: "Not found" });
    res.json({ service: s });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin CRUD router — auth required
const adminRouter = Router();
adminRouter.use(authRequired);
adminRouter.use(authRole("admin", "editor"));

adminRouter.get("/", async (_req, res) => {
  try {
    const items = await findAll("Service", {}, "services");
    res.json({ services: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/:id", async (req, res) => {
  try {
    const s = await findById("Service", req.params.id, "services");
    if (!s) return res.status(404).json({ error: "Not found" });
    res.json({ service: s });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/", async (req, res) => {
  try {
    const { v4: uuid } = await import("uuid");
    const all = getMemory();
    if (!all.services) all.services = [];
    const slugify = (text) => text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    const service = {
      _id: uuid(),
      id: uuid(),
      name: req.body.name || "New Service",
      slug: req.body.slug || slugify(req.body.name || "new-service"),
      shortDescription: req.body.shortDescription || "",
      description: req.body.description || "",
      icon: req.body.icon || "Package",
      category: req.body.category || "",
      price: req.body.price || "",
      status: req.body.status || "published",
      order: req.body.order ?? all.services.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.services.push(service);
    res.status(201).json({ service });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.services?.findIndex((s) => s._id === req.params.id || s.id === req.params.id || s.slug === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.services[idx] = { ...all.services[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ service: all.services[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.services?.findIndex((s) => s._id === req.params.id || s.id === req.params.id || s.slug === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.services.splice(idx, 1);
    res.json({ ok: true, service: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { publicRouter as servicesRouter, adminRouter as servicesAdminRouter };
