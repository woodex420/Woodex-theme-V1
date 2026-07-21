// Live Support System - WhatsApp integration, message templates, agent queue

import { useState } from "react";

export type SupportChannel = "whatsapp" | "email" | "sms" | "live-chat";

export type MessageTemplate = {
  id: string;
  name: string;
  channel: SupportChannel;
  subject?: string;
  body: string;
  variables: string[]; // e.g. ["name", "service", "date"]
  category: "greeting" | "follow-up" | "thank-you" | "reminder" | "general";
  isActive: boolean;
};

export type SupportAgent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "lead-agent" | "senior-agent" | "manager";
  whatsappNumber: string;
  isOnline: boolean;
  avatar?: string;
  specialties: string[];
};

export type SupportConversation = {
  id: string;
  channel: SupportChannel;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  service?: string;
  status: "queued" | "active" | "resolved" | "spam";
  priority: "low" | "normal" | "high" | "urgent";
  assignedAgent?: string;
  messages: {
    id: string;
    from: "customer" | "agent" | "system";
    text: string;
    timestamp: string;
    read: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
  source: string; // "contact-form" | "whatsapp" | "live-chat"
};

const TEMPLATES_KEY = "wp-support-templates-v1";
const AGENTS_KEY = "wp-support-agents-v1";
const CONVERSATIONS_KEY = "wp-support-conversations-v1";
const SETTINGS_KEY = "wp-support-settings-v1";

const defaultTemplates: MessageTemplate[] = [
  {
    id: "t-1",
    name: "Welcome Greeting",
    channel: "whatsapp",
    body: "Hi {{name}}! 👋 Welcome to WP Interior Studio. Thanks for your interest in our {{service}} services. How can we help you today?",
    variables: ["name", "service"],
    category: "greeting",
    isActive: true,
  },
  {
    id: "t-2",
    name: "Initial Response",
    channel: "whatsapp",
    body: "Hi {{name}}, thanks for reaching out about {{service}}. We'd love to schedule a free 30-minute consultation with you. Are you available this week?",
    variables: ["name", "service"],
    category: "greeting",
    isActive: true,
  },
  {
    id: "t-3",
    name: "Follow-up After Consultation",
    channel: "whatsapp",
    body: "Hi {{name}}, thanks for our consultation on {{date}}. As promised, here's the proposal for your {{service}} project. Let me know if you have any questions!",
    variables: ["name", "date", "service"],
    category: "follow-up",
    isActive: true,
  },
  {
    id: "t-4",
    name: "Proposal Reminder",
    channel: "whatsapp",
    body: "Hi {{name}}! Just checking in on the {{service}} proposal we sent on {{date}}. Happy to answer any questions or jump on a quick call.",
    variables: ["name", "service", "date"],
    category: "reminder",
    isActive: true,
  },
  {
    id: "t-5",
    name: "Project Kickoff Confirmation",
    channel: "whatsapp",
    body: "🎉 Exciting news {{name}}! Your {{service}} project kicks off on {{date}}. We'll be in touch with the first deliverables within 48 hours. Welcome aboard!",
    variables: ["name", "service", "date"],
    category: "thank-you",
    isActive: true,
  },
  {
    id: "t-6",
    name: "Thank You After Project",
    channel: "whatsapp",
    body: "Hi {{name}}, it's been a pleasure working on your {{service}} project! If you're happy with the result, we'd love a quick review. Thanks again! 🙏",
    variables: ["name", "service"],
    category: "thank-you",
    isActive: true,
  },
  {
    id: "t-7",
    name: "Email - Quote Ready",
    channel: "email",
    subject: "Your {{service}} quote from WP Interior is ready",
    body: "Hi {{name}},\n\nThank you for your interest in WP Interior Studio. Your detailed quote for the {{service}} project is now ready.\n\nPlease find it attached. If you have any questions, feel free to reply to this email or schedule a call at your convenience.\n\nBest regards,\nThe WP Interior Team",
    variables: ["name", "service"],
    category: "general",
    isActive: true,
  },
  {
    id: "t-8",
    name: "Quick Response",
    channel: "whatsapp",
    body: "Thanks {{name}}! Looking into this for you. Will get back to you shortly. 👍",
    variables: ["name"],
    category: "general",
    isActive: true,
  },
];

const defaultAgents: SupportAgent[] = [
  {
    id: "a-1",
    name: "Hassan Raza",
    email: "hassan@wpinterior.com",
    phone: "+92 300 1234567",
    role: "lead-agent",
    whatsappNumber: "923001234567",
    isOnline: true,
    specialties: ["Office Design", "Commercial"],
  },
  {
    id: "a-2",
    name: "Aaliyah Bennett",
    email: "aaliyah@wpinterior.com",
    phone: "+92 321 9876543",
    role: "senior-agent",
    whatsappNumber: "923219876543",
    isOnline: true,
    specialties: ["Residential", "3D Visualization"],
  },
  {
    id: "a-3",
    name: "Sara Ahmed",
    email: "sara@wpinterior.com",
    phone: "+92 333 1112233",
    role: "senior-agent",
    whatsappNumber: "923331112233",
    isOnline: false,
    specialties: ["Restaurant", "Cafe", "Hospitality"],
  },
  {
    id: "a-4",
    name: "Elena Marchetti",
    email: "elena@wpinterior.com",
    phone: "+92 300 9998877",
    role: "manager",
    whatsappNumber: "923009998877",
    isOnline: true,
    specialties: ["All"],
  },
];

const defaultConversations: SupportConversation[] = [
  {
    id: "c-1",
    channel: "whatsapp",
    customerName: "Aaliya Khan",
    customerPhone: "+92 300 1234567",
    service: "Office Interior Design",
    status: "active",
    priority: "high",
    assignedAgent: "a-1",
    messages: [
      { id: "m-1", from: "customer", text: "Hi, I'm interested in office design for our 8,000 sq ft space in Gulberg.", timestamp: "2025-03-18T09:30:00Z", read: true },
      { id: "m-2", from: "agent", text: "Hi Aaliya! Thanks for reaching out. We'd love to help. Could you share some reference images and your timeline?", timestamp: "2025-03-18T09:35:00Z", read: true },
      { id: "m-3", from: "customer", text: "Sure, I'll send them over. Timeline is about 2-3 months.", timestamp: "2025-03-18T09:40:00Z", read: false },
    ],
    createdAt: "2025-03-18T09:30:00Z",
    updatedAt: "2025-03-18T09:40:00Z",
    source: "contact-form",
  },
  {
    id: "c-2",
    channel: "whatsapp",
    customerName: "Hamza Sheikh",
    customerPhone: "+92 321 9876543",
    service: "Cafe Interior Design",
    status: "queued",
    priority: "normal",
    messages: [
      { id: "m-1", from: "customer", text: "We're launching a specialty cafe in DHA Phase 5. Looking for a full design package. What are your rates?", timestamp: "2025-03-17T14:22:00Z", read: false },
    ],
    createdAt: "2025-03-17T14:22:00Z",
    updatedAt: "2025-03-17T14:22:00Z",
    source: "whatsapp",
  },
  {
    id: "c-3",
    channel: "email",
    customerName: "Bilal Hussain",
    customerEmail: "bilal@digitalwave.pk",
    service: "Software House Interior",
    status: "queued",
    priority: "urgent",
    messages: [
      { id: "m-1", from: "customer", text: "Our tech company is moving to a new 12,000 sq ft office. We want a modern, employee-friendly design with focus pods and collaboration zones.", timestamp: "2025-03-19T16:10:00Z", read: false },
    ],
    createdAt: "2025-03-19T16:10:00Z",
    updatedAt: "2025-03-19T16:10:00Z",
    source: "contact-form",
  },
];

const defaultSettings = {
  whatsappAlertsEnabled: true,
  alertPhone: "+92 300 9998877",
  alertOnNewLead: true,
  alertOnNewConversation: true,
  alertOnUrgentPriority: true,
  autoAssignAgent: true,
  defaultAgentId: "a-1",
  businessHoursStart: "09:00",
  businessHoursEnd: "19:00",
  outOfHoursMessage: "Thanks for reaching out! Our team is currently offline. We'll respond to your message first thing in the morning. For urgent matters, please call +92 300 1234567.",
};

function load<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (!raw) {
      try {
        localStorage.setItem(key, JSON.stringify(fallback));
      } catch {
        // ignore
      }
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return { ...fallback, ...parsed };
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {
    // ignore
  }
}

export function useSupportStore() {
  const [templates, setTemplates] = useState<MessageTemplate[]>(() => {
    const loaded = load(TEMPLATES_KEY, defaultTemplates);
    return Array.isArray(loaded) ? loaded : defaultTemplates;
  });
  const [agents, setAgents] = useState<SupportAgent[]>(() => {
    const loaded = load(AGENTS_KEY, defaultAgents);
    return Array.isArray(loaded) ? loaded : defaultAgents;
  });
  const [conversations, setConversations] = useState<SupportConversation[]>(() => {
    const loaded = load(CONVERSATIONS_KEY, defaultConversations);
    return Array.isArray(loaded) ? loaded : defaultConversations;
  });
  const [settings, setSettings] = useState(() => load(SETTINGS_KEY, defaultSettings));

  // ==== TEMPLATES ====
  const addTemplate = (t: Omit<MessageTemplate, "id">) => {
    const id = `t-${Date.now()}`;
    setTemplates([...templates, { ...t, id }]);
    save(TEMPLATES_KEY, [...templates, { ...t, id }]);
  };
  const updateTemplate = (id: string, patch: Partial<MessageTemplate>) => {
    const next = templates.map((t) => t.id === id ? { ...t, ...patch } : t);
    setTemplates(next);
    save(TEMPLATES_KEY, next);
  };
  const deleteTemplate = (id: string) => {
    const next = templates.filter((t) => t.id !== id);
    setTemplates(next);
    save(TEMPLATES_KEY, next);
  };

  // ==== AGENTS ====
  const addAgent = (a: Omit<SupportAgent, "id">) => {
    const id = `a-${Date.now()}`;
    setAgents([...agents, { ...a, id }]);
    save(AGENTS_KEY, [...agents, { ...a, id }]);
  };
  const updateAgent = (id: string, patch: Partial<SupportAgent>) => {
    const next = agents.map((a) => a.id === id ? { ...a, ...patch } : a);
    setAgents(next);
    save(AGENTS_KEY, next);
  };
  const deleteAgent = (id: string) => {
    const next = agents.filter((a) => a.id !== id);
    setAgents(next);
    save(AGENTS_KEY, next);
  };
  const toggleAgentOnline = (id: string) => {
    const next = agents.map((a) => a.id === id ? { ...a, isOnline: !a.isOnline } : a);
    setAgents(next);
    save(AGENTS_KEY, next);
  };

  // ==== CONVERSATIONS ====
  const addConversation = (c: Omit<SupportConversation, "id" | "createdAt" | "updatedAt" | "messages">) => {
    const id = `c-${Date.now()}`;
    const now = new Date().toISOString();
    const newConv: SupportConversation = {
      ...c,
      id,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    const next = [newConv, ...conversations];
    setConversations(next);
    save(CONVERSATIONS_KEY, next);
    // Trigger WhatsApp alert
    if (settings.whatsappAlertsEnabled && settings.alertOnNewConversation) {
      sendWhatsAppAlert(`🔔 New conversation from ${c.customerName} about ${c.service || "general inquiry"}`, settings.alertPhone);
    }
    return id;
  };
  const updateConversation = (id: string, patch: Partial<SupportConversation>) => {
    const next = conversations.map((c) => c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString() } : c);
    setConversations(next);
    save(CONVERSATIONS_KEY, next);
  };
  const deleteConversation = (id: string) => {
    const next = conversations.filter((c) => c.id !== id);
    setConversations(next);
    save(CONVERSATIONS_KEY, next);
  };
  const addMessage = (convId: string, message: Omit<SupportConversation["messages"][number], "id" | "timestamp" | "read">) => {
    const next = conversations.map((c) => {
      if (c.id !== convId) return c;
      return {
        ...c,
        messages: [...c.messages, {
          ...message,
          id: `m-${Date.now()}`,
          timestamp: new Date().toISOString(),
          read: message.from === "agent",
        }],
        updatedAt: new Date().toISOString(),
      };
    });
    setConversations(next);
    save(CONVERSATIONS_KEY, next);
  };
  const assignAgent = (convId: string, agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) return;
    updateConversation(convId, { assignedAgent: agentId, status: "active" });
  };

  // ==== SETTINGS ====
  const updateSettings = (patch: Partial<typeof settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    save(SETTINGS_KEY, next);
  };

  // ==== TEMPLATE RENDERING ====
  const renderTemplate = (templateId: string, variables: Record<string, string>): string => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return "";
    let body = template.body;
    template.variables.forEach((v) => {
      const value = variables[v] || `{{${v}}}`;
      body = body.replace(new RegExp(`{{\\s*${v}\\s*}}`, "g"), value);
    });
    return body;
  };

  return {
    templates,
    agents,
    conversations,
    settings,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addAgent,
    updateAgent,
    deleteAgent,
    toggleAgentOnline,
    addConversation,
    updateConversation,
    deleteConversation,
    addMessage,
    assignAgent,
    updateSettings,
    renderTemplate,
  };
}

export type SupportStoreApi = ReturnType<typeof useSupportStore>;

// ==== HELPER: Send WhatsApp Alert ====
export function sendWhatsAppAlert(message: string, phone: string) {
  // In a real production app, this would call the WhatsApp Business API
  // For the demo, we open WhatsApp Web with the pre-filled message
  const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  // Don't actually open in the demo - just log
  if (typeof console !== "undefined") {
    console.log("[WhatsApp Alert]", { to: phone, message, url });
  }
  return url;
}

// ==== HELPER: Open WhatsApp conversation with customer ====
export function openWhatsAppChat(phone: string, message?: string) {
  const cleanPhone = phone.replace(/[^0-9+]/g, "").replace(/^\+/, "");
  const url = message
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${cleanPhone}`;
  window.open(url, "_blank", "noopener,noreferrer");
}
