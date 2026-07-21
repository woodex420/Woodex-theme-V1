/**
 * LLM Agent integration (OpenAI-compatible)
 * Provides AI-powered content generation for the admin
 */

import { Router } from "express";
import { authRequired, authRole } from "../middleware.js";
import { getSettings } from "../store.js";

const router = Router();
router.use(authRequired);
router.use(authRole("admin", "manager"));

/**
 * Call OpenAI API (or compatible endpoint)
 */
async function callLLM(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Set OPENAI_API_KEY in .env");
  }
  const model = options.model || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1000,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || "LLM API error");
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ============= LLM ROUTES =============

/**
 * POST /api/llm/chat
 * Body: { messages: [{ role, content }], systemPrompt?: string, model?: string }
 */
router.post("/chat", async (req, res) => {
  try {
    const { messages = [], systemPrompt, model } = req.body;
    const fullMessages = [];
    if (systemPrompt) fullMessages.push({ role: "system", content: systemPrompt });
    fullMessages.push(...messages);
    const text = await callLLM(fullMessages, { model });
    res.json({ text, model: model || "gpt-4o-mini" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/llm/generate-content
 * Generate blog post, project description, or social media copy
 */
router.post("/generate-content", async (req, res) => {
  try {
    const { type, topic, tone, keywords, length, model } = req.body;
    if (!type || !topic) return res.status(400).json({ error: "type and topic required" });

    const prompts = {
      "blog-post": `You are a senior interior designer writing for a Pakistani interior design studio called "WP Interior". Write a ${length || 800}-word blog post about: ${topic}. Tone: ${tone || "professional yet warm"}. Keywords to include: ${keywords || "interior design, Pakistan, Lahore"}. Structure: engaging intro, 3-4 subheadings, actionable tips, conclusion with a soft CTA. Use HTML formatting (h2, h3, p, ul, li).`,

      "project-description": `You are writing project descriptions for "WP Interior Studio" portfolio. Write a ${length || 200}-word description for a project: ${topic}. Tone: ${tone || "professional and aspirational"}. Keywords: ${keywords || ""}. Focus on: design concept, materials used, client's challenge, solution, outcome.`,

      "social-media": `You are writing social media posts for "WP Interior Studio" (interior design, Pakistan). Write a ${length || 100}-word post about: ${topic}. Tone: ${tone || "inspiring"}. Include 3-5 hashtags. Platforms: ${keywords || "Instagram, LinkedIn, Pinterest"}.`,

      "service-description": `Write a ${length || 150}-word description for an interior design service: ${topic}. Tone: ${tone || "professional"}. Highlight: what the service includes, who it's for, what makes it unique. Keywords: ${keywords || ""}.`,

      "testimonial-request": `Write a friendly WhatsApp message asking a past client for a short testimonial about their ${topic} project with WP Interior. Tone: warm, personal, not pushy. Max 80 words.`,

      "follow-up": `Write a polite follow-up WhatsApp message to a lead who enquired about ${topic} but hasn't replied in 3 days. Tone: helpful, not pushy. Max 60 words.`,
    };

    const prompt = prompts[type] || prompts["blog-post"];
    const text = await callLLM([
      { role: "system", content: "You are a helpful assistant for WP Interior Studio, a premium interior design company in Pakistan." },
      { role: "user", content: prompt },
    ], { model, maxTokens: length > 1000 ? 2000 : 1000 });

    res.json({ content: text, type, model: model || "gpt-4o-mini" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * POST /api/llm/auto-reply
 * Generate an AI reply to a customer message
 */
router.post("/auto-reply", async (req, res) => {
  try {
    const { customerMessage, context } = req.body;
    if (!customerMessage) return res.status(400).json({ error: "customerMessage required" });
    const text = await callLLM([
      {
        role: "system",
        content: `You are a friendly, professional customer service agent for WP Interior Studio, a premium interior design company in Pakistan. Help the customer with their inquiry concisely (max 80 words). Use a warm, professional tone. If they ask for pricing or a quote, suggest booking a free consultation. Context: ${context || "WhatsApp conversation"}`,
      },
      { role: "user", content: customerMessage },
    ], { temperature: 0.8, maxTokens: 200 });
    res.json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/**
 * GET /api/llm/status
 */
router.get("/status", async (_req, res) => {
  try {
    const settings = await getSettings();
    res.json({
      enabled: settings.llmAgentEnabled,
      model: settings.llmAgentModel,
      apiKeyConfigured: !!process.env.OPENAI_API_KEY,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export { router as llmRouter };
