import { Router } from "express";
import { getSettings, getDefaultSettings, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin"));

router.get("/", async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json({ settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.settings) all.settings = await getSettings();
    all.settings = { ...all.settings, ...req.body };
    res.json({ settings: all.settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/reset", async (_req, res) => {
  try {
    const all = getMemory();
    all.settings = getDefaultSettings();
    res.json({ settings: all.settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/import", (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings) return res.status(400).json({ error: "settings required" });
    const all = getMemory();
    all.settings = { ...all.settings, ...settings };
    res.json({ settings: all.settings });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/export", async (_req, res) => {
  try {
    const settings = await getSettings();
    res.setHeader("Content-Disposition", `attachment; filename="wp-settings-${Date.now()}.json"`);
    res.json({ settings, exportedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as settingsRouter };
