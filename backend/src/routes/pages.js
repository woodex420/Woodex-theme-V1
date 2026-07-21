import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findOne, findById, create, update, remove, getMemory, getDefaultHeaderFooter } from "../store.js";
import { authRequired, authRole } from "../middleware.js";
import { emitAlert } from "../socket.js";

const router = Router();

// All routes require admin
router.use(authRequired);
router.use(authRole("admin", "editor"));

// GET /api/pages
router.get("/", async (_req, res) => {
  try {
    const pages = await findAll("Page", {}, "pages");
    res.json({ pages });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/pages/:id
router.get("/:id", async (req, res) => {
  try {
    const page = await findById("Page", req.params.id, "pages");
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ page });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pages
router.post("/", async (req, res) => {
  try {
    const { title, slug, templateId } = req.body;
    if (!title) return res.status(400).json({ error: "title required" });
    const finalSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
    const id = uuid();
    const all = getMemory();
    // Get template blocks if provided
    const template = templateId ? all.templates?.find((t) => t._id === templateId || t.id === templateId) : null;
    const blocks = template?.blocks ? template.blocks.map((b, i) => ({ ...b, _id: uuid(), id: `b-${id}-${i}`, order: i, visible: b.visible ?? true })) : [];

    const newPage = {
      _id: id,
      id,
      slug: finalSlug,
      title,
      description: req.body.description || "",
      isHome: req.body.isHome || false,
      isPublished: req.body.isPublished ?? true,
      blocks,
      meta: req.body.meta || { title, description: "" },
      order: all.pages?.length || 0,
    };
    if (req.body.isHome) {
      // Unset other home flags
      all.pages?.forEach((p) => p.isHome = false);
    }
    if (!all.pages) all.pages = [];
    all.pages.push(newPage);
    res.status(201).json({ page: newPage });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/pages/:id
router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.pages?.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Page not found" });
    if (req.body.isHome) {
      all.pages.forEach((p, i) => { if (i !== idx) p.isHome = false; });
    }
    all.pages[idx] = { ...all.pages[idx], ...req.body, updatedAt: new Date().toISOString() };
    res.json({ page: all.pages[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pages/:id/duplicate
router.post("/:id/duplicate", async (req, res) => {
  try {
    const all = getMemory();
    const original = all.pages?.find((p) => p._id === req.params.id || p.id === req.params.id);
    if (!original) return res.status(404).json({ error: "Page not found" });
    const newId = uuid();
    const copy = {
      ...original,
      _id: newId,
      id: newId,
      slug: `${original.slug}-copy`,
      title: `${original.title} (Copy)`,
      isHome: false,
      blocks: (original.blocks || []).map((b) => ({ ...b, _id: uuid(), id: `b-${newId}-${uuid().slice(0, 4)}` })),
      order: all.pages?.length || 0,
    };
    all.pages.push(copy);
    res.status(201).json({ page: copy });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/pages/:id
router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.pages?.findIndex((p) => p._id === req.params.id || p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Page not found" });
    if (all.pages[idx].isHome) return res.status(400).json({ error: "Cannot delete home page" });
    const [removed] = all.pages.splice(idx, 1);
    res.json({ ok: true, page: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pages/:id/reorder
router.post("/:id/reorder", async (req, res) => {
  try {
    const { blockIds } = req.body;
    if (!Array.isArray(blockIds)) return res.status(400).json({ error: "blockIds required" });
    const all = getMemory();
    const page = all.pages?.find((p) => p._id === req.params.id || p.id === req.params.id);
    if (!page) return res.status(404).json({ error: "Page not found" });
    const blocksById = new Map((page.blocks || []).map((b) => [b._id || b.id, b]));
    page.blocks = blockIds.map((id, i) => ({ ...(blocksById.get(id) || {}), order: i }));
    page.updatedAt = new Date().toISOString();
    res.json({ page });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/pages/import
router.post("/import", async (req, res) => {
  try {
    const { pages, replace } = req.body;
    if (!Array.isArray(pages)) return res.status(400).json({ error: "pages array required" });
    const all = getMemory();
    if (replace) all.pages = [];
    pages.forEach((p, i) => {
      const id = p._id || p.id || uuid();
      all.pages.push({ ...p, _id: id, id, order: all.pages?.length || i });
    });
    res.json({ ok: true, count: pages.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/pages/export
router.get("/export/all", async (_req, res) => {
  try {
    const pages = await findAll("Page", {}, "pages");
    res.setHeader("Content-Disposition", `attachment; filename="wp-pages-${Date.now()}.json"`);
    res.json({ pages, exportedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as pagesRouter };
