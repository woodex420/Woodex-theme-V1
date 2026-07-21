/**
 * Auth middleware
 */

import jwt from "jsonwebtoken";
import { findOne, getMemory } from "./store.js";

const JWT_SECRET = process.env.JWT_SECRET || "wp-interior-dev-secret";

export function signToken(user) {
  return jwt.sign(
    { id: user._id || user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function authRequired(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const decoded = verifyToken(auth.slice(7));
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  // Attach user
  const user = await findOne("User", { _id: decoded.id }, "users");
  if (!user) return res.status(401).json({ error: "User not found" });
  req.user = user;
  next();
}

export function authRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Authentication required" });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
}
