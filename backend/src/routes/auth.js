import { Router } from "express";
import bcrypt from "bcryptjs";
import { findOne, create, getMemory } from "../store.js";
import { signToken, authRequired } from "../middleware.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }
    // Find user (case-insensitive)
    const all = getMemory().users || [];
    const user = all.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Compare password - support both bcrypt hashes and "demo:" prefixed plain passwords
    let valid = false;
    if (user.passwordHash?.startsWith("$2")) {
      valid = await bcrypt.compare(password, user.passwordHash);
    } else if (user.passwordHash?.startsWith("demo:")) {
      valid = user.passwordHash === `demo:${password}`;
    }
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    // Update last login
    const idx = all.findIndex((u) => u._id === user._id);
    if (idx >= 0) all[idx].lastLogin = new Date().toISOString();

    const token = signToken(user);
    const { passwordHash, ...safeUser } = user;
    res.json({ token, user: safeUser });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/me", authRequired, (req, res) => {
  const { passwordHash, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

router.post("/logout", (req, res) => {
  res.json({ ok: true });
});

export { router as authRouter };
