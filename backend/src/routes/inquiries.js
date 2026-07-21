/**
 * Woodex Interior — Public Inquiry Submission
 * Accepts the frontend's InquiryPayload format and creates a lead.
 * No auth required — rate limited via server.js apiLimiter.
 */

import { Router } from "express";
import { v4 as uuid } from "uuid";
import { getMemory } from "../store.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    // Honeypot check — if filled, silently ignore (bot)
    if (req.body._honeypot) {
      return res.json({
        success: true,
        inquiry_id: `INQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        message: "Your inquiry has been received. Woodex Interior will contact you shortly.",
      });
    }

    const {
      full_name,
      phone,
      email,
      project_type,
      project_location,
      area,
      services,
      start_date,
      budget,
      message,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
    } = req.body;

    // Validation
    if (!full_name || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, phone and email are required.",
      });
    }

    const all = getMemory();
    if (!all.leads) all.leads = [];

    const inquiryId = `INQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const lead = {
      _id: uuid(),
      id: inquiryId,
      name: full_name,
      phone,
      email,
      project_type: project_type || "",
      project_location: project_location || "",
      area: area || "",
      services: services || [],
      start_date: start_date || "",
      budget: budget || "",
      message: message || "",
      source_page: source_page || "",
      utm_source: utm_source || "",
      utm_medium: utm_medium || "",
      utm_campaign: utm_campaign || "",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    all.leads.unshift(lead);

    console.log(`[inquiry] New lead: ${full_name} (${email}) — ${project_type || "N/A"}`);

    res.status(201).json({
      success: true,
      inquiry_id: inquiryId,
      message: "Your inquiry has been received. Woodex Interior will contact you shortly.",
    });
  } catch (e) {
    console.error("[inquiry] Error:", e);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again or contact us directly.",
    });
  }
});

export { router as inquiriesRouter };
