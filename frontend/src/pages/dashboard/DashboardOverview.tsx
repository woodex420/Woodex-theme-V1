import { useEffect, useState } from 'react';
import { Users, ShoppingBag, FolderOpen, BookOpen, Mail, Phone, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/auth';

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  project_type: string;
  message: string;
  status: string;
  createdAt: string;
}

interface Stats {
  leads: number;
  services: number;
  projects: number;
  articles: number;
}

function StatCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: number }) {
  return (
    <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6">
      <div className="flex items-center justify-between mb-4">
        <Icon size={22} className="text-[#C9A84C]" />
        <span className="text-[0.55rem] tracking-[0.3em] uppercase text-[#8A8073]">{label}</span>
      </div>
      <div className="font-display text-4xl text-white">{value}</div>
    </div>
  );
}

export default function DashboardOverview() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Stats>({ leads: 0, services: 0, projects: 0, articles: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const [leadsRes, servicesRes, projectsRes, articlesRes] = await Promise.all([
        adminFetch<{ leads: Lead[] }>('/admin/leads'),
        adminFetch<{ services: unknown[] }>('/admin/services'),
        adminFetch<{ projects: unknown[] }>('/admin/projects'),
        adminFetch<{ articles: unknown[] }>('/admin/articles'),
      ]);
      setLeads(leadsRes.leads || []);
      setStats({
        leads: (leadsRes.leads || []).length,
        services: (servicesRes.services || []).length,
        projects: (projectsRes.projects || []).length,
        articles: (articlesRes.articles || []).length,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Dashboard</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">Overview & analytics</p>
        </div>
        <button onClick={loadData} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8">
          <span className="text-sm text-[#DC2626]">{error}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Users} label="Total Leads" value={stats.leads} />
        <StatCard icon={ShoppingBag} label="Services" value={stats.services} />
        <StatCard icon={FolderOpen} label="Projects" value={stats.projects} />
        <StatCard icon={BookOpen} label="Articles" value={stats.articles} />
      </div>

      {/* Recent Leads */}
      <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
        <div className="px-6 py-5 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
          <h2 className="font-display text-xl text-white">Recent Leads</h2>
          <a href="/dashboard/leads" className="text-[0.55rem] tracking-[0.25em] uppercase text-[#C9A84C] hover:text-white transition-colors">
            View all →
          </a>
        </div>
        {leads.length === 0 ? (
          <div className="text-center py-16 text-[#8A8073] font-light">
            <Users size={32} className="mx-auto mb-4 opacity-50" />
            <p>No leads yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] border-b border-[rgba(201,168,76,0.1)]">
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Project</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead._id} className="border-b border-[rgba(201,168,76,0.06)] hover:bg-[rgba(201,168,76,0.03)] transition-colors">
                    <td className="px-6 py-4">
                      <span className={`inline-block text-[0.55rem] tracking-[0.2em] uppercase font-semibold px-2.5 py-1 ${
                        lead.status === 'new'
                          ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]'
                          : lead.status === 'read'
                          ? 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]'
                          : 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]'
                      }`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-white font-medium">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-[#D4C5A9] flex flex-col gap-0.5">
                        <span className="flex items-center gap-1.5"><Mail size={10} /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1.5"><Phone size={10} /> {lead.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#D4C5A9]">{lead.project_type || '—'}</span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#8A8073]">{new Date(lead.createdAt).toLocaleDateString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
