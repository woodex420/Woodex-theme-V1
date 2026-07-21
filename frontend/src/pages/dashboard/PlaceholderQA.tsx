import { useState, useCallback, useRef } from 'react';
import {
  TestTube,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronRight,
  Clock,
  Shield,
  Globe,
  Database,
  AlertTriangle,
  Info,
  Download,
  History,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface TestResult {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  duration: number;
  details: string;
  error?: string;
}

interface TestGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tests: TestResult[];
}

interface TestHistoryEntry {
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  duration: number;
  results: { id: string; name: string; status: string; details: string; error?: string }[];
}

interface ErrorIssue {
  testId: string;
  testName: string;
  category: 'critical' | 'warning' | 'info';
  message: string;
}

/* ------------------------------------------------------------------ */
/*  API Base                                                           */
/* ------------------------------------------------------------------ */

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

/* ------------------------------------------------------------------ */
/*  Toast component                                                    */
/* ------------------------------------------------------------------ */

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}) {
  const colors = {
    success:
      'bg-[rgba(22,163,74,0.15)] border-[rgba(22,163,74,0.4)] text-[#16A34A]',
    error:
      'bg-[rgba(220,38,38,0.15)] border-[rgba(220,38,38,0.4)] text-[#DC2626]',
    info: 'bg-[rgba(201,168,76,0.12)] border-[rgba(201,168,76,0.35)] text-[#C9A84C]',
  };

  return (
    <div
      className={`fixed top-6 right-6 z-50 border px-5 py-3.5 flex items-center gap-3 shadow-2xl animate-slide-in ${colors[type]}`}
      style={{
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-current opacity-60 hover:opacity-100 transition-opacity"
      >
        <XCircle size={14} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Test runner helper                                                 */
/* ------------------------------------------------------------------ */

async function runTest(
  testId: string,
  updater: (id: string, patch: Partial<TestResult>) => void,
  fn: () => Promise<string>
): Promise<boolean> {
  updater(testId, { status: 'running', duration: 0, details: '' });
  const start = performance.now();
  try {
    const details = await fn();
    const duration = Math.round(performance.now() - start);
    updater(testId, { status: 'passed', duration, details });
    return true;
  } catch (err: unknown) {
    const duration = Math.round(performance.now() - start);
    const msg = err instanceof Error ? err.message : 'Unknown error';
    updater(testId, { status: 'failed', duration, details: '', error: msg });
    return false;
  }
}

/* ------------------------------------------------------------------ */
/*  Test definitions builder                                           */
/* ------------------------------------------------------------------ */

function buildInitialGroups(): TestGroup[] {
  return [
    {
      id: 'api-health',
      name: 'API Health',
      icon: HeartPulse,
      tests: [
        {
          id: 'health-check',
          name: 'Backend Health Check',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'auth-login',
          name: 'Auth Login Endpoint',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'settings-auth',
          name: 'Settings Endpoint (Auth)',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
    {
      id: 'content-endpoints',
      name: 'Content Endpoints',
      icon: Globe,
      tests: [
        {
          id: 'services-get',
          name: 'Services GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'projects-get',
          name: 'Projects GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'articles-get',
          name: 'Articles GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'pages-get',
          name: 'Pages GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
    {
      id: 'admin-endpoints',
      name: 'Admin Endpoints',
      icon: Shield,
      tests: [
        {
          id: 'admin-services',
          name: 'Admin Services (with auth)',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'admin-leads',
          name: 'Admin Leads GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'admin-media',
          name: 'Admin Media GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'admin-conversations',
          name: 'Admin Conversations GET',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
    {
      id: 'frontend-routes',
      name: 'Frontend Routes',
      icon: Layout,
      tests: [
        {
          id: 'route-home',
          name: 'Home Page Loads',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'route-login',
          name: 'Login Page Loads',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'route-dashboard',
          name: 'Dashboard Loads',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
    {
      id: 'website-structure',
      name: 'Website Structure',
      icon: Layout,
      tests: [
        {
          id: 'ws-public-pages',
          name: 'Public Pages Return 200',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'ws-services-api',
          name: 'Services Public API Returns Data',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'ws-projects-api',
          name: 'Projects Public API Returns Data',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'ws-articles-api',
          name: 'Articles Public API Returns Data',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
    {
      id: 'data-integrity',
      name: 'Data Integrity',
      icon: Database,
      tests: [
        {
          id: 'integrity-services',
          name: 'Services Count > 0',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-projects',
          name: 'Projects Count > 0',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-empty-fields',
          name: 'No Empty Required Fields',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-dup-slugs-services',
          name: 'No Duplicate Slugs (Services)',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-dup-slugs-projects',
          name: 'No Duplicate Slugs (Projects)',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-dup-slugs-articles',
          name: 'No Duplicate Slugs (Articles)',
          status: 'idle',
          duration: 0,
          details: '',
        },
        {
          id: 'integrity-settings-fields',
          name: 'Admin Settings Has Required Fields',
          status: 'idle',
          duration: 0,
          details: '',
        },
      ],
    },
  ];
}

/* ------------------------------------------------------------------ */
/*  Placeholder icons for groups (not in lucide)                       */
/* ------------------------------------------------------------------ */

function HeartPulse({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
      <path d="M3 12h9l2 -3" />
      <path d="M14 12h7" />
    </svg>
  );
}

function Layout({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function TestStatusIcon({ status }: { status: TestResult['status'] }) {
  switch (status) {
    case 'running':
      return <Loader2 size={16} className="text-[#C9A84C] animate-spin" />;
    case 'passed':
      return <CheckCircle2 size={16} className="text-[#16A34A]" />;
    case 'failed':
      return <XCircle size={16} className="text-[#DC2626]" />;
    default:
      return (
        <div className="w-4 h-4 border border-[rgba(201,168,76,0.3)]" />
      );
  }
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color = 'text-white',
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <Icon size={16} className="text-[#C9A84C] opacity-70" />
        <span className="text-[0.55rem] tracking-[0.2em] uppercase font-semibold text-[#8A8073]">
          {label}
        </span>
      </div>
      <div className={`font-display text-3xl ${color}`}>{value}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Error Finder: categorize test failures into severity levels        */
/* ------------------------------------------------------------------ */

function analyzeErrors(groups: TestGroup[]): ErrorIssue[] {
  const issues: ErrorIssue[] = [];
  const allTests = groups.flatMap((g) => g.tests);

  for (const test of allTests) {
    if (test.status !== 'failed' || !test.error) continue;

    const id = test.id;
    const errorLower = test.error.toLowerCase();

    // Critical: API down, auth broken
    if (
      id === 'health-check' ||
      id === 'auth-login' ||
      errorLower.includes('http 500') ||
      errorLower.includes('http 401') ||
      errorLower.includes('http 403') ||
      errorLower.includes('not authenticated') ||
      errorLower.includes('session expired') ||
      errorLower.includes('fetch failed') ||
      errorLower.includes('networkerror') ||
      errorLower.includes('econnrefused')
    ) {
      issues.push({
        testId: id,
        testName: test.name,
        category: 'critical',
        message: test.error,
      });
      continue;
    }

    // Warning: missing data, empty fields, duplicate slugs
    if (
      errorLower.includes('empty') ||
      errorLower.includes('missing') ||
      errorLower.includes('duplicate') ||
      errorLower.includes('count') ||
      errorLower.includes('no ') ||
      errorLower.includes('not found') ||
      id.startsWith('integrity-') ||
      id.startsWith('ws-')
    ) {
      issues.push({
        testId: id,
        testName: test.name,
        category: 'warning',
        message: test.error,
      });
      continue;
    }

    // Info: everything else
    issues.push({
      testId: id,
      testName: test.name,
      category: 'info',
      message: test.error,
    });
  }

  return issues;
}

/* ------------------------------------------------------------------ */
/*  Test History: localStorage persistence                             */
/* ------------------------------------------------------------------ */

const HISTORY_KEY = 'woodex-qa-history';
const MAX_HISTORY = 10;

function loadHistory(): TestHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entry: TestHistoryEntry): TestHistoryEntry[] {
  const history = loadHistory();
  history.unshift(entry);
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  return trimmed;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function PlaceholderQA() {
  const [groups, setGroups] = useState<TestGroup[]>(buildInitialGroups);
  const [running, setRunning] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(['api-health'])
  );
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const startTimeRef = useRef<number>(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [history, setHistory] = useState<TestHistoryEntry[]>(loadHistory);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [errorIssues, setErrorIssues] = useState<ErrorIssue[]>([]);

  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  /* -- Show toast --------------------------------------------------- */
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message, type });
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    },
    []
  );

  /* -- Update a single test inside groups --------------------------- */
  const updateTest = useCallback(
    (testId: string, patch: Partial<TestResult>) => {
      setGroups((prev) =>
        prev.map((g) => ({
          ...g,
          tests: g.tests.map((t) =>
            t.id === testId ? { ...t, ...patch } : t
          ),
        }))
      );
    },
    []
  );

  /* -- Toggle group expand ------------------------------------------ */
  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  /* -- Toggle test expand ------------------------------------------- */
  const toggleTest = useCallback((testId: string) => {
    setExpandedTests((prev) => {
      const next = new Set(prev);
      if (next.has(testId)) next.delete(testId);
      else next.add(testId);
      return next;
    });
  }, []);

  /* ================================================================ */
  /*  RE-RUN SINGLE TEST                                               */
  /* ================================================================ */
  const rerunSingleTest = useCallback(
    async (testId: string) => {
      if (running) return;

      // Find the test's current runner logic by ID
      const testDef = groups.flatMap((g) => g.tests).find((t) => t.id === testId);
      if (!testDef) return;

      setRunning(true);

      const authedFetch = async (url: string, opts?: RequestInit) => {
        const token = getToken() ?? '';
        return fetch(`${API_BASE}${url}`, {
          ...opts,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...opts?.headers,
          },
        });
      };

      const frontendBase = window.location.origin;

      // Map test IDs to their runner functions
      const runners: Record<string, () => Promise<string>> = {
        'health-check': async () => {
          const res = await fetch(`${API_BASE}/health`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (data.status !== 'ok') throw new Error(`Unexpected status: ${data.status}`);
          return `Status: ok | Uptime: ${Math.round(data.uptime)}s`;
        },
        'auth-login': async () => {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'woodex2024' }),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          if (!data.token) throw new Error('No token returned');
          return `Token received | User: ${data.user?.username} (${data.user?.role})`;
        },
        'settings-auth': async () => {
          const res = await authedFetch('/admin/settings');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          return `Settings loaded | Site: ${data.settings?.siteName || 'N/A'}`;
        },
        'services-get': async () => {
          const res = await authedFetch('/admin/services');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.services) ? data.services.length : 0;
          return `Returned ${count} services`;
        },
        'projects-get': async () => {
          const res = await authedFetch('/admin/projects');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.projects) ? data.projects.length : 0;
          return `Returned ${count} projects`;
        },
        'articles-get': async () => {
          const res = await authedFetch('/admin/blog');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.posts) ? data.posts.length : 0;
          return `Returned ${count} articles`;
        },
        'pages-get': async () => {
          const res = await authedFetch('/admin/pages');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.pages) ? data.pages.length : 0;
          return `Returned ${count} pages`;
        },
        'admin-services': async () => {
          const res = await authedFetch('/admin/services');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.services) ? data.services.length : 0;
          return `Authenticated access: ${count} services returned`;
        },
        'admin-leads': async () => {
          const res = await authedFetch('/admin/leads');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.leads) ? data.leads.length : 0;
          return `Authenticated access: ${count} leads returned`;
        },
        'admin-media': async () => {
          const res = await authedFetch('/admin/media');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.media) ? data.media.length : 0;
          return `Authenticated access: ${count} media items returned`;
        },
        'admin-conversations': async () => {
          const res = await authedFetch('/admin/conversations');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.conversations) ? data.conversations.length : 0;
          return `Authenticated access: ${count} conversations returned`;
        },
        'route-home': async () => {
          const res = await fetch(`${frontendBase}/`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
        },
        'route-login': async () => {
          const res = await fetch(`${frontendBase}/login`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
        },
        'route-dashboard': async () => {
          const res = await fetch(`${frontendBase}/dashboard`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
        },
        // Website Structure tests
        'ws-public-pages': async () => {
          const pages = ['/', '/about', '/services', '/projects', '/insights', '/contact'];
          const results: string[] = [];
          for (const page of pages) {
            const res = await fetch(`${frontendBase}${page}`);
            results.push(`${page}:${res.status}`);
            if (!res.ok) throw new Error(`Page ${page} returned HTTP ${res.status}`);
          }
          return `All ${pages.length} pages OK: ${results.join(', ')}`;
        },
        'ws-services-api': async () => {
          const res = await authedFetch('/admin/services');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.services) ? data.services.length : 0;
          if (count === 0) throw new Error('Services API returned 0 items');
          return `Services API: ${count} items returned`;
        },
        'ws-projects-api': async () => {
          const res = await authedFetch('/admin/projects');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.projects) ? data.projects.length : 0;
          if (count === 0) throw new Error('Projects API returned 0 items');
          return `Projects API: ${count} items returned`;
        },
        'ws-articles-api': async () => {
          const res = await authedFetch('/admin/blog');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.posts) ? data.posts.length : 0;
          if (count === 0) throw new Error('Articles API returned 0 items');
          return `Articles API: ${count} items returned`;
        },
        // Data Integrity tests
        'integrity-services': async () => {
          const res = await authedFetch('/admin/services');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.services) ? data.services.length : 0;
          if (count === 0) throw new Error('Services array is empty');
          return `${count} services found (expected > 0)`;
        },
        'integrity-projects': async () => {
          const res = await authedFetch('/admin/projects');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const count = Array.isArray(data.projects) ? data.projects.length : 0;
          if (count === 0) throw new Error('Projects array is empty');
          return `${count} projects found (expected > 0)`;
        },
        'integrity-empty-fields': async () => {
          const issues: string[] = [];
          const svcRes = await authedFetch('/admin/services');
          if (svcRes.ok) {
            const svcData = await svcRes.json();
            const svcs = Array.isArray(svcData.services) ? svcData.services : [];
            const emptyName = svcs.filter((s: Record<string, unknown>) => !s.name || String(s.name).trim() === '');
            if (emptyName.length > 0) issues.push(`${emptyName.length} service(s) missing name`);
          }
          const projRes = await authedFetch('/admin/projects');
          if (projRes.ok) {
            const projData = await projRes.json();
            const projs = Array.isArray(projData.projects) ? projData.projects : [];
            const emptyTitle = projs.filter((p: Record<string, unknown>) => !p.title || String(p.title).trim() === '');
            if (emptyTitle.length > 0) issues.push(`${emptyTitle.length} project(s) missing title`);
          }
          if (issues.length > 0) throw new Error(issues.join('; '));
          return 'All services have names, all projects have titles';
        },
        'integrity-dup-slugs-services': async () => {
          const res = await authedFetch('/admin/services');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const svcs = Array.isArray(data.services) ? data.services : [];
          const slugs = svcs.map((s: Record<string, unknown>) => s.slug).filter(Boolean);
          const seen = new Set<string>();
          const dups: string[] = [];
          for (const slug of slugs) {
            const s = String(slug);
            if (seen.has(s)) dups.push(s);
            seen.add(s);
          }
          if (dups.length > 0) throw new Error(`Duplicate slugs in services: ${[...new Set(dups)].join(', ')}`);
          return `All ${slugs.length} service slugs are unique`;
        },
        'integrity-dup-slugs-projects': async () => {
          const res = await authedFetch('/admin/projects');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const projs = Array.isArray(data.projects) ? data.projects : [];
          const slugs = projs.map((p: Record<string, unknown>) => p.slug).filter(Boolean);
          const seen = new Set<string>();
          const dups: string[] = [];
          for (const slug of slugs) {
            const s = String(slug);
            if (seen.has(s)) dups.push(s);
            seen.add(s);
          }
          if (dups.length > 0) throw new Error(`Duplicate slugs in projects: ${[...new Set(dups)].join(', ')}`);
          return `All ${slugs.length} project slugs are unique`;
        },
        'integrity-dup-slugs-articles': async () => {
          const res = await authedFetch('/admin/blog');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const posts = Array.isArray(data.posts) ? data.posts : [];
          const slugs = posts.map((p: Record<string, unknown>) => p.slug).filter(Boolean);
          const seen = new Set<string>();
          const dups: string[] = [];
          for (const slug of slugs) {
            const s = String(slug);
            if (seen.has(s)) dups.push(s);
            seen.add(s);
          }
          if (dups.length > 0) throw new Error(`Duplicate slugs in articles: ${[...new Set(dups)].join(', ')}`);
          return `All ${slugs.length} article slugs are unique`;
        },
        'integrity-settings-fields': async () => {
          const res = await authedFetch('/admin/settings');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const s = data.settings || {};
          const missing: string[] = [];
          if (!s.siteName || String(s.siteName).trim() === '') missing.push('siteName');
          if (!s.contactPhone || String(s.contactPhone).trim() === '') missing.push('contactPhone');
          if (missing.length > 0) throw new Error(`Settings missing required fields: ${missing.join(', ')}`);
          return `Settings has siteName="${s.siteName}" and contactPhone="${s.contactPhone}"`;
        },
      };

      const runner = runners[testId];
      if (runner) {
        await runTest(testId, updateTest, runner);
      } else {
        updateTest(testId, {
          status: 'failed',
          duration: 0,
          details: '',
          error: 'Unknown test ID - cannot re-run',
        });
      }

      setRunning(false);
      showToast(`Test "${testDef.name}" re-run complete`, 'info');
    },
    [running, groups, updateTest, showToast]
  );

  /* ================================================================ */
  /*  RUN ALL TESTS                                                   */
  /* ================================================================ */
  const runAllTests = useCallback(async () => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = performance.now();
    setTotalDuration(0);

    // Reset all tests
    setGroups(buildInitialGroups());
    setExpandedGroups(new Set(['api-health']));
    setExpandedTests(new Set());
    setErrorIssues([]);

    let passed = 0;
    let failed = 0;

    // -- Helper: authenticated fetch with token --
    const authedFetch = async (url: string, opts?: RequestInit) => {
      const token = getToken() ?? '';
      return fetch(`${API_BASE}${url}`, {
        ...opts,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...opts?.headers,
        },
      });
    };

    // -- 1. API HEALTH --

    setExpandedGroups((prev) => new Set([...prev, 'api-health']));

    const healthOk = await runTest('health-check', updateTest, async () => {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(`Unexpected status: ${data.status}`);
      return `Status: ok | Uptime: ${Math.round(data.uptime)}s | Timestamp: ${data.timestamp}`;
    });
    healthOk ? passed++ : failed++;

    const loginOk = await runTest('auth-login', updateTest, async () => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'woodex2024' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.token) throw new Error('No token returned');
      return `Token received | User: ${data.user?.username} (${data.user?.role})`;
    });
    loginOk ? passed++ : failed++;

    const settingsOk = await runTest('settings-auth', updateTest, async () => {
      const res = await authedFetch('/admin/settings');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return `Settings loaded | Site: ${data.settings?.siteName || 'N/A'}`;
    });
    settingsOk ? passed++ : failed++;

    // -- 2. CONTENT ENDPOINTS --

    setExpandedGroups((prev) => new Set([...prev, 'content-endpoints']));

    const servicesOk = await runTest('services-get', updateTest, async () => {
      const res = await authedFetch('/admin/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.services) ? data.services.length : 0;
      return `Returned ${count} services`;
    });
    servicesOk ? passed++ : failed++;

    const projectsOk = await runTest('projects-get', updateTest, async () => {
      const res = await authedFetch('/admin/projects');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.projects) ? data.projects.length : 0;
      return `Returned ${count} projects`;
    });
    projectsOk ? passed++ : failed++;

    const articlesOk = await runTest('articles-get', updateTest, async () => {
      const res = await authedFetch('/admin/blog');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.posts) ? data.posts.length : 0;
      return `Returned ${count} articles`;
    });
    articlesOk ? passed++ : failed++;

    const pagesOk = await runTest('pages-get', updateTest, async () => {
      const res = await authedFetch('/admin/pages');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.pages) ? data.pages.length : 0;
      return `Returned ${count} pages`;
    });
    pagesOk ? passed++ : failed++;

    // -- 3. ADMIN ENDPOINTS --

    setExpandedGroups((prev) => new Set([...prev, 'admin-endpoints']));

    const adminServicesOk = await runTest('admin-services', updateTest, async () => {
      const res = await authedFetch('/admin/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.services) ? data.services.length : 0;
      return `Authenticated access: ${count} services returned`;
    });
    adminServicesOk ? passed++ : failed++;

    const adminLeadsOk = await runTest('admin-leads', updateTest, async () => {
      const res = await authedFetch('/admin/leads');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.leads) ? data.leads.length : 0;
      return `Authenticated access: ${count} leads returned`;
    });
    adminLeadsOk ? passed++ : failed++;

    const adminMediaOk = await runTest('admin-media', updateTest, async () => {
      const res = await authedFetch('/admin/media');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.media) ? data.media.length : 0;
      return `Authenticated access: ${count} media items returned`;
    });
    adminMediaOk ? passed++ : failed++;

    const adminConversationsOk = await runTest(
      'admin-conversations',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/conversations');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const count = Array.isArray(data.conversations) ? data.conversations.length : 0;
        return `Authenticated access: ${count} conversations returned`;
      }
    );
    adminConversationsOk ? passed++ : failed++;

    // -- 4. FRONTEND ROUTES --

    setExpandedGroups((prev) => new Set([...prev, 'frontend-routes']));

    const frontendBase = window.location.origin;

    const homeOk = await runTest('route-home', updateTest, async () => {
      const res = await fetch(`${frontendBase}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
    });
    homeOk ? passed++ : failed++;

    const loginOk2 = await runTest('route-login', updateTest, async () => {
      const res = await fetch(`${frontendBase}/login`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
    });
    loginOk2 ? passed++ : failed++;

    const dashOk = await runTest('route-dashboard', updateTest, async () => {
      const res = await fetch(`${frontendBase}/dashboard`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return `HTTP ${res.status} | Content-Type: ${res.headers.get('content-type') || 'N/A'}`;
    });
    dashOk ? passed++ : failed++;

    // -- 5. WEBSITE STRUCTURE --

    setExpandedGroups((prev) => new Set([...prev, 'website-structure']));

    const wsPublicPages = await runTest('ws-public-pages', updateTest, async () => {
      const pages = ['/', '/about', '/services', '/projects', '/insights', '/contact'];
      const failed: string[] = [];
      const succeeded: string[] = [];
      for (const page of pages) {
        const res = await fetch(`${frontendBase}${page}`);
        if (!res.ok) failed.push(`${page}(${res.status})`);
        else succeeded.push(`${page}(${res.status})`);
      }
      if (failed.length > 0) throw new Error(`Failed pages: ${failed.join(', ')}`);
      return `All ${pages.length} pages returned 200: ${succeeded.join(', ')}`;
    });
    wsPublicPages ? passed++ : failed++;

    const wsServicesApi = await runTest('ws-services-api', updateTest, async () => {
      const res = await authedFetch('/admin/services');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.services) ? data.services.length : 0;
      if (count === 0) throw new Error('Services public API returned 0 items');
      return `Services API: ${count} items returned`;
    });
    wsServicesApi ? passed++ : failed++;

    const wsProjectsApi = await runTest('ws-projects-api', updateTest, async () => {
      const res = await authedFetch('/admin/projects');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.projects) ? data.projects.length : 0;
      if (count === 0) throw new Error('Projects public API returned 0 items');
      return `Projects API: ${count} items returned`;
    });
    wsProjectsApi ? passed++ : failed++;

    const wsArticlesApi = await runTest('ws-articles-api', updateTest, async () => {
      const res = await authedFetch('/admin/blog');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const count = Array.isArray(data.posts) ? data.posts.length : 0;
      if (count === 0) throw new Error('Articles public API returned 0 items');
      return `Articles API: ${count} items returned`;
    });
    wsArticlesApi ? passed++ : failed++;

    // -- 6. DATA INTEGRITY --

    setExpandedGroups((prev) => new Set([...prev, 'data-integrity']));

    const integrityServices = await runTest(
      'integrity-services',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/services');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const count = Array.isArray(data.services) ? data.services.length : 0;
        if (count === 0) throw new Error('Services array is empty');
        return `${count} services found (expected > 0)`;
      }
    );
    integrityServices ? passed++ : failed++;

    const integrityProjects = await runTest(
      'integrity-projects',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/projects');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const count = Array.isArray(data.projects) ? data.projects.length : 0;
        if (count === 0) throw new Error('Projects array is empty');
        return `${count} projects found (expected > 0)`;
      }
    );
    integrityProjects ? passed++ : failed++;

    const integrityEmptyFields = await runTest(
      'integrity-empty-fields',
      updateTest,
      async () => {
        const issues: string[] = [];

        // Check services for missing name
        const svcRes = await authedFetch('/admin/services');
        if (svcRes.ok) {
          const svcData = await svcRes.json();
          const svcs = Array.isArray(svcData.services) ? svcData.services : [];
          const emptyName = svcs.filter(
            (s: Record<string, unknown>) => !s.name || String(s.name).trim() === ''
          );
          if (emptyName.length > 0) {
            issues.push(`${emptyName.length} service(s) missing name`);
          }
        }

        // Check projects for missing title
        const projRes = await authedFetch('/admin/projects');
        if (projRes.ok) {
          const projData = await projRes.json();
          const projs = Array.isArray(projData.projects) ? projData.projects : [];
          const emptyTitle = projs.filter(
            (p: Record<string, unknown>) => !p.title || String(p.title).trim() === ''
          );
          if (emptyTitle.length > 0) {
            issues.push(`${emptyTitle.length} project(s) missing title`);
          }
        }

        if (issues.length > 0) throw new Error(issues.join('; '));
        return 'All services have names, all projects have titles';
      }
    );
    integrityEmptyFields ? passed++ : failed++;

    const integrityDupSlugsServices = await runTest(
      'integrity-dup-slugs-services',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/services');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const svcs = Array.isArray(data.services) ? data.services : [];
        const slugs = svcs.map((s: Record<string, unknown>) => s.slug).filter(Boolean);
        const seen = new Set<string>();
        const dups: string[] = [];
        for (const slug of slugs) {
          const s = String(slug);
          if (seen.has(s)) dups.push(s);
          seen.add(s);
        }
        if (dups.length > 0)
          throw new Error(`Duplicate slugs in services: ${[...new Set(dups)].join(', ')}`);
        return `All ${slugs.length} service slugs are unique`;
      }
    );
    integrityDupSlugsServices ? passed++ : failed++;

    const integrityDupSlugsProjects = await runTest(
      'integrity-dup-slugs-projects',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/projects');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const projs = Array.isArray(data.projects) ? data.projects : [];
        const slugs = projs.map((p: Record<string, unknown>) => p.slug).filter(Boolean);
        const seen = new Set<string>();
        const dups: string[] = [];
        for (const slug of slugs) {
          const s = String(slug);
          if (seen.has(s)) dups.push(s);
          seen.add(s);
        }
        if (dups.length > 0)
          throw new Error(`Duplicate slugs in projects: ${[...new Set(dups)].join(', ')}`);
        return `All ${slugs.length} project slugs are unique`;
      }
    );
    integrityDupSlugsProjects ? passed++ : failed++;

    const integrityDupSlugsArticles = await runTest(
      'integrity-dup-slugs-articles',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/blog');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const posts = Array.isArray(data.posts) ? data.posts : [];
        const slugs = posts.map((p: Record<string, unknown>) => p.slug).filter(Boolean);
        const seen = new Set<string>();
        const dups: string[] = [];
        for (const slug of slugs) {
          const s = String(slug);
          if (seen.has(s)) dups.push(s);
          seen.add(s);
        }
        if (dups.length > 0)
          throw new Error(`Duplicate slugs in articles: ${[...new Set(dups)].join(', ')}`);
        return `All ${slugs.length} article slugs are unique`;
      }
    );
    integrityDupSlugsArticles ? passed++ : failed++;

    const integritySettingsFields = await runTest(
      'integrity-settings-fields',
      updateTest,
      async () => {
        const res = await authedFetch('/admin/settings');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const s = data.settings || {};
        const missing: string[] = [];
        if (!s.siteName || String(s.siteName).trim() === '') missing.push('siteName');
        if (!s.contactPhone || String(s.contactPhone).trim() === '') missing.push('contactPhone');
        if (missing.length > 0)
          throw new Error(`Settings missing required fields: ${missing.join(', ')}`);
        return `Settings has siteName="${s.siteName}" and contactPhone="${s.contactPhone}"`;
      }
    );
    integritySettingsFields ? passed++ : failed++;

    // -- Finish --

    const elapsed = Math.round(performance.now() - startTimeRef.current);
    setTotalDuration(elapsed);
    setRunning(false);

    const total = passed + failed;

    // Analyze errors for the error finder
    // We need to read current groups state, so we snapshot from the latest updateTest calls
    setGroups((finalGroups) => {
      const issues = analyzeErrors(finalGroups);
      setErrorIssues(issues);
      return finalGroups;
    });

    // Save history
    const snapshot = groups; // current state after all updates
    const allSnapTests = snapshot.flatMap((g) => g.tests);
    const historyEntry: TestHistoryEntry = {
      timestamp: new Date().toISOString(),
      total: allSnapTests.length,
      passed: allSnapTests.filter((t) => t.status === 'passed').length,
      failed: allSnapTests.filter((t) => t.status === 'failed').length,
      duration: elapsed,
      results: allSnapTests.map((t) => ({
        id: t.id,
        name: t.name,
        status: t.status,
        details: t.details,
        error: t.error,
      })),
    };
    const updatedHistory = saveHistory(historyEntry);
    setHistory(updatedHistory);

    if (failed === 0) {
      showToast(
        `All ${total} tests passed in ${elapsed}ms`,
        'success'
      );
    } else {
      showToast(
        `${failed} of ${total} tests failed (${elapsed}ms)`,
        'error'
      );
    }
  }, [running, updateTest, showToast, groups]);

  /* ================================================================ */
  /*  EXPORT REPORT                                                    */
  /* ================================================================ */
  const exportReport = useCallback(() => {
    const allSnapTests = groups.flatMap((g) => g.tests);
    const issues = analyzeErrors(groups);
    const report = {
      exportedAt: new Date().toISOString(),
      summary: {
        total: allSnapTests.length,
        passed: allSnapTests.filter((t) => t.status === 'passed').length,
        failed: allSnapTests.filter((t) => t.status === 'failed').length,
        duration: totalDuration,
      },
      groups: groups.map((g) => ({
        name: g.name,
        tests: g.tests.map((t) => ({
          name: t.name,
          status: t.status,
          duration: t.duration,
          details: t.details,
          error: t.error,
        })),
      })),
      errorAnalysis: {
        critical: issues.filter((i) => i.category === 'critical').length,
        warning: issues.filter((i) => i.category === 'warning').length,
        info: issues.filter((i) => i.category === 'info').length,
        issues,
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `woodex-qa-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report exported as JSON', 'success');
  }, [groups, totalDuration, showToast]);

  /* ================================================================ */
  /*  Computed values                                                  */
  /* ================================================================ */
  const allTests = groups.flatMap((g) => g.tests);
  const totalTests = allTests.length;
  const passedTests = allTests.filter((t) => t.status === 'passed').length;
  const failedTests = allTests.filter((t) => t.status === 'failed').length;
  const isRunning = allTests.some((t) => t.status === 'running');
  const allDone = allTests.every(
    (t) => t.status === 'passed' || t.status === 'failed'
  );

  const criticalCount = errorIssues.filter((i) => i.category === 'critical').length;
  const warningCount = errorIssues.filter((i) => i.category === 'warning').length;
  const infoCount = errorIssues.filter((i) => i.category === 'info').length;

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="p-8">
      {/* -- Inject keyframes ------------------------------------------- */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* -- Toast ---------------------------------------------------- */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* -- Header --------------------------------------------------- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">QA Tests</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Run automated tests -- {totalTests} tests across {groups.length} groups
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(allDone || allTests.some((t) => t.status !== 'idle')) && (
            <button
              onClick={runAllTests}
              disabled={running}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              {running ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
              Re-run
            </button>
          )}
          {allDone && !isRunning && (
            <button
              onClick={exportReport}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              <Download size={13} />
              Export Report
            </button>
          )}
          <button
            onClick={runAllTests}
            disabled={running}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5"
          >
            {running ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Play size={13} />
            )}
            {running ? 'Running...' : 'Run All Tests'}
          </button>
        </div>
      </div>

      {/* -- Summary Cards -------------------------------------------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <SummaryCard
          icon={TestTube}
          label="Total Tests"
          value={totalTests}
        />
        <SummaryCard
          icon={CheckCircle2}
          label="Passed"
          value={passedTests}
          color="text-[#16A34A]"
        />
        <SummaryCard
          icon={XCircle}
          label="Failed"
          value={failedTests}
          color={failedTests > 0 ? 'text-[#DC2626]' : 'text-white'}
        />
        <SummaryCard
          icon={Clock}
          label="Duration"
          value={totalDuration > 0 ? `${totalDuration}ms` : '--'}
          color="text-[#D4C5A9]"
        />
      </div>

      {/* -- Progress Bar --------------------------------------------- */}
      {isRunning && (
        <div className="mb-8">
          <div className="h-0.5 bg-[rgba(201,168,76,0.1)] overflow-hidden">
            <div
              className="h-full bg-[#C9A84C] transition-all duration-300 ease-out"
              style={{
                width: `${(passedTests + failedTests) / totalTests * 100}%`,
              }}
            />
          </div>
          <p className="text-[0.6rem] text-[#8A8073] mt-2 tracking-wide uppercase">
            Running test {Math.min(passedTests + failedTests + 1, totalTests)} of{' '}
            {totalTests}
          </p>
        </div>
      )}

      {/* -- Test Groups ---------------------------------------------- */}
      <div className="space-y-4">
        {groups.map((group) => {
          const groupPassed = group.tests.filter(
            (t) => t.status === 'passed'
          ).length;
          const groupFailed = group.tests.filter(
            (t) => t.status === 'failed'
          ).length;
          const groupRunning = group.tests.some(
            (t) => t.status === 'running'
          );
          const groupExpanded = expandedGroups.has(group.id);
          const GroupIcon = group.icon;

          return (
            <div
              key={group.id}
              className="bg-[#111110] border border-[rgba(201,168,76,0.2)] overflow-hidden"
            >
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {groupExpanded ? (
                    <ChevronDown
                      size={16}
                      className="text-[#8A8073] transition-transform"
                    />
                  ) : (
                    <ChevronRight
                      size={16}
                      className="text-[#8A8073] transition-transform"
                    />
                  )}
                  <GroupIcon size={18} className="text-[#C9A84C]" />
                  <span className="font-display text-lg text-white">
                    {group.name}
                  </span>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073] ml-1">
                    ({group.tests.length} tests)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {groupRunning && (
                    <Loader2
                      size={14}
                      className="text-[#C9A84C] animate-spin"
                    />
                  )}
                  {groupPassed > 0 && (
                    <span className="text-[0.55rem] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 text-[#16A34A] bg-[rgba(22,163,74,0.12)]">
                      {groupPassed} passed
                    </span>
                  )}
                  {groupFailed > 0 && (
                    <span className="text-[0.55rem] tracking-[0.15em] uppercase font-semibold px-2 py-0.5 text-[#DC2626] bg-[rgba(220,38,38,0.12)]">
                      {groupFailed} failed
                    </span>
                  )}
                </div>
              </button>

              {/* Group Tests */}
              {groupExpanded && (
                <div className="border-t border-[rgba(201,168,76,0.1)]">
                  {group.tests.map((test) => (
                    <div key={test.id}>
                      {/* Test Row */}
                      <button
                        onClick={() => toggleTest(test.id)}
                        className="w-full flex items-center justify-between px-6 py-3.5 hover:bg-[rgba(201,168,76,0.03)] transition-colors border-b border-[rgba(201,168,76,0.06)] last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <TestStatusIcon status={test.status} />
                          <span className="text-sm text-[#D4C5A9] font-light">
                            {test.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {test.duration > 0 && (
                            <span className="text-[0.55rem] tracking-wider text-[#8A8073] tabular-nums">
                              {test.duration}ms
                            </span>
                          )}
                          {/* Re-run button for failed tests */}
                          {test.status === 'failed' && !running && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                rerunSingleTest(test.id);
                              }}
                              className="text-[0.55rem] tracking-[0.12em] uppercase font-semibold px-2.5 py-1 text-[#C9A84C] bg-[rgba(201,168,76,0.1)] hover:bg-[rgba(201,168,76,0.2)] transition-colors flex items-center gap-1.5"
                              title={`Re-run ${test.name}`}
                            >
                              <RefreshCw size={10} />
                              Re-run
                            </button>
                          )}
                          {(test.details || test.error) && (
                            <ChevronDown
                              size={12}
                              className={`text-[#8A8073] transition-transform ${
                                expandedTests.has(test.id) ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </button>

                      {/* Test Details */}
                      {expandedTests.has(test.id) &&
                        (test.details || test.error) && (
                          <div className="px-6 pb-4 pt-1 border-b border-[rgba(201,168,76,0.06)]">
                            {test.error ? (
                              <div className="bg-[rgba(220,38,38,0.08)] border border-[rgba(220,38,38,0.2)] px-4 py-3 text-sm text-[#DC2626] font-light">
                                {test.error}
                              </div>
                            ) : (
                              <div className="bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] px-4 py-3 text-sm text-[#D4C5A9] font-light">
                                {test.details}
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* -- Empty state ---------------------------------------------- */}
      {!isRunning && allTests.every((t) => t.status === 'idle') && (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-16 text-center mt-4">
          <TestTube
            size={48}
            className="text-[#C9A84C] mx-auto mb-6 opacity-40"
          />
          <p className="text-[#8A8073] font-light max-w-md mx-auto leading-relaxed mb-6">
            Click "Run All Tests" to execute the automated test suite against
            your backend API, frontend routes, and data integrity checks.
          </p>
          <button
            onClick={runAllTests}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-6"
          >
            <Play size={13} />
            Run All Tests
          </button>
        </div>
      )}

      {/* -- Results summary after completion ------------------------- */}
      {allDone && !isRunning && (
        <div
          className={`mt-8 border px-6 py-4 flex items-center gap-4 ${
            failedTests === 0
              ? 'bg-[rgba(22,163,74,0.08)] border-[rgba(22,163,74,0.25)]'
              : 'bg-[rgba(220,38,38,0.08)] border-[rgba(220,38,38,0.25)]'
          }`}
        >
          {failedTests === 0 ? (
            <CheckCircle2 size={20} className="text-[#16A34A] shrink-0" />
          ) : (
            <XCircle size={20} className="text-[#DC2626] shrink-0" />
          )}
          <div className="flex-1">
            <p
              className={`text-sm font-medium ${
                failedTests === 0 ? 'text-[#16A34A]' : 'text-[#DC2626]'
              }`}
            >
              {failedTests === 0
                ? `All ${totalTests} tests passed`
                : `${failedTests} of ${totalTests} tests failed`}
            </p>
            <p className="text-xs text-[#8A8073] mt-0.5">
              Completed in {totalDuration}ms
            </p>
          </div>
          <StatusBadge
            status={failedTests === 0 ? 'published' : 'lost'}
            label={failedTests === 0 ? 'All Passed' : 'Has Failures'}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* ERROR FINDER ANALYSIS                                         */}
      {/* ============================================================ */}
      {allDone && !isRunning && errorIssues.length > 0 && (
        <div className="mt-8 bg-[#111110] border border-[rgba(201,168,76,0.2)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.1)]">
            <div className="flex items-center gap-3 mb-3">
              <AlertTriangle size={16} className="text-[#C9A84C]" />
              <span className="font-display text-lg text-white">
                Error Finder Analysis
              </span>
            </div>
            <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#8A8073]">
              {errorIssues.length} issue{errorIssues.length !== 1 ? 's' : ''} categorized by severity
            </p>
          </div>

          {/* Summary counts */}
          <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.1)] flex items-center gap-6">
            {criticalCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#DC2626]" />
                <span className="text-xs text-[#DC2626] font-semibold tracking-wide uppercase">
                  {criticalCount} Critical
                </span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#F59E0B]" />
                <span className="text-xs text-[#F59E0B] font-semibold tracking-wide uppercase">
                  {warningCount} Warning{warningCount !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {infoCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-[#3B82F6]" />
                <span className="text-xs text-[#3B82F6] font-semibold tracking-wide uppercase">
                  {infoCount} Info
                </span>
              </div>
            )}
          </div>

          {/* Issue list */}
          <div className="divide-y divide-[rgba(201,168,76,0.06)]">
            {errorIssues.map((issue) => (
              <div
                key={issue.testId}
                className="px-6 py-3.5 flex items-start gap-3 hover:bg-[rgba(201,168,76,0.03)] transition-colors"
              >
                <div className="shrink-0 mt-0.5">
                  {issue.category === 'critical' && (
                    <XCircle size={14} className="text-[#DC2626]" />
                  )}
                  {issue.category === 'warning' && (
                    <AlertTriangle size={14} className="text-[#F59E0B]" />
                  )}
                  {issue.category === 'info' && (
                    <Info size={14} className="text-[#3B82F6]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#D4C5A9] font-medium">
                      {issue.testName}
                    </span>
                    <span
                      className={`text-[0.45rem] tracking-[0.15em] uppercase font-bold px-1.5 py-0.5 ${
                        issue.category === 'critical'
                          ? 'text-[#DC2626] bg-[rgba(220,38,38,0.12)]'
                          : issue.category === 'warning'
                          ? 'text-[#F59E0B] bg-[rgba(245,158,11,0.12)]'
                          : 'text-[#3B82F6] bg-[rgba(59,130,246,0.12)]'
                      }`}
                    >
                      {issue.category}
                    </span>
                  </div>
                  <p className="text-xs text-[#8A8073] font-light mt-1">
                    {issue.message}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!running) rerunSingleTest(issue.testId);
                  }}
                  disabled={running}
                  className="shrink-0 text-[0.5rem] tracking-[0.12em] uppercase font-semibold px-2 py-1 text-[#C9A84C] bg-[rgba(201,168,76,0.08)] hover:bg-[rgba(201,168,76,0.18)] transition-colors flex items-center gap-1"
                >
                  <RefreshCw size={9} />
                  Fix Check
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TEST HISTORY                                                  */}
      {/* ============================================================ */}
      <div className="mt-8 bg-[#111110] border border-[rgba(201,168,76,0.2)] overflow-hidden">
        <button
          onClick={() => setHistoryOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-[rgba(201,168,76,0.04)] transition-colors"
        >
          <div className="flex items-center gap-3">
            <History size={16} className="text-[#C9A84C]" />
            <span className="font-display text-lg text-white">
              Test History
            </span>
            <span className="text-[0.5rem] tracking-[0.2em] uppercase text-[#8A8073]">
              ({history.length} run{history.length !== 1 ? 's' : ''})
            </span>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#8A8073] transition-transform ${
              historyOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {historyOpen && (
          <div className="border-t border-[rgba(201,168,76,0.1)]">
            {/* CSS-only bar chart */}
            {history.length > 0 && (
              <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.06)]">
                <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#8A8073] mb-3 font-semibold">
                  Pass / Fail History
                </p>
                <div className="flex items-end gap-2 h-20">
                  {history.slice().reverse().map((entry, idx) => {
                    const maxCount = Math.max(
                      ...history.map((h) => Math.max(h.passed, h.failed, 1)),
                      1
                    );
                    const passHeight = Math.max((entry.passed / maxCount) * 100, 4);
                    const failHeight = Math.max((entry.failed / maxCount) * 100, 4);
                    const barDate = new Date(entry.timestamp);
                    const label = `${barDate.getMonth() + 1}/${barDate.getDate()}`;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1 min-w-0">
                        <div className="flex items-end gap-px w-full" style={{ height: '60px' }}>
                          {entry.passed > 0 && (
                            <div
                              className="flex-1 bg-[#16A34A] opacity-80 hover:opacity-100 transition-opacity"
                              style={{ height: `${passHeight}%` }}
                              title={`${entry.passed} passed`}
                            />
                          )}
                          {entry.failed > 0 && (
                            <div
                              className="flex-1 bg-[#DC2626] opacity-80 hover:opacity-100 transition-opacity"
                              style={{ height: `${failHeight}%` }}
                              title={`${entry.failed} failed`}
                            />
                          )}
                          {entry.passed === 0 && entry.failed === 0 && (
                            <div
                              className="flex-1 bg-[#8A8073] opacity-40"
                              style={{ height: '4px' }}
                            />
                          )}
                        </div>
                        <span className="text-[0.45rem] text-[#8A8073] truncate w-full text-center">
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#16A34A]" />
                    <span className="text-[0.45rem] text-[#8A8073] uppercase tracking-wider">
                      Passed
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#DC2626]" />
                    <span className="text-[0.45rem] text-[#8A8073] uppercase tracking-wider">
                      Failed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* History entries list */}
            {history.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-[#8A8073] text-sm font-light">
                  No test history yet. Run tests to start tracking.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(201,168,76,0.06)]">
                {history.map((entry, idx) => {
                  const date = new Date(entry.timestamp);
                  const dateStr = date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const timeStr = date.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const allPassed = entry.failed === 0;
                  return (
                    <div
                      key={idx}
                      className="px-6 py-3.5 flex items-center gap-4 hover:bg-[rgba(201,168,76,0.03)] transition-colors"
                    >
                      <div className="shrink-0">
                        {allPassed ? (
                          <CheckCircle2 size={14} className="text-[#16A34A]" />
                        ) : (
                          <XCircle size={14} className="text-[#DC2626]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#D4C5A9] font-light">
                            {dateStr} at {timeStr}
                          </span>
                          <span className="text-[0.5rem] tracking-wider text-[#8A8073]">
                            {entry.duration}ms
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.5rem] tracking-[0.12em] uppercase font-semibold px-2 py-0.5 text-[#16A34A] bg-[rgba(22,163,74,0.1)]">
                          {entry.passed} passed
                        </span>
                        {entry.failed > 0 && (
                          <span className="text-[0.5rem] tracking-[0.12em] uppercase font-semibold px-2 py-0.5 text-[#DC2626] bg-[rgba(220,38,38,0.1)]">
                            {entry.failed} failed
                          </span>
                        )}
                        <span className="text-[0.5rem] tracking-wider text-[#8A8073] tabular-nums">
                          {entry.total} total
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
