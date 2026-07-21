import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  MessageCircle,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  Clock,
  ChevronDown,
  FileText,
  Settings,
  Headphones,
  Phone,
  Mail,
  Users,
  Zap,
  Eye,
  EyeOff,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface ConversationMessage {
  id: string;
  from: string;
  text: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  channel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  service: string;
  status: 'queued' | 'active' | 'resolved' | 'spam';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedAgent: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  source: string;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'lead-agent' | 'senior-agent' | 'manager';
  whatsappNumber: string;
  isOnline: boolean;
  specialties: string[];
}

interface Template {
  _id: string;
  name: string;
  channel: string;
  body: string;
  variables: string[];
  category: 'greeting' | 'follow-up' | 'thank-you' | 'reminder' | 'general';
  isActive: boolean;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const STATUS_FILTER_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'queued', label: 'Queued' },
  { key: 'active', label: 'Active' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'spam', label: 'Spam' },
] as const;

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  instagram: 'text-[#E1306C] bg-[rgba(225,48,108,0.12)]',
  facebook: 'text-[#1877F2] bg-[rgba(24,119,242,0.12)]',
  email: 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  web: 'text-[#7C3AED] bg-[rgba(124,58,237,0.12)]',
  phone: 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-[#8A8073]',
  normal: 'bg-[#C9A84C]',
  high: 'bg-[#F59E0B]',
  urgent: 'bg-[#DC2626]',
};

const PRIORITY_DOTS: Record<string, string> = {
  low: 'w-1.5 h-1.5',
  normal: 'w-2 h-2',
  high: 'w-2 h-2',
  urgent: 'w-2.5 h-2.5',
};

const ROLE_STYLES: Record<string, string> = {
  'lead-agent': 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  'senior-agent': 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
  manager: 'text-[#7C3AED] bg-[rgba(124,58,237,0.12)]',
};

const CATEGORY_STYLES: Record<string, string> = {
  greeting: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  'follow-up': 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
  'thank-you': 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  reminder: 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]',
  general: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
};

const TABS = [
  { key: 'queue', label: 'Support Queue', icon: MessageCircle },
  { key: 'agents', label: 'Agents', icon: Headphones },
  { key: 'templates', label: 'Templates', icon: FileText },
  { key: 'settings', label: 'Settings', icon: Settings },
] as const;

const AGENT_ROLES = ['lead-agent', 'senior-agent', 'manager'] as const;
const TEMPLATE_CHANNELS = ['whatsapp', 'instagram', 'facebook', 'email', 'web'] as const;
const TEMPLATE_CATEGORIES = ['greeting', 'follow-up', 'thank-you', 'reminder', 'general'] as const;

const EMPTY_AGENT_FORM = {
  name: '',
  email: '',
  phone: '',
  role: 'senior-agent' as Agent['role'],
  whatsappNumber: '',
  isOnline: true,
  specialties: '',
};

const EMPTY_TEMPLATE_FORM = {
  name: '',
  channel: 'whatsapp' as string,
  body: '',
  category: 'general' as Template['category'],
  isActive: true,
};

/* ================================================================== */
/*  Toast                                                              */
/* ================================================================== */

function Toast({
  type,
  message,
  onDismiss,
}: {
  type: 'success' | 'error';
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const isError = type === 'error';
  return (
    <div
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 shadow-lg transition-all ${
        isError
          ? 'bg-[rgba(220,38,38,0.15)] border border-[rgba(220,38,38,0.4)]'
          : 'bg-[rgba(22,163,74,0.15)] border border-[rgba(22,163,74,0.4)]'
      }`}
    >
      {isError ? (
        <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
      ) : (
        <CheckCircle2 size={16} className="text-[#16A34A] shrink-0" />
      )}
      <span
        className={`text-sm font-light ${
          isError ? 'text-[#DC2626]' : 'text-[#16A34A]'
        }`}
      >
        {message}
      </span>
    </div>
  );
}

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function detectVariables(body: string): string[] {
  const matches = body.match(/\{\{(\w+)\}\}/g) || [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))];
}

function renderTemplateBody(body: string, variables: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || `{{${key}}}`);
}

/* ================================================================== */
/*  Support Queue Tab                                                  */
/* ================================================================== */

function SupportQueueTab({
  showToast,
}: {
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const [convRes, agentRes] = await Promise.all([
        adminFetch<{ conversations: Conversation[] }>('/admin/conversations'),
        adminFetch<{ agents: Agent[] }>('/admin/agents').catch(() => ({ agents: [] })),
      ]);
      setConversations(convRes.conversations || []);
      setAgents(agentRes.agents || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return conversations;
    return conversations.filter((c) => c.status === statusFilter);
  }, [conversations, statusFilter]);

  const selected = useMemo(
    () => conversations.find((c) => c._id === selectedId) || null,
    [conversations, selectedId]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selected?.messages]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: conversations.length };
    conversations.forEach((c) => {
      counts[c.status] = (counts[c.status] || 0) + 1;
    });
    return counts;
  }, [conversations]);

  async function handleSendReply() {
    if (!selected || !replyText.trim()) return;
    setSending(true);
    try {
      await adminFetch(`/admin/conversations/${selected._id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ from: 'agent', text: replyText.trim() }),
      });
      setReplyText('');
      await load();
      showToast('success', 'Message sent');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to send');
    } finally {
      setSending(false);
    }
  }

  async function handleAssignAgent(conversationId: string, agentId: string) {
    try {
      await adminFetch(`/admin/conversations/${conversationId}`, {
        method: 'PUT',
        body: JSON.stringify({ assignedAgent: agentId }),
      });
      showToast('success', 'Agent assigned');
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to assign');
    }
  }

  async function handleUpdateStatus(conversationId: string, status: string) {
    try {
      await adminFetch(`/admin/conversations/${conversationId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      showToast('success', `Conversation marked as ${status}`);
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to update');
    }
  }

  return (
    <div className="flex h-[calc(100vh-180px)]">
      {/* Left panel: conversation list */}
      <div className="w-[380px] shrink-0 border-r border-[rgba(201,168,76,0.15)] flex flex-col">
        {/* Status filter tabs */}
        <div className="px-4 py-3 border-b border-[rgba(201,168,76,0.1)] flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTER_OPTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={`text-[0.5rem] tracking-[0.2em] uppercase font-semibold px-2.5 py-1.5 transition-colors ${
                statusFilter === s.key
                  ? 'bg-[#C9A84C] text-[#0A0A0A]'
                  : 'text-[#8A8073] hover:text-white'
              }`}
            >
              {s.label}
              {` (${statusCounts[s.key] || 0})`}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto scrollbar-lux">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="text-[#C9A84C] animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <MessageCircle size={28} className="text-[#8A8073] opacity-40 mb-3" />
              <p className="text-sm text-[#8A8073] font-light">
                {statusFilter === 'all'
                  ? 'No conversations yet'
                  : `No ${statusFilter} conversations`}
              </p>
            </div>
          ) : (
            filtered.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setSelectedId(conv._id)}
                className={`w-full text-left px-4 py-3.5 border-b border-[rgba(201,168,76,0.06)] transition-colors ${
                  selectedId === conv._id
                    ? 'bg-[rgba(201,168,76,0.08)] border-l-2 border-l-[#C9A84C]'
                    : 'hover:bg-[rgba(201,168,76,0.03)] border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`w-8 h-8 bg-[rgba(201,168,76,0.1)] flex items-center justify-center shrink-0 ${
                        conv.status === 'active'
                          ? 'ring-1 ring-[rgba(22,163,74,0.4)]'
                          : ''
                      }`}
                    >
                      <User size={14} className="text-[#C9A84C]" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm text-white font-medium truncate">
                        {conv.customerName || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 ${
                            CHANNEL_COLORS[conv.channel] || 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]'
                          }`}
                        >
                          {conv.channel}
                        </span>
                        <StatusBadge status={conv.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <div
                      className={`${PRIORITY_DOTS[conv.priority]} ${PRIORITY_COLORS[conv.priority]}`}
                      title={`Priority: ${conv.priority}`}
                    />
                    <span className="text-[0.5rem] text-[#8A8073] whitespace-nowrap">
                      {timeAgo(conv.updatedAt || conv.createdAt)}
                    </span>
                  </div>
                </div>
                {conv.messages.length > 0 && (
                  <p className="text-xs text-[#8A8073] font-light truncate ml-10">
                    {conv.messages[conv.messages.length - 1].text}
                  </p>
                )}
                {conv.service && (
                  <span className="inline-block text-[0.45rem] tracking-[0.15em] uppercase text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-1.5 py-0.5 mt-1.5 ml-10">
                    {conv.service}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right panel: conversation detail */}
      <div className="flex-1 flex flex-col min-w-0">
        {!selected ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[rgba(201,168,76,0.06)] flex items-center justify-center mb-5">
              <MessageCircle size={28} className="text-[#8A8073] opacity-40" />
            </div>
            <h3 className="font-display text-lg text-white mb-1">No conversation selected</h3>
            <p className="text-sm text-[#8A8073] font-light max-w-xs">
              Select a conversation from the queue to view messages and respond
            </p>
          </div>
        ) : (
          <>
            {/* Conversation header */}
            <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.15)] bg-[#111110]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                    <User size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <div className="text-base text-white font-medium">
                      {selected.customerName || 'Unknown Customer'}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8A8073] mt-0.5">
                      {selected.customerPhone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {selected.customerPhone}
                        </span>
                      )}
                      {selected.customerEmail && (
                        <span className="flex items-center gap-1">
                          <Mail size={10} /> {selected.customerEmail}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={10} /> {timeAgo(selected.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Agent assignment */}
                  <div className="relative">
                    <select
                      value={selected.assignedAgent || ''}
                      onChange={(e) => handleAssignAgent(selected._id, e.target.value)}
                      className="input-lux text-[0.6rem] py-2 px-3 pr-7 appearance-none min-w-[140px]"
                    >
                      <option value="">Unassigned</option>
                      {agents.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.role})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8073] pointer-events-none"
                    />
                  </div>

                  {/* Status dropdown */}
                  <div className="relative">
                    <select
                      value={selected.status}
                      onChange={(e) => handleUpdateStatus(selected._id, e.target.value)}
                      className="input-lux text-[0.6rem] py-2 px-3 pr-7 appearance-none"
                    >
                      <option value="queued">Queued</option>
                      <option value="active">Active</option>
                      <option value="resolved">Resolved</option>
                      <option value="spam">Spam</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A8073] pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Meta badges */}
              <div className="flex items-center gap-2 mt-3">
                <span
                  className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 ${
                    CHANNEL_COLORS[selected.channel] || 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]'
                  }`}
                >
                  {selected.channel}
                </span>
                <StatusBadge status={selected.status} />
                <span
                  className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 text-white bg-[rgba(255,255,255,0.08)]`}
                >
                  {selected.priority} priority
                </span>
                {selected.source && (
                  <span className="text-[0.45rem] tracking-[0.15em] uppercase text-[#8A8073] px-2 py-0.5 bg-[rgba(138,128,115,0.08)]">
                    Source: {selected.source}
                  </span>
                )}
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-lux">
              {selected.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare size={24} className="text-[#8A8073] opacity-30 mb-3" />
                  <p className="text-sm text-[#8A8073] font-light">
                    No messages yet. Start the conversation below.
                  </p>
                </div>
              ) : (
                selected.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.from === 'agent' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-3 ${
                        msg.from === 'agent'
                          ? 'bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)]'
                          : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold ${
                            msg.from === 'agent' ? 'text-[#C9A84C]' : 'text-[#D4C5A9]'
                          }`}
                        >
                          {msg.from === 'agent' ? 'Agent' : msg.from || 'Customer'}
                        </span>
                        <span className="text-[0.45rem] text-[#8A8073]">
                          {timeAgo(msg.timestamp)}
                        </span>
                        {msg.read && msg.from !== 'agent' && (
                          <CheckCircle2 size={10} className="text-[#16A34A]" />
                        )}
                      </div>
                      <p className="text-sm text-[#D4C5A9] font-light leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.15)] bg-[#111110]">
              <div className="flex items-end gap-3">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  placeholder="Type your reply..."
                  rows={2}
                  className="input-lux flex-1 resize-none text-sm"
                />
                <button
                  onClick={handleSendReply}
                  disabled={sending || !replyText.trim()}
                  className="btn-lux btn-gold text-[0.6rem] py-3 px-5 inline-flex items-center gap-2 disabled:opacity-50 shrink-0"
                >
                  {sending ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Send size={13} />
                  )}
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Agents Tab                                                         */
/* ================================================================== */

function AgentsTab({
  showToast,
}: {
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [form, setForm] = useState(EMPTY_AGENT_FORM);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Agent | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ agents: Agent[] }>('/admin/agents');
      setAgents(res.agents || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_AGENT_FORM });
    setModalOpen(true);
  }

  function openEdit(agent: Agent) {
    setEditing(agent);
    setForm({
      name: agent.name || '',
      email: agent.email || '',
      phone: agent.phone || '',
      role: agent.role || 'senior-agent',
      whatsappNumber: agent.whatsappNumber || '',
      isOnline: agent.isOnline,
      specialties: (agent.specialties || []).join(', '),
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        role: form.role,
        whatsappNumber: form.whatsappNumber.trim(),
        isOnline: form.isOnline,
        specialties: form.specialties
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };

      if (editing) {
        await adminFetch(`/admin/agents/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast('success', 'Agent updated');
      } else {
        await adminFetch('/admin/agents', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast('success', 'Agent created');
      }
      closeModal();
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/admin/agents/${deleteTarget._id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      showToast('success', 'Agent deleted');
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-xl text-white">Support Agents</h2>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Manage your live support team
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Add Agent
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-6 flex items-center gap-3">
          <AlertCircle size={14} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <Headphones size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">No agents yet</p>
          <button
            onClick={openAdd}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Add your first agent
          </button>
        </div>
      ) : (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] border-b border-[rgba(201,168,76,0.1)]">
                  <th className="px-6 py-4 font-medium">Agent</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Role</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Status</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Specialties</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agent) => (
                  <tr
                    key={agent._id}
                    className="border-b border-[rgba(201,168,76,0.06)] hover:bg-[rgba(201,168,76,0.03)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[rgba(201,168,76,0.1)] flex items-center justify-center shrink-0">
                          <User size={14} className="text-[#C9A84C]" />
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">{agent.name}</div>
                          <div className="text-[0.6rem] text-[#8A8073] mt-0.5">
                            {agent.email}
                            {agent.phone && <> &middot; {agent.phone}</>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span
                        className={`text-[0.5rem] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 ${
                          ROLE_STYLES[agent.role] || ROLE_STYLES['senior-agent']
                        }`}
                      >
                        {agent.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            agent.isOnline ? 'bg-[#16A34A]' : 'bg-[#8A8073]'
                          }`}
                        />
                        <span
                          className={`text-[0.55rem] tracking-[0.15em] uppercase font-medium ${
                            agent.isOnline ? 'text-[#16A34A]' : 'text-[#8A8073]'
                          }`}
                        >
                          {agent.isOnline ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(agent.specialties || []).slice(0, 3).map((s, i) => (
                          <span
                            key={i}
                            className="text-[0.45rem] tracking-[0.15em] uppercase text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-1.5 py-0.5"
                          >
                            {s}
                          </span>
                        ))}
                        {(agent.specialties || []).length > 3 && (
                          <span className="text-[0.45rem] text-[#8A8073]">
                            +{(agent.specialties || []).length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => openEdit(agent)}
                          className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(agent)}
                          className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.1)]">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
              {agents.length} agent{agents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Agent' : 'Add Agent'}
        size="lg"
        footer={
          <>
            <button onClick={closeModal} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Update Agent' : 'Create Agent'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-5">
          {/* Name */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">
              Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="input-lux w-full"
              placeholder="Agent name"
            />
          </div>

          {/* Email */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              className="input-lux w-full"
              placeholder="agent@woodex.com"
            />
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              className="input-lux w-full"
              placeholder="+971 50 123 4567"
            />
          </div>

          {/* Role */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => updateField('role', e.target.value as Agent['role'])}
              className="input-lux w-full"
            >
              {AGENT_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* WhatsApp Number */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">WhatsApp Number</label>
            <input
              type="tel"
              value={form.whatsappNumber}
              onChange={(e) => updateField('whatsappNumber', e.target.value)}
              className="input-lux w-full"
              placeholder="+971 50 123 4567"
            />
          </div>

          {/* Online toggle */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Status</label>
            <button
              type="button"
              onClick={() => updateField('isOnline', !form.isOnline)}
              className={`flex items-center gap-2.5 px-4 py-2.5 border transition-colors ${
                form.isOnline
                  ? 'border-[rgba(22,163,74,0.4)] bg-[rgba(22,163,74,0.08)]'
                  : 'border-[rgba(138,128,115,0.3)] bg-[rgba(138,128,115,0.05)]'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  form.isOnline ? 'bg-[#16A34A]' : 'bg-[#8A8073]'
                }`}
              />
              <span
                className={`text-sm font-light ${
                  form.isOnline ? 'text-[#16A34A]' : 'text-[#8A8073]'
                }`}
              >
                {form.isOnline ? 'Online' : 'Offline'}
              </span>
            </button>
          </div>

          {/* Specialties */}
          <div className="col-span-2 mb-5">
            <label className="label-lux block mb-1.5">Specialties</label>
            <input
              type="text"
              value={form.specialties}
              onChange={(e) => updateField('specialties', e.target.value)}
              className="input-lux w-full"
              placeholder="e.g. Kitchen, Bedroom, Commercial (comma-separated)"
            />
            <p className="text-[0.6rem] text-[#6B6355] mt-1">
              Comma-separated list of areas of expertise
            </p>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Agent"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}

/* ================================================================== */
/*  Templates Tab                                                      */
/* ================================================================== */

function TemplatesTab({
  showToast,
}: {
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Template | null>(null);
  const [form, setForm] = useState(EMPTY_TEMPLATE_FORM);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<Template | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Preview modal
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewVars, setPreviewVars] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ templates: Template[] }>('/admin/templates');
      setTemplates(res.templates || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const autoDetectedVars = useMemo(() => detectVariables(form.body), [form.body]);

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_TEMPLATE_FORM });
    setModalOpen(true);
  }

  function openEdit(tpl: Template) {
    setEditing(tpl);
    setForm({
      name: tpl.name || '',
      channel: tpl.channel || 'whatsapp',
      body: tpl.body || '',
      category: tpl.category || 'general',
      isActive: tpl.isActive,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  function openPreview(tpl: Template) {
    setPreviewTemplate(tpl);
    const vars = detectVariables(tpl.body);
    const initial: Record<string, string> = {};
    vars.forEach((v) => { initial[v] = ''; });
    setPreviewVars(initial);
  }

  function closePreview() {
    setPreviewTemplate(null);
    setPreviewVars({});
  }

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.body.trim()) return;
    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        channel: form.channel,
        body: form.body.trim(),
        category: form.category,
        variables: autoDetectedVars,
        isActive: form.isActive,
      };

      if (editing) {
        await adminFetch(`/admin/templates/${editing._id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        showToast('success', 'Template updated');
      } else {
        await adminFetch('/admin/templates', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        showToast('success', 'Template created');
      }
      closeModal();
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/admin/templates/${deleteTarget._id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      showToast('success', 'Template deleted');
      await load();
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-xl text-white">Message Templates</h2>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Reusable templates for quick responses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            New Template
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-6 flex items-center gap-3">
          <AlertCircle size={14} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : templates.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <FileText size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">No templates yet</p>
          <button
            onClick={openAdd}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            Create your first template
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((tpl) => (
            <div
              key={tpl._id}
              className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 flex flex-col hover:border-[rgba(201,168,76,0.4)] transition-colors"
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 ${
                      CHANNEL_COLORS[tpl.channel] || 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]'
                    }`}
                  >
                    {tpl.channel}
                  </span>
                  <span
                    className={`text-[0.45rem] tracking-[0.15em] uppercase font-semibold px-1.5 py-0.5 ${
                      CATEGORY_STYLES[tpl.category] || CATEGORY_STYLES.general
                    }`}
                  >
                    {tpl.category}
                  </span>
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    tpl.isActive ? 'bg-[#16A34A]' : 'bg-[#8A8073]'
                  }`}
                  title={tpl.isActive ? 'Active' : 'Inactive'}
                />
              </div>

              {/* Name */}
              <h3 className="font-display text-base text-white mb-2">{tpl.name}</h3>

              {/* Body preview */}
              <p className="text-xs text-[#D4C5A9] font-light leading-relaxed mb-3 line-clamp-3 flex-1">
                {tpl.body}
              </p>

              {/* Variables */}
              {tpl.variables && tpl.variables.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mb-4">
                  {tpl.variables.map((v) => (
                    <span
                      key={v}
                      className="text-[0.45rem] tracking-[0.1em] text-[#C9A84C] bg-[rgba(201,168,76,0.08)] px-1.5 py-0.5 font-mono"
                    >
                      {'{{' + v + '}}'}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="mt-auto pt-3 border-t border-[rgba(201,168,76,0.1)] flex items-center justify-between">
                <button
                  onClick={() => openPreview(tpl)}
                  className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                >
                  <Eye size={12} />
                  Preview
                </button>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEdit(tpl)}
                    className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                  >
                    <Pencil size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(tpl)}
                    className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count footer */}
      {!loading && templates.length > 0 && (
        <div className="mt-6">
          <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
            {templates.length} template{templates.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* ============================================================ */}
      {/*  Add / Edit Modal                                            */}
      {/* ============================================================ */}
      <AdminModal
        open={modalOpen}
        onClose={closeModal}
        title={editing ? 'Edit Template' : 'New Template'}
        size="lg"
        footer={
          <>
            <button onClick={closeModal} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.name.trim() || !form.body.trim()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Update Template' : 'Create Template'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-x-5">
          {/* Name */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">
              Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="input-lux w-full"
              placeholder="Template name"
            />
          </div>

          {/* Channel */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Channel</label>
            <select
              value={form.channel}
              onChange={(e) => updateField('channel', e.target.value)}
              className="input-lux w-full"
            >
              {TEMPLATE_CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value as Template['category'])}
              className="input-lux w-full"
            >
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Active toggle */}
          <div className="mb-5">
            <label className="label-lux block mb-1.5">Status</label>
            <button
              type="button"
              onClick={() => updateField('isActive', !form.isActive)}
              className={`flex items-center gap-2.5 px-4 py-2.5 border transition-colors ${
                form.isActive
                  ? 'border-[rgba(22,163,74,0.4)] bg-[rgba(22,163,74,0.08)]'
                  : 'border-[rgba(138,128,115,0.3)] bg-[rgba(138,128,115,0.05)]'
              }`}
            >
              {form.isActive ? (
                <Eye size={14} className="text-[#16A34A]" />
              ) : (
                <EyeOff size={14} className="text-[#8A8073]" />
              )}
              <span
                className={`text-sm font-light ${
                  form.isActive ? 'text-[#16A34A]' : 'text-[#8A8073]'
                }`}
              >
                {form.isActive ? 'Active' : 'Inactive'}
              </span>
            </button>
          </div>

          {/* Body */}
          <div className="col-span-2 mb-5">
            <label className="label-lux block mb-1.5">
              Body <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              value={form.body}
              onChange={(e) => updateField('body', e.target.value)}
              className="input-lux w-full min-h-[140px] resize-y font-mono text-sm"
              placeholder={"Hello {{name}},\n\nThank you for reaching out to Woodex Interior. We'd love to help you with your {{project}} project.\n\nBest regards,\nThe Woodex Team"}
              rows={6}
            />
            <p className="text-[0.6rem] text-[#6B6355] mt-1">
              Use {'{{variable_name}}'} syntax for dynamic content
            </p>
          </div>

          {/* Auto-detected variables */}
          {autoDetectedVars.length > 0 && (
            <div className="col-span-2 mb-5">
              <label className="label-lux block mb-2">Detected Variables</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {autoDetectedVars.map((v) => (
                  <span
                    key={v}
                    className="text-[0.5rem] tracking-[0.1em] text-[#C9A84C] bg-[rgba(201,168,76,0.1)] px-2 py-1 font-mono border border-[rgba(201,168,76,0.2)]"
                  >
                    {'{{' + v + '}}'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </AdminModal>

      {/* Preview Modal */}
      {previewTemplate && (
        <AdminModal
          open={!!previewTemplate}
          onClose={closePreview}
          title={`Preview: ${previewTemplate.name}`}
          size="md"
          footer={
            <button
              onClick={closePreview}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Close
            </button>
          }
        >
          <div className="space-y-4">
            {detectVariables(previewTemplate.body).length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-[#8A8073] uppercase tracking-[0.15em] font-semibold">
                  Fill in variables
                </p>
                {detectVariables(previewTemplate.body).map((v) => (
                  <div key={v}>
                    <label className="label-lux block mb-1">{`{{${v}}}`}</label>
                    <input
                      type="text"
                      value={previewVars[v] || ''}
                      onChange={(e) =>
                        setPreviewVars((prev) => ({ ...prev, [v]: e.target.value }))
                      }
                      className="input-lux w-full"
                      placeholder={`Enter ${v}...`}
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <p className="text-xs text-[#8A8073] uppercase tracking-[0.15em] font-semibold mb-2">
                Rendered output
              </p>
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] p-4">
                <p className="text-sm text-[#D4C5A9] font-light leading-relaxed whitespace-pre-wrap">
                  {renderTemplateBody(previewTemplate.body, previewVars)}
                </p>
              </div>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Template"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        loading={deleting}
      />
    </div>
  );
}

/* ================================================================== */
/*  Settings Tab                                                       */
/* ================================================================== */

interface SupportSettings {
  whatsappAlerts: {
    enabled: boolean;
    alertPhone: string;
    events: {
      newConversation: boolean;
    };
  };
  autoAssignment: {
    enabled: boolean;
    defaultAgent: string;
  };
  businessHours: {
    start: string;
    end: string;
    outOfHoursMessage: string;
  };
}

const DEFAULT_SETTINGS: SupportSettings = {
  whatsappAlerts: {
    enabled: false,
    alertPhone: '',
    events: {
      newConversation: true,
    },
  },
  autoAssignment: {
    enabled: false,
    defaultAgent: '',
  },
  businessHours: {
    start: '09:00',
    end: '18:00',
    outOfHoursMessage:
      'Thank you for reaching out. Our office hours are 9:00 AM - 6:00 PM. We will respond to your message on the next business day.',
  },
};

function SettingsTab({
  showToast,
}: {
  showToast: (type: 'success' | 'error', message: string) => void;
}) {
  const [settings, setSettings] = useState<SupportSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [settingsRes, agentRes] = await Promise.all([
          adminFetch<{ settings: SupportSettings }>('/admin/conversations/settings').catch(() => ({
            settings: DEFAULT_SETTINGS,
          })),
          adminFetch<{ agents: Agent[] }>('/admin/agents').catch(() => ({ agents: [] })),
        ]);
        setSettings(settingsRes.settings || DEFAULT_SETTINGS);
        setAgents(agentRes.agents || []);
      } catch {
        // Use defaults
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function updateSection<K extends keyof SupportSettings>(
    section: K,
    field: keyof SupportSettings[K],
    value: unknown
  ) {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await adminFetch('/admin/conversations/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
      showToast('success', 'Settings saved');
    } catch (err: unknown) {
      showToast('error', err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-xl text-white">Support Settings</h2>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Configure alerts, auto-assignment, and business hours
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : (
        <div className="space-y-8 max-w-3xl">
          {/* -------------------------------------------------------- */}
          {/*  WhatsApp Alerts                                         */}
          {/* -------------------------------------------------------- */}
          <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[rgba(22,163,74,0.1)] flex items-center justify-center">
                <MessageSquare size={16} className="text-[#16A34A]" />
              </div>
              <div>
                <h3 className="font-display text-base text-white">WhatsApp Alerts</h3>
                <p className="text-[0.6rem] text-[#8A8073]">Get notified of new conversations</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Enabled toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#D4C5A9]">Enable WhatsApp alerts</p>
                  <p className="text-[0.6rem] text-[#8A8073] mt-0.5">
                    Receive WhatsApp messages for support events
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSection('whatsappAlerts', 'enabled', !settings.whatsappAlerts.enabled)
                  }
                  className={`relative w-11 h-6 transition-colors ${
                    settings.whatsappAlerts.enabled ? 'bg-[#16A34A]' : 'bg-[rgba(138,128,115,0.3)]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                      settings.whatsappAlerts.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Alert phone */}
              <div>
                <label className="label-lux block mb-1.5">Alert phone number</label>
                <input
                  type="tel"
                  value={settings.whatsappAlerts.alertPhone}
                  onChange={(e) => updateSection('whatsappAlerts', 'alertPhone', e.target.value)}
                  className="input-lux w-full max-w-sm"
                  placeholder="+971 50 123 4567"
                  disabled={!settings.whatsappAlerts.enabled}
                />
              </div>

              {/* Event toggles */}
              <div className="border-t border-[rgba(201,168,76,0.1)] pt-4">
                <p className="text-xs text-[#8A8073] uppercase tracking-[0.15em] font-semibold mb-3">
                  Alert events
                </p>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <Zap size={14} className="text-[#C9A84C]" />
                    <span className="text-sm text-[#D4C5A9]">New conversation</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateSection('whatsappAlerts', 'events', {
                        ...settings.whatsappAlerts.events,
                        newConversation: !settings.whatsappAlerts.events.newConversation,
                      })
                    }
                    className={`relative w-11 h-6 transition-colors ${
                      settings.whatsappAlerts.events.newConversation
                        ? 'bg-[#16A34A]'
                        : 'bg-[rgba(138,128,115,0.3)]'
                    }`}
                    disabled={!settings.whatsappAlerts.enabled}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                        settings.whatsappAlerts.events.newConversation
                          ? 'translate-x-[22px]'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Auto-Assignment                                         */}
          {/* -------------------------------------------------------- */}
          <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[rgba(201,168,76,0.1)] flex items-center justify-center">
                <Users size={16} className="text-[#C9A84C]" />
              </div>
              <div>
                <h3 className="font-display text-base text-white">Auto-Assignment</h3>
                <p className="text-[0.6rem] text-[#8A8073]">
                  Automatically assign incoming conversations
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Enabled toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#D4C5A9]">Enable auto-assignment</p>
                  <p className="text-[0.6rem] text-[#8A8073] mt-0.5">
                    Route new conversations to agents automatically
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSection('autoAssignment', 'enabled', !settings.autoAssignment.enabled)
                  }
                  className={`relative w-11 h-6 transition-colors ${
                    settings.autoAssignment.enabled ? 'bg-[#16A34A]' : 'bg-[rgba(138,128,115,0.3)]'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white transition-transform ${
                      settings.autoAssignment.enabled ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Default agent */}
              <div>
                <label className="label-lux block mb-1.5">Default agent</label>
                <div className="relative max-w-sm">
                  <select
                    value={settings.autoAssignment.defaultAgent}
                    onChange={(e) =>
                      updateSection('autoAssignment', 'defaultAgent', e.target.value)
                    }
                    className="input-lux w-full appearance-none pr-8"
                    disabled={!settings.autoAssignment.enabled}
                  >
                    <option value="">Select agent</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8073] pointer-events-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/*  Business Hours                                          */}
          {/* -------------------------------------------------------- */}
          <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-[rgba(124,58,237,0.1)] flex items-center justify-center">
                <Calendar size={16} className="text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="font-display text-base text-white">Business Hours</h3>
                <p className="text-[0.6rem] text-[#8A8073]">
                  Define when your team is available
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Time range */}
              <div className="grid grid-cols-2 gap-5 max-w-sm">
                <div>
                  <label className="label-lux block mb-1.5">Start time</label>
                  <input
                    type="time"
                    value={settings.businessHours.start}
                    onChange={(e) => updateSection('businessHours', 'start', e.target.value)}
                    className="input-lux w-full"
                  />
                </div>
                <div>
                  <label className="label-lux block mb-1.5">End time</label>
                  <input
                    type="time"
                    value={settings.businessHours.end}
                    onChange={(e) => updateSection('businessHours', 'end', e.target.value)}
                    className="input-lux w-full"
                  />
                </div>
              </div>

              {/* Out of hours message */}
              <div>
                <label className="label-lux block mb-1.5">Out-of-hours message</label>
                <textarea
                  value={settings.businessHours.outOfHoursMessage}
                  onChange={(e) =>
                    updateSection('businessHours', 'outOfHoursMessage', e.target.value)
                  }
                  className="input-lux w-full min-h-[100px] resize-y text-sm"
                  placeholder="Auto-reply message sent outside business hours..."
                  rows={4}
                />
                <p className="text-[0.6rem] text-[#6B6355] mt-1">
                  This message is automatically sent to customers who contact you outside business hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function PlaceholderSupport() {
  const [activeTab, setActiveTab] = useState<string>('queue');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message });
  }

  return (
    <div className="p-8">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white">Live Support</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            WhatsApp & agent management
          </p>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex items-center gap-1 mb-8 border-b border-[rgba(201,168,76,0.15)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 text-[0.6rem] tracking-[0.2em] uppercase font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-[#C9A84C] text-[#C9A84C]'
                  : 'border-transparent text-[#8A8073] hover:text-[#D4C5A9]'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'queue' && <SupportQueueTab showToast={showToast} />}
      {activeTab === 'agents' && <AgentsTab showToast={showToast} />}
      {activeTab === 'templates' && <TemplatesTab showToast={showToast} />}
      {activeTab === 'settings' && <SettingsTab showToast={showToast} />}
    </div>
  );
}
