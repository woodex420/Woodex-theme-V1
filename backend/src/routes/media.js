import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";
import { getMemory, findById } from "../store.js";
import { authRequired, authRole } from "../middleware.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "editor"));

// ============= MULTER SETUP =============
const uploadDir = process.env.UPLOAD_DIR || "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_UPLOAD_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|avif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ============= ROUTES =============
router.get("/", async (_req, res) => {
  try {
    const all = getMemory();
    res.json({ media: all.media || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/upload", upload.array("files", 20), async (req, res) => {
  try {
    const all = getMemory();
    if (!all.media) all.media = [];
    const files = req.files || [];
    const uploaded = files.map((f) => ({
      _id: uuid(),
      id: uuid(),
      url: `/uploads/${f.filename}`,
      name: f.originalname,
      size: f.size,
      type: f.mimetype,
      uploadedAt: new Date().toISOString(),
    }));
    all.media.push(...uploaded);
    res.status(201).json({ media: uploaded });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/upload-base64", async (req, res) => {
  try {
    const { name, dataUrl, type } = req.body;
    if (!dataUrl) return res.status(400).json({ error: "dataUrl required" });
    // Extract base64
    const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return res.status(400).json({ error: "Invalid data URL" });
    const ext = match[1].split("/")[1] || "png";
    const filename = `${uuid()}.${ext}`;
    const buffer = Buffer.from(match[2], "base64");
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    const all = getMemory();
    if (!all.media) all.media = [];
    const media = {
      _id: uuid(),
      id: uuid(),
      url: `/uploads/${filename}`,
      name: name || filename,
      size: buffer.length,
      type: type || match[1],
      uploadedAt: new Date().toISOString(),
    };
    all.media.push(media);
    res.status(201).json({ media: [media] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const all = getMemory();
    const idx = all.media?.findIndex((m) => m._id === req.params.id || m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Not found" });
    const [removed] = all.media.splice(idx, 1);
    // Optionally remove file from disk
    if (removed.url?.startsWith("/uploads/")) {
      const filePath = path.join(uploadDir, path.basename(removed.url));
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch { /* ignore */ }
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as mediaRouter };
