import { Router } from "express";
import { v4 as uuid } from "uuid";
import { findAll, findById, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "manager"));

router.get("/", async (_req, res) => {
  try {
    const items = await findAll("Agent", {}, "agents");
    res.json({ agents: items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const a = await findById("Agent", req.params.id, "agents");
    if (!a) return res.status(404).json({ error: "Not found" });
    res.json({ agent: a });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.agents) all.agents = [];
    const id = uuid();
    const newAgent = {
      _id: id,
      id,
      ...req.body,
      isOnline: req.body.isOnline || false,
      createdAt: new Date().toISOString(),
    };
    all.agents.push(newAgent);
    res.status(201).json({ agent: newAgent });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.agents?.findIndex((a) => a._id === req.params.id || a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    all.agents[idx] = { ...all.agents[idx], ...req.body };
    res.json({ agent: all.agents[idx] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.agents?.findIndex((a) => a._id === req.params.id || a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.agents.splice(idx, 1);
    res.json({ ok: true, agent: removed });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as agentsRouter };
