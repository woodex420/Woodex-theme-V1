import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

// Public GET router — no auth required
const publicRouter = Router();

publicRouter.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let items = await findAll("BlogPost", {}, "blogPosts");
    if (category) items = items.filter((i) => i.category === category);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) => `${i.title} ${i.excerpt}`.toLowerCase().includes(s));
    }
    res.json({ posts: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

publicRouter.get("/:id", async (req, res) => {
  try {
    const p = await findById("BlogPost", req.params.id, "blogPosts");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ post: p });
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
    let items = await findAll("BlogPost", {}, "blogPosts");
    if (category) items = items.filter((i) => i.category === category);
    if (search) {
      const s = search.toLowerCase();
      items = items.filter((i) => `${i.title} ${i.excerpt}`.toLowerCase().includes(s));
    }
    res.json({ posts: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/:id", async (req, res) => {
  try {
    const p = await findById("BlogPost", req.params.id, "blogPosts");
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ post: p });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.blogPosts) all.blogPosts = [];
    const id = uuid();
    const newPost = {
      _id: id,
      id: req.body.slug || id,
      ...req.body,
      status: req.body.status || "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.blogPosts.push(newPost);
    res.status(201).json({ post: newPost });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.blogPosts?.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.blogPosts[idx] = { ...all.blogPosts[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ post: all.blogPosts[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.blogPosts?.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.blogPosts.splice(idx, 1);
    res.json({ ok: true, post: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { publicRouter as blogRouter, adminRouter as blogAdminRouter };
