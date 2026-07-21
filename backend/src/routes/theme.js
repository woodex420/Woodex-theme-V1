import { Router } from "express";
import { getTheme, getDefaultTheme, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin"));

router.get("/", async (_req, res) => {
  try {
    const theme = await getTheme();
    res.json({ theme });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.theme) all.theme = await getTheme();
    all.theme = { ...all.theme, ...req.body };
    res.json({ theme: all.theme });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/reset", async (_req, res) => {
  try {
    const all = getMemory();
    all.theme = getDefaultTheme();
    res.json({ theme: all.theme });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as themeRouter };
