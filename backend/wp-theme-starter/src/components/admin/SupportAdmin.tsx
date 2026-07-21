// Support Admin - Live Support Queue, Agents, Message Templates

import { useState, useMemo, useEffect, useRef } from "react";
import {
  PageHeader,
  Button,
  Modal,
  FormField,
  TextInput,
  TextareaInput,
  SelectInput,
  EmptyState,
} from "./AdminLayout";
import { useSupportStore, openWhatsAppChat, sendWhatsAppAlert, type MessageTemplate, type SupportAgent, type SupportConversation, type SupportChannel } from "../../lib/supportStore";
import { formatDistanceToNow } from "../../lib/dateUtils";
import {
  IconPlus,
  IconTrash,
  IconCheck,
  IconWhatsapp,
  IconDownload,
  IconUpload,
  IconCopy,
  IconClose,
  IconArrowRight,
} from "../Icons";
import { cn } from "../../utils/cn";

export function SupportAdmin() {
  const [tab, setTab] = useState<"queue" | "agents" | "templates" | "settings">("queue");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Support"
        description="Manage WhatsApp conversations, agent availability, and message templates."
      />

      <div className="card p-1.5 flex gap-1 max-w-2xl">
        {[
          { id: "queue", label: "Support Queue", icon: "📥" },
          { id: "agents", label: "Agents", icon: "👥" },
          { id: "templates", label: "Message Templates", icon: "💬" },
          { id: "settings", label: "Settings", icon: "⚙️" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as never)}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2",
              tab === t.id ? "bg-espresso text-white shadow-md" : "text-text-gray hover:bg-cream-50"
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "queue" && <SupportQueue />}
      {tab === "agents" && <AgentsManager />}
      {tab === "templates" && <TemplatesManager />}
      {tab === "settings" && <SupportSettings />}
    </div>
  );
}

// ============= SUPPORT QUEUE =============
function SupportQueue() {
  const support = useSupportStore();
  const conversations = Array.isArray(support.conversations) ? support.conversations : [];
  const agents = Array.isArray(support.agents) ? support.agents : [];
  const templates = Array.isArray(support.templates) ? support.templates : [];
  const { addMessage, updateConversation, assignAgent } = support;
  const [filter, setFilter] = useState<"all" | "queued" | "active" | "resolved">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const filtered = useMemo(() => {
    return conversations
      .filter((c) => c && (filter === "all" || c.status === filter))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [conversations, filter]);

  const selected = conversations.find((c) => c.id === selectedId);

  const sendReply = () => {
    if (!selected || !replyText.trim()) return;
    addMessage(selected.id, { from: "agent", text: replyText });
    setReplyText("");
    updateConversation(selected.id, { status: "active" });
  };

    const useTemplate = (templateId: string) => {
    if (!selected) return;
    const text = support.renderTemplate(templateId, {
      name: (selected.customerName || "there").split(" ")[0],
      service: selected.service || "your project",
      date: new Date().toLocaleDateString(),
    });
    setReplyText(text);
    setShowTemplatePicker(false);
  };

  const openWhatsApp = (conv: SupportConversation) => {
    if (!conv.customerPhone) {
      alert("No phone number for this customer");
      return;
    }
    const agent = agents.find((a) => a.id === conv.assignedAgent);
    const message = agent ? `Hi ${conv.customerName.split(" ")[0]}, ${agent.name} from WP Interior here. ` : "";
    openWhatsAppChat(conv.customerPhone, message);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Conversation list */}
      <div className="card overflow-hidden">
        <div className="p-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            {["all", "queued", "active", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as never)}
                className={cn(
                  "px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold rounded-md",
                  filter === f ? "bg-espresso text-white" : "text-text-gray hover:bg-cream-50"
                )}
              >
                {f} ({f === "all" ? conversations.length : conversations.filter((c) => c && c.status === f).length})
              </button>
            ))}
          </div>
        </div>
        <div className="max-h-[700px] overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <EmptyState title="No conversations" message="Conversations from WhatsApp, email, and the contact form will appear here." />
          ) : (
            filtered.map((c) => {
              const lastMsg = c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;
              const agent = agents.find((a) => a.id === c.assignedAgent);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "w-full text-left p-3 hover:bg-cream-50/50 transition-colors flex items-start gap-3",
                    selectedId === c.id && "bg-gold/5 border-l-4 border-l-gold"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0",
                    c.channel === "whatsapp" ? "bg-[#25D366]" :
                    c.channel === "email" ? "bg-blue-500" :
                    c.channel === "sms" ? "bg-purple-500" : "bg-stone-500"
                  )}>
                    {c.channel === "whatsapp" ? <IconWhatsapp className="w-4 h-4" /> : <span className="text-xs font-semibold">{c.channel[0].toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-heading truncate">{c.customerName}</span>
                      {c.priority === "urgent" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold uppercase">Urgent</span>}
                      {c.priority === "high" && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold uppercase">High</span>}
                    </div>
                    <div className="text-[11px] text-text-gray line-clamp-1 mt-0.5">{lastMsg?.text || "No messages"}</div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-text-gray/70">
                      <span>{formatDistanceToNow(c.updatedAt)}</span>
                      {agent && <span>· {agent.name}</span>}
                    </div>
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded-full border",
                    c.status === "active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                    c.status === "queued" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    c.status === "resolved" ? "bg-stone-100 text-stone-600 border-stone-200" :
                    "bg-red-50 text-red-700 border-red-200"
                  )}>
                    {c.status}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Conversation view */}
      <div className="lg:col-span-2 card overflow-hidden flex flex-col" style={{ minHeight: 600 }}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-center p-8">
            <div>
              <div className="w-16 h-16 rounded-2xl bg-gold/15 flex items-center justify-center mx-auto mb-3">
                <IconWhatsapp className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-serif text-lg text-heading mb-1">Select a conversation</h3>
              <p className="text-sm text-text-gray">Choose a conversation from the queue to respond.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white",
                  selected.channel === "whatsapp" ? "bg-[#25D366]" : "bg-blue-500"
                )}>
                  <IconWhatsapp className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-serif text-base text-heading">{selected.customerName}</div>
                  <div className="text-[11px] text-text-gray flex items-center gap-2">
                    <span>{selected.customerPhone || selected.customerEmail}</span>
                    {selected.service && <span>· {selected.service}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SelectInput
                  value={selected.assignedAgent || ""}
                  onChange={(v) => assignAgent(selected.id, v)}
                  options={[
                    { value: "", label: "Unassigned" },
                    ...agents.filter((a) => a && a.isOnline).map((a) => ({ value: a.id, label: a.name })),
                  ]}
                />
                {selected.customerPhone && (
                  <Button size="sm" variant="primary" onClick={() => openWhatsApp(selected)}>
                    <IconWhatsapp className="w-3.5 h-3.5" />
                    Open in WhatsApp
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-cream-50/30" style={{ maxHeight: 500 }}>
              {(!selected.messages || selected.messages.length === 0) ? (
                <div className="text-center text-text-gray text-sm py-8">No messages yet.</div>
              ) : (
                (selected.messages || []).map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.from === "agent" ? "justify-end" : m.from === "system" ? "justify-center" : "justify-start"
                    )}
                  >
                    {m.from === "system" ? (
                      <div className="px-3 py-1.5 rounded-full bg-stone-200 text-stone-600 text-[10px]">
                        {m.text}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "max-w-[70%] p-3 rounded-2xl text-sm",
                          m.from === "agent"
                            ? "bg-gold text-espresso rounded-tr-sm"
                            : "bg-white border border-border text-heading rounded-tl-sm"
                        )}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{m.text}</p>
                        <p className={cn("text-[9px] mt-1", m.from === "agent" ? "text-espresso/60" : "text-text-gray/60")}>
                          {new Date(m.timestamp).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Reply */}
            <div className="p-4 border-t border-border bg-white">
              {showTemplatePicker && (
                <div className="mb-3 p-3 rounded-lg bg-cream-50 border border-border max-h-40 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-widest text-text-gray font-semibold">Pick a template</span>
                    <button onClick={() => setShowTemplatePicker(false)} className="text-text-gray hover:text-heading">
                      <IconClose className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {templates.filter((t) => t && t.isActive).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => useTemplate(t.id)}
                        className="w-full text-left p-2 rounded-md hover:bg-white text-sm"
                      >
                        <div className="text-[10px] uppercase tracking-widest text-gold font-bold">{t.category}</div>
                        <div className="text-heading">{t.name}</div>
                        <div className="text-[10px] text-text-gray line-clamp-1">{t.body}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply... (Cmd+Enter to send)"
                  rows={2}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      sendReply();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 resize-y"
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="ghost" onClick={() => setShowTemplatePicker(!showTemplatePicker)}>
                    Templates
                  </Button>
                  <Button size="sm" variant="primary" onClick={sendReply} disabled={!replyText.trim()}>
                    <IconArrowRight className="w-3.5 h-3.5" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============= AGENTS MANAGER =============
function AgentsManager() {
  const support = useSupportStore();
  const { agents, addAgent, updateAgent, deleteAgent, toggleAgentOnline } = support;
  const [editing, setEditing] = useState<SupportAgent | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing({
              id: "",
              name: "",
              email: "",
              phone: "",
              role: "lead-agent",
              whatsappNumber: "",
              isOnline: true,
              specialties: [],
            });
            setShowForm(true);
          }}
        >
          <IconPlus className="w-3.5 h-3.5" />
          New Agent
        </Button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-cream-50 border-b border-border">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Agent</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Contact</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Role</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Specialties</th>
              <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Status</th>
              <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest text-text-gray font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((a) => (
              <tr key={a.id} className="border-b border-border hover:bg-cream-50/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-sm">
                      {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-medium text-heading text-sm">{a.name}</div>
                      <div className="text-[10px] text-text-gray">{a.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-gray text-xs">
                  <div>{a.phone}</div>
                  <div className="text-[10px]">{a.whatsappNumber}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full border",
                    a.role === "manager" ? "bg-gold/20 text-gold border-gold/30" :
                    a.role === "senior-agent" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    "bg-stone-100 text-stone-700 border-stone-200"
                  )}>
                    {a.role.replace("-", " ")}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {a.specialties.map((s) => (
                      <span key={s} className="text-[9px] px-1.5 py-0.5 rounded bg-gold/10 text-gold">{s}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAgentOnline(a.id)}
                    className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold",
                      a.isOnline ? "text-emerald-600" : "text-text-gray"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full", a.isOnline ? "bg-emerald-500" : "bg-stone-300")} />
                    {a.isOnline ? "Online" : "Offline"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => { setEditing(a); setShowForm(true); }} className="w-8 h-8 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center">✏️</button>
                    <button onClick={() => { if (confirm(`Delete agent ${a.name}?`)) deleteAgent(a.id); }} className="w-8 h-8 rounded hover:bg-red-50 text-text-gray hover:text-red-600 flex items-center justify-center">
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && editing && (
        <AgentForm
          agent={editing}
          onSave={(data) => {
            if (editing.id) updateAgent(editing.id, data);
            else addAgent(data);
            setShowForm(false);
            setEditing(null);
          }}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

function AgentForm({ agent, onSave, onClose }: { agent: SupportAgent; onSave: (a: Omit<SupportAgent, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: agent.name,
    email: agent.email,
    phone: agent.phone,
    role: agent.role,
    whatsappNumber: agent.whatsappNumber,
    isOnline: agent.isOnline,
    specialties: agent.specialties,
  });
  const [specialtyInput, setSpecialtyInput] = useState("");

  return (
    <Modal open onClose={onClose} title={agent.id ? "Edit Agent" : "New Agent"} size="md">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" required>
            <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          </FormField>
          <FormField label="Email" required>
            <TextInput type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </FormField>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Phone">
            <TextInput value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+92 300 1234567" />
          </FormField>
          <FormField label="WhatsApp Number" hint="With country code, no +">
            <TextInput value={form.whatsappNumber} onChange={(v) => setForm({ ...form, whatsappNumber: v })} placeholder="923001234567" />
          </FormField>
        </div>
        <FormField label="Role">
          <SelectInput
            value={form.role}
            onChange={(v) => setForm({ ...form, role: v as SupportAgent["role"] })}
            options={[
              { value: "lead-agent", label: "Lead Agent" },
              { value: "senior-agent", label: "Senior Agent" },
              { value: "manager", label: "Manager" },
            ]}
          />
        </FormField>
        <FormField label="Specialties" hint="Press Enter to add">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {form.specialties.map((s) => (
                <span key={s} className="px-2 py-1 rounded bg-gold/10 text-gold text-xs flex items-center gap-1">
                  {s}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, specialties: form.specialties.filter((x) => x !== s) })}
                    className="hover:text-espresso"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (specialtyInput.trim() && !form.specialties.includes(specialtyInput.trim())) {
                    setForm({ ...form, specialties: [...form.specialties, specialtyInput.trim()] });
                    setSpecialtyInput("");
                  }
                }
              }}
              placeholder="Office Design, 3D Visualization..."
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </FormField>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isOnline}
            onChange={(e) => setForm({ ...form, isOnline: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Available Now</div>
            <div className="text-[11px] text-text-gray">Agent is online and accepting conversations</div>
          </div>
        </label>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {agent.id ? "Save" : "Add Agent"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= TEMPLATES MANAGER =============
function TemplatesManager() {
  const support = useSupportStore();
  const { templates, addTemplate, updateTemplate, deleteTemplate } = support;
  const [editing, setEditing] = useState<MessageTemplate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importText, setImportText] = useState("");

  const exportAll = () => {
    const data = JSON.stringify(templates, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wp-templates-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importAll = () => {
    try {
      const data = JSON.parse(importText);
      if (Array.isArray(data)) {
        data.forEach((t: MessageTemplate) => {
          if (t.name && t.body) {
            addTemplate(t);
          }
        });
        setImportText("");
        alert("Templates imported successfully");
      }
    } catch {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={exportAll}>
          <IconDownload className="w-3.5 h-3.5" />
          Export
        </Button>
        <Button variant="ghost" onClick={() => fileInputRef.current?.click()}>
          <IconUpload className="w-3.5 h-3.5" />
          Import
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => setImportText(ev.target?.result as string);
            reader.readAsText(file);
          }}
        />
        <Button
          onClick={() => {
            setEditing({
              id: "",
              name: "",
              channel: "whatsapp",
              body: "",
              variables: [],
              category: "general",
              isActive: true,
            });
            setShowForm(true);
          }}
        >
          <IconPlus className="w-3.5 h-3.5" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-serif text-lg text-heading">{t.name}</h3>
                  {t.isActive && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold uppercase">Active</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-gray">
                  <span className="px-1.5 py-0.5 rounded bg-gold/10 text-gold font-semibold uppercase tracking-widest">
                    {t.channel}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-100 text-text-gray font-semibold uppercase tracking-widest">
                    {t.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => updateTemplate(t.id, { isActive: !t.isActive })}
                className="w-8 h-8 rounded hover:bg-gold/15 text-text-gray hover:text-espresso flex items-center justify-center text-lg"
                title={t.isActive ? "Deactivate" : "Activate"}
              >
                {t.isActive ? "✅" : "⏸️"}
              </button>
            </div>
            {t.subject && (
              <div className="mb-2 text-xs">
                <span className="text-text-gray">Subject: </span>
                <span className="text-heading">{t.subject}</span>
              </div>
            )}
            <p className="text-sm text-text-gray leading-relaxed mb-3 line-clamp-3">{t.body}</p>
            {t.variables.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {t.variables.map((v) => (
                  <span key={v} className="text-[10px] px-1.5 py-0.5 rounded bg-cream-50 text-text-gray font-mono">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            )}
            <div className="flex gap-2 pt-3 border-t border-border">
              <Button size="sm" variant="ghost" onClick={() => { setEditing(t); setShowForm(true); }}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  navigator.clipboard.writeText(t.body);
                }}
              >
                <IconCopy className="w-3.5 h-3.5" />
                Copy
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm(`Delete "${t.name}"?`)) deleteTemplate(t.id); }}>
                <IconTrash className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && editing && (
        <TemplateForm
          template={editing}
          onSave={(data) => {
            if (editing.id) updateTemplate(editing.id, data);
            else addTemplate(data);
            setShowForm(false);
            setEditing(null);
          }}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {importText && (
        <Modal open onClose={() => setImportText("")} title="Import Templates" size="md">
          <p className="text-sm text-text-gray mb-3">Paste the imported JSON below and click Import.</p>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={8}
            className="w-full px-3 py-2 text-xs font-mono rounded-md border border-border bg-cream-50/50 mb-3"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setImportText("")}>Cancel</Button>
            <Button onClick={importAll} variant="primary">
              <IconCheck className="w-3.5 h-3.5" />
              Import Templates
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TemplateForm({ template, onSave, onClose }: { template: MessageTemplate; onSave: (t: Omit<MessageTemplate, "id">) => void; onClose: () => void }) {
  const [form, setForm] = useState({
    name: template.name,
    channel: template.channel,
    subject: template.subject,
    body: template.body,
    variables: template.variables,
    category: template.category,
    isActive: template.isActive,
  });
  const [varInput, setVarInput] = useState("");

  // Auto-detect variables from body
  useEffect(() => {
    const matches = form.body.match(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g) || [];
    const vars = matches.map((m) => m.replace(/[{}\s]/g, ""));
    const unique = Array.from(new Set([...form.variables, ...vars]));
    if (unique.length !== form.variables.length) {
      setForm({ ...form, variables: unique });
    }
  }, [form.body]);

  return (
    <Modal open onClose={onClose} title={template.id ? "Edit Template" : "New Template"} size="lg">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(form); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Template Name" required>
            <TextInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Welcome Greeting" />
          </FormField>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Channel">
              <SelectInput
                value={form.channel}
                onChange={(v) => setForm({ ...form, channel: v as SupportChannel })}
                options={[
                  { value: "whatsapp", label: "WhatsApp" },
                  { value: "email", label: "Email" },
                  { value: "sms", label: "SMS" },
                  { value: "live-chat", label: "Live Chat" },
                ]}
              />
            </FormField>
            <FormField label="Category">
              <SelectInput
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v as MessageTemplate["category"] })}
                options={[
                  { value: "greeting", label: "Greeting" },
                  { value: "follow-up", label: "Follow-up" },
                  { value: "thank-you", label: "Thank You" },
                  { value: "reminder", label: "Reminder" },
                  { value: "general", label: "General" },
                ]}
              />
            </FormField>
          </div>
        </div>
        {form.channel === "email" && (
          <FormField label="Email Subject" required>
            <TextInput value={form.subject || ""} onChange={(v) => setForm({ ...form, subject: v })} />
          </FormField>
        )}
        <FormField label="Message Body" required hint="Use {{variable}} for dynamic content. Variables are auto-detected.">
          <TextareaInput value={form.body} onChange={(v) => setForm({ ...form, body: v })} rows={6} />
        </FormField>
        <FormField label="Variables" hint="Press Enter to add manually">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {form.variables.map((v) => (
                <span key={v} className="px-2 py-1 rounded bg-gold/10 text-gold text-xs flex items-center gap-1 font-mono">
                  {`{{${v}}}`}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, variables: form.variables.filter((x) => x !== v) })}
                    className="hover:text-espresso"
                  >
                    <IconClose className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={varInput}
              onChange={(e) => setVarInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (varInput.trim() && !form.variables.includes(varInput.trim())) {
                    setForm({ ...form, variables: [...form.variables, varInput.trim()] });
                    setVarInput("");
                  }
                }
              }}
              placeholder="name, service, date..."
              className="w-full px-3 py-2 text-sm rounded-md border border-border bg-cream-50/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </FormField>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold"
          />
          <div>
            <div className="text-sm font-medium text-heading">Active</div>
            <div className="text-[11px] text-text-gray">Show in template picker</div>
          </div>
        </label>
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button type="button" onClick={onClose} variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">
            <IconCheck className="w-3.5 h-3.5" />
            {template.id ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ============= SUPPORT SETTINGS =============
function SupportSettings() {
  const support = useSupportStore();
  const { settings, updateSettings } = support;
  const { agents } = support;

  const testAlert = () => {
    const url = sendWhatsAppAlert("🧪 Test alert from WP Interior admin. Support system is working correctly.", settings.alertPhone);
    alert(`WhatsApp alert URL generated:\n\n${url}\n\nIn production, this would automatically send via the WhatsApp Business API.`);
  };

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h3 className="font-serif text-lg text-heading mb-4">WhatsApp Alerts</h3>
        <p className="text-xs text-text-gray mb-4">
          When enabled, the system sends WhatsApp messages to the alert phone number for new leads, conversations, and urgent inquiries.
        </p>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.whatsappAlertsEnabled}
              onChange={(e) => updateSettings({ whatsappAlertsEnabled: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
            />
            <div>
              <div className="text-sm font-medium text-heading">Enable WhatsApp Alerts</div>
              <div className="text-[11px] text-text-gray">Master switch for all WhatsApp notifications</div>
            </div>
          </label>
          <FormField label="Alert Phone Number" hint="Phone that receives alerts (with country code)">
            <TextInput
              value={settings.alertPhone}
              onChange={(v) => updateSettings({ alertPhone: v })}
              placeholder="+92 300 9998877"
            />
          </FormField>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.alertOnNewLead}
              onChange={(e) => updateSettings({ alertOnNewLead: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
              disabled={!settings.whatsappAlertsEnabled}
            />
            <div>
              <div className="text-sm font-medium text-heading">Alert on New Lead</div>
              <div className="text-[11px] text-text-gray">When a contact form is submitted</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.alertOnNewConversation}
              onChange={(e) => updateSettings({ alertOnNewConversation: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
              disabled={!settings.whatsappAlertsEnabled}
            />
            <div>
              <div className="text-sm font-medium text-heading">Alert on New Conversation</div>
              <div className="text-[11px] text-text-gray">When a new WhatsApp/email conversation starts</div>
            </div>
          </label>
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.alertOnUrgentPriority}
              onChange={(e) => updateSettings({ alertOnUrgentPriority: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
              disabled={!settings.whatsappAlertsEnabled}
            />
            <div>
              <div className="text-sm font-medium text-heading">Alert on Urgent Priority</div>
              <div className="text-[11px] text-text-gray">Always alert for urgent conversations</div>
            </div>
          </label>
          <Button variant="secondary" onClick={testAlert}>
            <IconWhatsapp className="w-3.5 h-3.5" />
            Send Test Alert
          </Button>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif text-lg text-heading mb-4">Auto-Assignment</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-cream-50/50 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoAssignAgent}
              onChange={(e) => updateSettings({ autoAssignAgent: e.target.checked })}
              className="w-4 h-4 text-gold focus:ring-gold"
            />
            <div>
              <div className="text-sm font-medium text-heading">Auto-Assign New Conversations</div>
              <div className="text-[11px] text-text-gray">Automatically assign to online agents</div>
            </div>
          </label>
          {settings.autoAssignAgent && (
            <FormField label="Default Agent (when no specialist is online)">
              <SelectInput
                value={settings.defaultAgentId}
                onChange={(v) => updateSettings({ defaultAgentId: v })}
                options={agents.map((a) => ({ value: a.id, label: a.name }))}
              />
            </FormField>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif text-lg text-heading mb-4">Business Hours</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Opens at">
            <TextInput
              type="time"
              value={settings.businessHoursStart}
              onChange={(v) => updateSettings({ businessHoursStart: v })}
            />
          </FormField>
          <FormField label="Closes at">
            <TextInput
              type="time"
              value={settings.businessHoursEnd}
              onChange={(v) => updateSettings({ businessHoursEnd: v })}
            />
          </FormField>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif text-lg text-heading mb-4">Out-of-Hours Auto-Reply</h3>
        <FormField label="Auto-reply message sent when offline">
          <TextareaInput
            value={settings.outOfHoursMessage}
            onChange={(v) => updateSettings({ outOfHoursMessage: v })}
            rows={3}
          />
        </FormField>
      </div>
    </div>
  );
}
