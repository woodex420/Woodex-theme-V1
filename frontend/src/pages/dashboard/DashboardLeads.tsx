import { useEffect, useState, useCallback } from 'react';
import {
  Users,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Search,
  Eye,
  Trash2,
  ChevronDown,
  Send,
  Tag,
  Globe,
  DollarSign,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  project_location: string;
  area: string;
  services: string[];
  start_date: string;
  budget: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'quoted' | 'won' | 'lost';
  source_page: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  createdAt: string;
}

type LeadStatus = Lead['status'];

const STATUSES: { key: LeadStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'new', label: 'New' },
  { key: 'read', label: 'Read' },
  { key: 'replied', label: 'Replied' },
  { key: 'quoted', label: 'Quoted' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
];

const STATUS_OPTIONS: LeadStatus[] = ['new', 'read', 'replied', 'quoted', 'won', 'lost'];

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Detail Row (reusable in modal)                                     */
/* ------------------------------------------------------------------ */

function DetailRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number | undefined | null;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
        <Icon size={14} className="text-[#C9A84C]" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] font-semibold mb-0.5">
          {label}
        </p>
        <p
          className={`text-sm text-[#D4C5A9] font-light leading-relaxed break-words ${
            mono ? 'font-mono text-xs' : ''
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardLeads() {
  /* ---- data state ---- */
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* ---- filters ---- */
  const [filter, setFilter] = useState<LeadStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  /* ---- detail modal ---- */
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [detailSaving, setDetailSaving] = useState(false);

  /* ---- delete ---- */
  const [deleteTarget, setDeleteTarget] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* ---- whatsapp ---- */
  const [whatsappLead, setWhatsappLead] = useState<Lead | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ================================================================ */
  /*  Data fetching                                                    */
  /* ================================================================ */

  const load = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const res = await adminFetch<{ leads: Lead[] }>('/admin/leads');
      setLeads(res.leads || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ================================================================ */
  /*  Filtered list                                                    */
  /* ================================================================ */

  const statusCounts = leads.reduce(
    (acc, l) => {
      acc[l.status] = (acc[l.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const filtered = leads.filter((lead) => {
    const matchesStatus = filter === 'all' || lead.status === filter;
    if (!matchesStatus) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q)
    );
  });

  /* ================================================================ */
  /*  Status change                                                    */
  /* ================================================================ */

  async function handleStatusChange(leadId: string, newStatus: LeadStatus) {
    try {
      setDetailSaving(true);
      await adminFetch(`/admin/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      /* Update local state */
      setLeads((prev) =>
        prev.map((l) => (l._id === leadId ? { ...l, status: newStatus } : l)),
      );

      /* Update detail modal lead if open */
      setDetailLead((prev) =>
        prev && prev._id === leadId ? { ...prev, status: newStatus } : prev,
      );

      setToast({ type: 'success', message: `Status changed to "${newStatus}"` });
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to update status',
      });
    } finally {
      setDetailSaving(false);
    }
  }

  /* ================================================================ */
  /*  Delete                                                           */
  /* ================================================================ */

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminFetch(`/admin/leads/${deleteTarget._id}`, {
        method: 'DELETE',
      });
      setDeleteTarget(null);
      setToast({ type: 'success', message: `"${deleteTarget.name}" deleted.` });
      await load();
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Delete failed',
      });
    } finally {
      setDeleting(false);
    }
  }

  /* ================================================================ */
  /*  WhatsApp notification                                            */
  /* ================================================================ */

  async function handleWhatsAppNotify() {
    if (!whatsappLead) return;
    try {
      setSendingWhatsApp(true);
      await adminFetch(`/admin/leads/${whatsappLead._id}/notify`, {
        method: 'POST',
      });
      setToast({ type: 'success', message: `WhatsApp alert sent to ${whatsappLead.name}` });
      setWhatsappLead(null);
    } catch (err: unknown) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to send WhatsApp alert',
      });
    } finally {
      setSendingWhatsApp(false);
    }
  }

  /* ================================================================ */
  /*  Open detail modal (also marks as read)                           */
  /* ================================================================ */

  async function openDetail(lead: Lead) {
    setDetailLead(lead);
    /* Auto-mark as read if currently new */
    if (lead.status === 'new') {
      await handleStatusChange(lead._id, 'read');
      setDetailLead((prev) => (prev && prev._id === lead._id ? { ...prev, status: 'read' } : prev));
    }
  }

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="p-8">
      {/* ---- Toast ---- */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Contact Leads</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Form submissions from your website
          </p>
        </div>
        <button
          onClick={load}
          className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
        >
          Refresh
        </button>
      </div>

      {/* ---- Error banner ---- */}
      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-3">
          <AlertCircle size={16} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* ---- Status filter tabs ---- */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {STATUSES.map((s) => {
          const count = s.key === 'all' ? leads.length : statusCounts[s.key] || 0;
          return (
            <button
              key={s.key}
              onClick={() => setFilter(s.key)}
              className={`text-[0.55rem] tracking-[0.25em] uppercase font-semibold px-3.5 py-2 transition-colors ${
                filter === s.key
                  ? 'bg-[#C9A84C] text-[#0A0A0A]'
                  : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
              }`}
            >
              {s.label}
              {count > 0 && (
                <span className="ml-1.5 opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ---- Search bar ---- */}
      <div className="relative mb-8">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8073]"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="input-lux w-full pl-11 pr-4 py-3"
        />
      </div>

      {/* ---- Content ---- */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
          <Users size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
          <p className="text-[#8A8073] font-light">
            {search.trim()
              ? 'No leads match your search'
              : filter !== 'all'
                ? `No leads with status "${filter}"`
                : 'No leads yet'}
          </p>
        </div>
      ) : (
        <>
          {/* ---- Lead cards ---- */}
          <div className="space-y-4">
            {filtered.map((lead) => (
              <div
                key={lead._id}
                className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6 hover:border-[rgba(201,168,76,0.4)] transition-colors"
              >
                {/* Card top row: badge + actions */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base text-white font-medium">
                        {lead.name}
                      </h3>
                      <StatusBadge status={lead.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#8A8073] mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail size={10} /> {lead.email}
                      </span>
                      {lead.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={10} /> {lead.phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />{' '}
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Project info row */}
                {(lead.project_type || lead.project_location || lead.area) && (
                  <div className="flex items-center gap-4 text-xs text-[#D4C5A9] mb-3 flex-wrap">
                    {lead.project_type && (
                      <span className="bg-[rgba(201,168,76,0.08)] px-2 py-0.5">
                        {lead.project_type}
                      </span>
                    )}
                    {lead.project_location && (
                      <span className="flex items-center gap-1">
                        <MapPin size={10} /> {lead.project_location}
                      </span>
                    )}
                    {lead.area && <span>{lead.area}</span>}
                  </div>
                )}

                {/* Message preview */}
                {lead.message && (
                  <div className="flex items-start gap-2 text-sm text-[#B8AA8D] bg-[#0A0A0A] border border-[rgba(201,168,76,0.08)] p-4 mb-4">
                    <MessageSquare
                      size={14}
                      className="text-[#8A8073] mt-0.5 shrink-0"
                    />
                    <p className="font-light leading-relaxed line-clamp-2">
                      {lead.message}
                    </p>
                  </div>
                )}

                {/* Actions row */}
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(201,168,76,0.1)]">
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073]">
                    {new Date(lead.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Quick status dropdown */}
                    <div className="relative">
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(lead._id, e.target.value as LeadStatus)
                        }
                        className="input-lux text-[0.55rem] py-1.5 px-3 pr-7 appearance-none cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={12}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A8073] pointer-events-none"
                      />
                    </div>

                    {/* View button */}
                    <button
                      onClick={() => openDetail(lead)}
                      className="inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#C9A84C] transition-colors"
                    >
                      <Eye size={12} />
                      View
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setDeleteTarget(lead)}
                      className="inline-flex items-center gap-1.5 text-[0.55rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---- Footer count ---- */}
          <div className="mt-8">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
              {filtered.length}
              {filter !== 'all' || search.trim()
                ? ` of ${leads.length}`
                : ''}{' '}
              lead{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </>
      )}

      {/* ============================================================ */}
      {/*  Lead Detail Modal                                            */}
      {/* ============================================================ */}
      <AdminModal
        open={!!detailLead}
        onClose={() => setDetailLead(null)}
        title="Lead Details"
        size="lg"
        footer={
          <>
            <button
              onClick={() => setDetailLead(null)}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Close
            </button>
          </>
        }
      >
        {detailLead && (
          <div className="space-y-8">
            {/* ---- Status & Name Header ---- */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl text-white mb-1">
                  {detailLead.name}
                </h3>
                <p className="text-xs text-[#8A8073]">
                  Lead submitted{' '}
                  {new Date(detailLead.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <StatusBadge status={detailLead.status} />
            </div>

            {/* ---- Contact Information ---- */}
            <div>
              <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                Contact Information
              </h4>
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5 space-y-4">
                <DetailRow icon={Users} label="Full Name" value={detailLead.name} />
                <DetailRow
                  icon={Mail}
                  label="Email"
                  value={detailLead.email}
                  mono
                />
                <DetailRow icon={Phone} label="Phone" value={detailLead.phone} />
                <DetailRow
                  icon={Calendar}
                  label="Submitted"
                  value={new Date(detailLead.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                />
              </div>
            </div>

            {/* ---- Project Details ---- */}
            <div>
              <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                Project Details
              </h4>
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5 space-y-4">
                <DetailRow
                  icon={Layers}
                  label="Project Type"
                  value={detailLead.project_type}
                />
                <DetailRow
                  icon={MapPin}
                  label="Location"
                  value={detailLead.project_location}
                />
                <DetailRow
                  icon={ArrowUpRight}
                  label="Area"
                  value={detailLead.area}
                />
                <DetailRow
                  icon={DollarSign}
                  label="Budget"
                  value={detailLead.budget}
                />
                <DetailRow
                  icon={Clock}
                  label="Preferred Start Date"
                  value={detailLead.start_date}
                />
                {detailLead.services && detailLead.services.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
                      <Tag size={14} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] font-semibold mb-1.5">
                        Services Interested In
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detailLead.services.map((svc, i) => (
                          <span
                            key={i}
                            className="bg-[rgba(201,168,76,0.1)] text-[#C9A84C] text-xs px-2.5 py-1 font-light"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ---- Message ---- */}
            {detailLead.message && (
              <div>
                <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                  Message
                </h4>
                <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5">
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      size={16}
                      className="text-[#8A8073] mt-0.5 shrink-0"
                    />
                    <p className="text-sm text-[#D4C5A9] font-light leading-relaxed whitespace-pre-wrap">
                      {detailLead.message}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ---- UTM Tracking ---- */}
            {(detailLead.source_page ||
              detailLead.utm_source ||
              detailLead.utm_medium ||
              detailLead.utm_campaign) && (
              <div>
                <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                  Tracking Information
                </h4>
                <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5 space-y-4">
                  <DetailRow
                    icon={Globe}
                    label="Source Page"
                    value={detailLead.source_page}
                    mono
                  />
                  <DetailRow
                    icon={Globe}
                    label="UTM Source"
                    value={detailLead.utm_source}
                    mono
                  />
                  <DetailRow
                    icon={Globe}
                    label="UTM Medium"
                    value={detailLead.utm_medium}
                    mono
                  />
                  <DetailRow
                    icon={Globe}
                    label="UTM Campaign"
                    value={detailLead.utm_campaign}
                    mono
                  />
                </div>
              </div>
            )}

            {/* ---- Status Change ---- */}
            <div>
              <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                Update Status
              </h4>
              <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-xs">
                    <select
                      value={detailLead.status}
                      onChange={(e) =>
                        handleStatusChange(
                          detailLead._id,
                          e.target.value as LeadStatus,
                        )
                      }
                      disabled={detailSaving}
                      className="input-lux w-full appearance-none pr-10 disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8073] pointer-events-none"
                    />
                  </div>
                  {detailSaving && (
                    <Loader2
                      size={16}
                      className="text-[#C9A84C] animate-spin"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* ---- WhatsApp Alert ---- */}
            {detailLead.phone && (
              <div>
                <h4 className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] font-semibold mb-4">
                  Notifications
                </h4>
                <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.1)] p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[#D4C5A9] font-light">
                        Send a WhatsApp alert for this lead
                      </p>
                      <p className="text-xs text-[#8A8073] mt-1">
                        Message will be sent to {detailLead.phone}
                      </p>
                    </div>
                    <button
                      onClick={() => setWhatsappLead(detailLead)}
                      disabled={sendingWhatsApp}
                      className="btn-lux btn-gold text-[0.55rem] py-2.5 px-5 inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <Send size={12} />
                      {sendingWhatsApp ? 'Sending...' : 'Send WhatsApp Alert'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </AdminModal>

      {/* ============================================================ */}
      {/*  Delete Confirmation                                         */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={
          deleteTarget
            ? `Are you sure you want to delete the lead from "${deleteTarget.name}" (${deleteTarget.email})? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete Lead"
        danger
        loading={deleting}
      />

      {/* ============================================================ */}
      {/*  WhatsApp Confirm Dialog                                     */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!whatsappLead}
        onClose={() => setWhatsappLead(null)}
        onConfirm={handleWhatsAppNotify}
        title="Send WhatsApp Alert"
        message={
          whatsappLead
            ? `Send a WhatsApp notification about the lead from "${whatsappLead.name}" to ${whatsappLead.phone}?`
            : ''
        }
        confirmLabel="Send Alert"
        danger={false}
        loading={sendingWhatsApp}
      />
    </div>
  );
}
