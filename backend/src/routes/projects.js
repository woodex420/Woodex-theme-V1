import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

// Public GET router — no auth required
const publicRouter = Router();

publicRouter.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let items = await findAll("Project", {}, "projects");
    if (category) items = items.filter((i) => i.category === category);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) =>
        `${i.title} ${i.client} ${i.location}`.toLowerCase().includes(s)
      );
    }
    res.json({ projects: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

publicRouter.get("/:id", async (req, res) => {
  try {
    const p = await findById("Project", req.params.id, "projects");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ project: p });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin CRUD router — auth required
const adminRouter = Router();
adminRouter.use(authRequired);
adminRouter.use(authRole("admin", "editor"));

adminRouter.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let items = await findAll("Project", {}, "projects");
    if (category) items = items.filter((i) => i.category === category);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) =>
        `${i.title} ${i.client} ${i.location}`.toLowerCase().includes(s)
      );
    }
    res.json({ projects: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/:id", async (req, res) => {
  try {
    const p = await findById("Project", req.params.id, "projects");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ project: p });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.projects) all.projects = [];
    const id = uuid();
    const newProject = {
      _id: id,
      id: parseInt(id.slice(0, 8), 16) || Date.now(),
      ...req.body,
      status: req.body.status || "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.projects.push(newProject);
    res.status(201).json({ project: newProject });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.projects?.findIndex((p) => p._id === req.params.id || String(p.id) === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.projects[idx] = { ...all.projects[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ project: all.projects[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.projects?.findIndex((p) => p._id === req.params.id || String(p.id) === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.projects.splice(idx, 1);
    res.json({ ok: true, project: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { publicRouter as projectsRouter, adminRouter as projectsAdminRouter };
