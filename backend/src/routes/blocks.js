import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getMemory, findById } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "editor"));

// GET /api/blocks?pageId=xxx
router.get("/", async (req, res) => {
  try {
    const { pageId } = req.query;
    if (!pageId) return res.status(400).json({ error: "pageId required" });
    const page = await findById("Page", pageId, "pages");
    if (!page) return res.status(404).json({ error: "Page not found" });
    res.json({ blocks: page.blocks || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/blocks  - create block
router.post("/", async (req, res) => {
  try {
    const { pageId, type, title, props, styles, visibility } = req.body;
    if (!pageId || !type) return res.status(400).json({ error: "pageId and type required" });
    const all = getMemory();
    const page = all.pages?.find((p) => p._id === pageId || p.id === pageId);
    if (!page) return res.status(404).json({ error: "Page not found" });
    if (!page.blocks) page.blocks = [];
    const id = uuid();
    const order = (page.blocks[page.blocks.length - 1]?.order ?? -1) + 1;
    const newBlock = { _id: id, id, type, title: title || "New Block", visible: true, order, props: props || {}, styles: styles || {}, visibility };
    page.blocks.push(newBlock);
    page.updatedAt = new Date().toISOString();
    res.status(201).json({ block: newBlock });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/blocks/:id
router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    for (const page of all.pages || []) {
      const idx = (page.blocks || []).findIndex((b) => b._id === req.params.id || b.id === req.params.id);
      if (idx >= 0) {
        page.blocks[idx] = { ...page.blocks[idx], ...req.body, updatedAt: new Date().toISOString() };
        page.updatedAt = new Date().toISOString();
        return res.json({ block: page.blocks[idx] });
      }
    }
    res.status(404).json({ error: "Block not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/blocks/:id
router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    for (const page of all.pages || []) {
      const idx = (page.blocks || []).findIndex((b) => b._id === req.params.id || b.id === req.params.id);
      if (idx >= 0) {
        const [removed] = page.blocks.splice(idx, 1);
        page.updatedAt = new Date().toISOString();
        return res.json({ ok: true, block: removed });
      }
    }
    res.status(404).json({ error: "Block not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/blocks/:id/duplicate
router.post("/:id/duplicate", async (req, res) => {
  try {
    const all = getMemory();
    for (const page of all.pages || []) {
      const idx = (page.blocks || []).findIndex((b) => b._id === req.params.id || b.id === req.params.id);
      if (idx >= 0) {
        const original = page.blocks[idx];
        const id = uuid();
        const newBlock = { ...original, _id: id, id: id, order: original.order + 0.5, title: `${original.title} (Copy)` };
        page.blocks.push(newBlock);
        page.blocks.sort((a, b) => a.order - b.order).forEach((b, i) => b.order = i);
        return res.status(201).json({ block: newBlock });
      }
    }
    res.status(404).json({ error: "Block not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/blocks/:id/move
router.post("/:id/move", async (req, res) => {
  try {
    const { direction } = req.body; // "up" | "down"
    const all = getMemory();
    for (const page of all.pages || []) {
      const idx = (page.blocks || []).findIndex((b) => b._id === req.params.id || b.id === req.params.id);
      if (idx >= 0) {
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= page.blocks.length) return res.status(400).json({ error: "Cannot move" });
        [page.blocks[idx], page.blocks[newIdx]] = [page.blocks[newIdx], page.blocks[idx]];
        page.blocks.forEach((b, i) => b.order = i);
        return res.json({ block: page.blocks[newIdx] });
      }
    }
    res.status(404).json({ error: "Block not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/blocks/:id/toggle-visibility
router.post("/:id/toggle-visibility", async (req, res) => {
  try {
    const all = getMemory();
    for (const page of all.pages || []) {
      const idx = (page.blocks || []).findIndex((b) => b._id === req.params.id || b.id === req.params.id);
      if (idx >= 0) {
        page.blocks[idx].visible = !page.blocks[idx].visible;
        return res.json({ block: page.blocks[idx] });
      }
    }
    res.status(404).json({ error: "Block not found" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as blocksRouter };
