/**
 * Woodex Interior Backend
 * Express + Socket.IO + in-memory store (MongoDB-ready)
 *
 * Public endpoints (no auth):
 *   POST  /api/inquiries          → submit lead (rate-limited, honeypot-checked)
 *   GET   /api/services           → list services
 *   GET   /api/services/:slug     → service by slug
 *   GET   /api/projects           → list projects
 *   GET   /api/projects/:slug     → project by slug
 *   GET   /api/blog               → list blog posts
 *   GET   /api/blog/:slug         → blog post by slug
 *   GET   /api/articles           → list published articles
 *   GET   /api/articles/:slug     → article by slug
 *   POST  /api/auth/login         → JWT login
 *   GET   /api/health             → health check
 *
 * Admin endpoints (auth required, under /api/admin/):
 *   CRUD  /api/admin/services     → manage services
 *   CRUD  /api/admin/projects     → manage projects
 *   CRUD  /api/admin/blog         → manage blog posts
 *   CRUD  /api/admin/articles     → manage articles
 *   CRUD  /api/admin/pages        → manage pages
 *   CRUD  /api/admin/blocks       → manage blocks
 *   CRUD  /api/admin/media        → manage media
 *   CRUD  /api/admin/leads        → manage leads
 *   CRUD  /api/admin/conversations→ manage conversations
 *   CRUD  /api/admin/agents       → manage agents
 *   CRUD  /api/admin/templates    → manage templates
 *   CRUD  /api/admin/settings     → manage settings
 *   CRUD  /api/admin/theme        → manage theme
 *   CRUD  /api/admin/header-footer→ manage header/footer
 *   POST  /api/admin/whatsapp/send→ send WhatsApp
 *   POST  /api/admin/llm/chat     → LLM agent chat
 *
 * WebSocket: real-time conversations, presence, builder sync
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";

import { initStore } from "./store.js";
import { initSocket } from "./socket.js";
import { authRouter } from "./routes/auth.js";
import { pagesRouter } from "./routes/pages.js";
import { blocksRouter } from "./routes/blocks.js";
import { servicesRouter, servicesAdminRouter } from "./routes/services.js";
import { projectsRouter, projectsAdminRouter } from "./routes/projects.js";
import { blogRouter, blogAdminRouter } from "./routes/blog.js";
import { articlesRouter, articlesAdminRouter } from "./routes/articles.js";
import { inquiriesRouter } from "./routes/inquiries.js";
import { mediaRouter } from "./routes/media.js";
import { leadsRouter } from "./routes/leads.js";
import { conversationsRouter } from "./routes/conversations.js";
import { agentsRouter } from "./routes/agents.js";
import { templatesRouter } from "./routes/templates.js";
import { settingsRouter } from "./routes/settings.js";
import { themeRouter } from "./routes/theme.js";
import { headerFooterRouter } from "./routes/headerFooter.js";
import { whatsappRouter } from "./routes/whatsapp.js";
import { llmRouter } from "./routes/llm.js";
import { seedDatabase } from "./seed.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

// ============ MIDDLEWARE ============
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "*",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", apiLimiter);

// Stricter rate limit for inquiry submissions
const inquiryLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many submissions. Please try again later." },
});

// ============ STATIC FILES (uploads) ============
app.use("/uploads", express.static(process.env.UPLOAD_DIR || "./uploads"));

// ============ SOCKET.IO ============
const io = new SocketServer(httpServer, {
  cors: { origin: process.env.CLIENT_ORIGIN || "*", credentials: true },
});

initSocket(io);

// ============ HEALTH CHECK ============
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ============ PUBLIC ROUTES (no auth) ============
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/blog", blogRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/inquiries", inquiryLimiter, inquiriesRouter);

// ============ ADMIN ROUTES (auth required) ============
app.use("/api/admin/services", servicesAdminRouter);
app.use("/api/admin/projects", projectsAdminRouter);
app.use("/api/admin/blog", blogAdminRouter);
app.use("/api/admin/articles", articlesAdminRouter);
app.use("/api/admin/pages", pagesRouter);
app.use("/api/admin/blocks", blocksRouter);
app.use("/api/admin/media", mediaRouter);
app.use("/api/admin/leads", leadsRouter);
app.use("/api/admin/conversations", conversationsRouter);
app.use("/api/admin/agents", agentsRouter);
app.use("/api/admin/templates", templatesRouter);
app.use("/api/admin/settings", settingsRouter);
app.use("/api/admin/theme", themeRouter);
app.use("/api/admin/header-footer", headerFooterRouter);
app.use("/api/admin/whatsapp", whatsappRouter);
app.use("/api/admin/llm", llmRouter);

// ============ ERROR HANDLING ============
app.use((err, _req, res, _next) => {
  console.error("[error]", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Not found: ${req.method} ${req.url}` });
});

// ============ STARTUP ============
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await initStore();
    await seedDatabase();

    httpServer.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Woodex Interior API                   ║
║  Running on http://localhost:${PORT}    ║
║  Mode: ${process.env.NODE_ENV || "development"}                    ║
╚════════════════════════════════════════╝
      `);
    });
  } catch (e) {
    console.error("Failed to start server:", e);
    process.exit(1);
  }
}

start();
