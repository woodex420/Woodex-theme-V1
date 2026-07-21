import { Router } from "express";
import { getHeaderFooter, getDefaultHeaderFooter, getMemory } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin"));

// Public read endpoint (no auth) for the live site
export const publicHeaderFooterRouter = Router();
publicHeaderFooterRouter.get("/", async (_req, res) => {
  try {
    const config = await getHeaderFooter();
    res.json({ config });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const config = await getHeaderFooter();
    res.json({ config });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const all = getMemory();
    if (!all.headerFooter) all.headerFooter = await getHeaderFooter();
    all.headerFooter = { ...all.headerFooter, ...req.body };
    res.json({ config: all.headerFooter });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/reset", async (_req, res) => {
  try {
    const all = getMemory();
    all.headerFooter = getDefaultHeaderFooter();
    res.json({ config: all.headerFooter });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as headerFooterRouter };
