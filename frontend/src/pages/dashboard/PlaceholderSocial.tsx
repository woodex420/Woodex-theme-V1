import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Share2,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  ExternalLink,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Search,
  Send,
  Clock,
  Image as ImageIcon,
  X,
  Globe,
  Briefcase,
  Bookmark,
  Music,
  Camera,
  MessageSquare,
} from 'lucide-react';
import StatusBadge from '@/components/dashboard/ui/StatusBadge';
import AdminModal from '@/components/dashboard/ui/AdminModal';
import AdminFormField from '@/components/dashboard/ui/AdminFormField';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type Platform = 'instagram' | 'linkedin' | 'pinterest' | 'facebook' | 'twitter' | 'tiktok';
type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';
type Tab = 'accounts' | 'posts' | 'analytics' | 'autopost';

interface SocialAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  isConnected: boolean;
  followers: number;
  following: number;
  posts: number;
  lastSyncAt: string | null;
}

interface SocialPost {
  id: string;
  platforms: Platform[];
  content: string;
  imageUrl: string;
  link: string;
  scheduledFor: string | null;
  publishedAt: string | null;
  status: PostStatus;
  analytics: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
  };
  source: string;
}

interface PostForm {
  platforms: Platform[];
  content: string;
  imageUrl: string;
  link: string;
  scheduledFor: string;
  status: PostStatus;
}

interface AutoPostSettings {
  masterToggle: boolean;
  blogAutoShare: boolean;
  projectAutoShare: boolean;
}

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const ACCOUNTS_KEY = 'woodex-social-accounts';
const POSTS_KEY = 'woodex-social-posts';
const AUTPOST_KEY = 'woodex-social-autopost';

const PLATFORM_META: Record<Platform, { label: string; color: string; bgColor: string; icon: typeof Globe }> = {
  instagram: { label: 'Instagram', color: '#E1306C', bgColor: 'rgba(225,48,108,0.12)', icon: Camera },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', bgColor: 'rgba(10,102,194,0.12)', icon: Briefcase },
  pinterest: { label: 'Pinterest', color: '#E60023', bgColor: 'rgba(230,0,35,0.12)', icon: Bookmark },
  facebook: { label: 'Facebook', color: '#1877F2', bgColor: 'rgba(24,119,242,0.12)', icon: Globe },
  twitter: { label: 'Twitter / X', color: '#C9A84C', bgColor: 'rgba(201,168,76,0.12)', icon: MessageSquare },
  tiktok: { label: 'TikTok', color: '#EE1D52', bgColor: 'rgba(238,29,82,0.12)', icon: Music },
};

const ALL_PLATFORMS: Platform[] = ['instagram', 'linkedin', 'pinterest', 'facebook', 'twitter', 'tiktok'];

const EMPTY_POST_FORM: PostForm = {
  platforms: [],
  content: '',
  imageUrl: '',
  link: '',
  scheduledFor: '',
  status: 'draft',
};

/* ================================================================== */
/*  Seed data                                                          */
/* ================================================================== */

const SEED_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-ig',
    platform: 'instagram',
    username: '@woodex_interiors',
    displayName: 'Woodex Interiors',
    isConnected: true,
    followers: 12480,
    following: 845,
    posts: 312,
    lastSyncAt: '2026-07-20T08:30:00.000Z',
  },
  {
    id: 'acc-li',
    platform: 'linkedin',
    username: '@woodex-interiors',
    displayName: 'Woodex Interiors',
    isConnected: true,
    followers: 8930,
    following: 1200,
    posts: 187,
    lastSyncAt: '2026-07-20T07:45:00.000Z',
  },
  {
    id: 'acc-pi',
    platform: 'pinterest',
    username: '@woodexdesign',
    displayName: 'Woodex Design',
    isConnected: true,
    followers: 5040,
    following: 320,
    posts: 498,
    lastSyncAt: '2026-07-19T22:10:00.000Z',
  },
  {
    id: 'acc-fb',
    platform: 'facebook',
    username: 'woodexinteriors',
    displayName: 'Woodex Interiors',
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
    lastSyncAt: null,
  },
  {
    id: 'acc-tw',
    platform: 'twitter',
    username: '@woodex_interior',
    displayName: 'Woodex Interior',
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
    lastSyncAt: null,
  },
  {
    id: 'acc-tt',
    platform: 'tiktok',
    username: '@woodexofficial',
    displayName: 'Woodex Official',
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
    lastSyncAt: null,
  },
];

const SEED_POSTS: SocialPost[] = [
  {
    id: 'post-1',
    platforms: ['instagram', 'facebook'],
    content:
      'Transforming a raw loft into a warm, minimalist living space. Natural oak, linen textures, and soft ambient lighting define this project.',
    imageUrl: '',
    link: '',
    scheduledFor: null,
    publishedAt: '2026-07-19T14:00:00.000Z',
    status: 'published',
    analytics: { impressions: 4280, likes: 386, comments: 47, shares: 22, clicks: 118, reach: 3920 },
    source: 'manual',
  },
  {
    id: 'post-2',
    platforms: ['linkedin'],
    content:
      'Our latest hospitality project for The Grand Chai features handcrafted walnut paneling and custom brass fixtures. A space where tradition meets modern craft.',
    imageUrl: '',
    link: 'https://woodexinteriors.com/projects/grand-chai',
    scheduledFor: '2026-07-21T10:00:00.000Z',
    publishedAt: null,
    status: 'scheduled',
    analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
    source: 'manual',
  },
  {
    id: 'post-3',
    platforms: ['pinterest'],
    content:
      'Mood board: Earthy tones, terrazzo floors, and sculptural lighting for a residential wellness retreat.',
    imageUrl: '',
    link: '',
    scheduledFor: null,
    publishedAt: '2026-07-18T11:30:00.000Z',
    status: 'published',
    analytics: { impressions: 6120, likes: 510, comments: 34, shares: 89, clicks: 204, reach: 5400 },
    source: 'auto-blog',
  },
  {
    id: 'post-4',
    platforms: ['instagram', 'twitter'],
    content:
      'Behind the scenes: fabric sampling for our new boutique hotel lobby collection. Swipe for the full palette.',
    imageUrl: '',
    link: '',
    scheduledFor: '2026-07-22T16:00:00.000Z',
    publishedAt: null,
    status: 'scheduled',
    analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
    source: 'manual',
  },
  {
    id: 'post-5',
    platforms: ['linkedin'],
    content:
      'Q2 Reflections: how sustainability shaped our material choices this season. A thread on responsible sourcing.',
    imageUrl: '',
    link: '',
    scheduledFor: null,
    publishedAt: null,
    status: 'draft',
    analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
    source: 'manual',
  },
  {
    id: 'post-6',
    platforms: ['instagram'],
    content:
      'Completed: the Meher residence. A 4,200 sqft family home designed around a central courtyard garden.',
    imageUrl: '',
    link: 'https://woodexinteriors.com/projects/meher',
    scheduledFor: null,
    publishedAt: '2026-07-15T09:00:00.000Z',
    status: 'failed',
    analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
    source: 'auto-project',
  },
];

const SEED_AUTOPPOST: AutoPostSettings = {
  masterToggle: true,
  blogAutoShare: true,
  projectAutoShare: false,
};

/* ================================================================== */
/*  LocalStorage helpers                                                */
/* ================================================================== */

function loadAccounts(): SocialAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(SEED_ACCOUNTS));
  return SEED_ACCOUNTS;
}

function saveAccounts(list: SocialAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

function loadPosts(): SocialPost[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* ignore */
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(SEED_POSTS));
  return SEED_POSTS;
}

function savePosts(list: SocialPost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(list));
}

function loadAutoPost(): AutoPostSettings {
  try {
    const raw = localStorage.getItem(AUTPOST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  localStorage.setItem(AUTPOST_KEY, JSON.stringify(SEED_AUTOPPOST));
  return SEED_AUTOPPOST;
}

function saveAutoPost(settings: AutoPostSettings) {
  localStorage.setItem(AUTPOST_KEY, JSON.stringify(settings));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toLocaleString();
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

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
/*  Platform Icon Badge                                                */
/* ================================================================== */

function PlatformBadge({ platform, size = 'md' }: { platform: Platform; size?: 'sm' | 'md' }) {
  const meta = PLATFORM_META[platform];
  const Icon = meta.icon;
  const dims = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div
      className={`${dims} flex items-center justify-center shrink-0`}
      style={{ backgroundColor: meta.bgColor }}
    >
      <Icon size={iconSize} style={{ color: meta.color }} />
    </div>
  );
}

/* ================================================================== */
/*  Bar Chart (CSS-only, no library)                                   */
/* ================================================================== */

function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <span className="text-[0.6rem] text-[#8A8073]">{formatNumber(d.value)}</span>
            <div
              className="w-full bg-[#C9A84C] transition-all duration-500"
              style={{ height: `${Math.max(pct, 2)}%` }}
            />
            <span className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

export default function PlaceholderSocial() {
  /* ---- tab ---- */
  const [activeTab, setActiveTab] = useState<Tab>('accounts');

  /* ---- data ---- */
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [autoPost, setAutoPost] = useState<AutoPostSettings>(SEED_AUTOPPOST);
  const [loading, setLoading] = useState(true);

  /* ---- accounts ---- */
  const [connectingId, setConnectingId] = useState<string | null>(null);

  /* ---- posts ---- */
  const [postFilter, setPostFilter] = useState<'all' | PostStatus>('all');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [postForm, setPostForm] = useState<PostForm>(EMPTY_POST_FORM);
  const [savingPost, setSavingPost] = useState(false);
  const [deletePostTarget, setDeletePostTarget] = useState<SocialPost | null>(null);
  const [deletingPost, setDeletingPost] = useState(false);

  /* ---- toast ---- */
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /* ================================================================ */
  /*  Data loading                                                     */
  /* ================================================================ */

  const load = useCallback(() => {
    setLoading(true);
    setAccounts(loadAccounts());
    setPosts(loadPosts());
    setAutoPost(loadAutoPost());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ================================================================ */
  /*  Accounts: Connect / Disconnect                                   */
  /* ================================================================ */

  function toggleConnect(account: SocialAccount) {
    setConnectingId(account.id);
    // Simulate network delay
    setTimeout(() => {
      const updated = accounts.map((a) =>
        a.id === account.id
          ? {
              ...a,
              isConnected: !a.isConnected,
              lastSyncAt: !a.isConnected ? new Date().toISOString() : null,
            }
          : a
      );
      saveAccounts(updated);
      setAccounts(updated);
      setConnectingId(null);
      setToast({
        type: 'success',
        message: !account.isConnected
          ? `${account.displayName} connected successfully.`
          : `${account.displayName} disconnected.`,
      });
    }, 800);
  }

  function syncAccount(account: SocialAccount) {
    setConnectingId(account.id);
    setTimeout(() => {
      const updated = accounts.map((a) =>
        a.id === account.id
          ? {
              ...a,
              lastSyncAt: new Date().toISOString(),
              followers: a.followers + Math.floor(Math.random() * 50),
            }
          : a
      );
      saveAccounts(updated);
      setAccounts(updated);
      setConnectingId(null);
      setToast({ type: 'success', message: `${account.displayName} synced.` });
    }, 1200);
  }

  /* ================================================================ */
  /*  Posts: CRUD                                                      */
  /* ================================================================ */

  function openCreatePost() {
    setEditingPost(null);
    setPostForm({ ...EMPTY_POST_FORM });
    setPostModalOpen(true);
  }

  function openEditPost(post: SocialPost) {
    setEditingPost(post);
    setPostForm({
      platforms: [...post.platforms],
      content: post.content,
      imageUrl: post.imageUrl,
      link: post.link,
      scheduledFor: post.scheduledFor ? post.scheduledFor.slice(0, 16) : '',
      status: post.status,
    });
    setPostModalOpen(true);
  }

  function closePostModal() {
    setPostModalOpen(false);
    setEditingPost(null);
    setPostForm({ ...EMPTY_POST_FORM });
  }

  function togglePostPlatform(platform: Platform) {
    setPostForm((p) => ({
      ...p,
      platforms: p.platforms.includes(platform)
        ? p.platforms.filter((pl) => pl !== platform)
        : [...p.platforms, platform],
    }));
  }

  function handleSavePost() {
    if (!postForm.content.trim() || postForm.platforms.length === 0) return;
    setSavingPost(true);

    setTimeout(() => {
      try {
        let updated: SocialPost[];

        if (editingPost) {
          updated = posts.map((p) =>
            p.id === editingPost.id
              ? {
                  ...p,
                  platforms: [...postForm.platforms],
                  content: postForm.content.trim(),
                  imageUrl: postForm.imageUrl.trim(),
                  link: postForm.link.trim(),
                  scheduledFor: postForm.scheduledFor || null,
                  status: postForm.status,
                }
              : p
          );
          setToast({ type: 'success', message: 'Post updated successfully.' });
        } else {
          const newPost: SocialPost = {
            id: uid(),
            platforms: [...postForm.platforms],
            content: postForm.content.trim(),
            imageUrl: postForm.imageUrl.trim(),
            link: postForm.link.trim(),
            scheduledFor: postForm.scheduledFor || null,
            publishedAt:
              postForm.status === 'published' ? new Date().toISOString() : null,
            status: postForm.status,
            analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
            source: 'manual',
          };
          updated = [newPost, ...posts];
          setToast({ type: 'success', message: 'Post created successfully.' });
        }

        savePosts(updated);
        setPosts(updated);
        closePostModal();
      } catch {
        setToast({ type: 'error', message: 'Failed to save post.' });
      } finally {
        setSavingPost(false);
      }
    }, 600);
  }

  function handleDeletePost() {
    if (!deletePostTarget) return;
    setDeletingPost(true);

    setTimeout(() => {
      try {
        const updated = posts.filter((p) => p.id !== deletePostTarget.id);
        savePosts(updated);
        setPosts(updated);
        setToast({ type: 'success', message: 'Post deleted.' });
        setDeletePostTarget(null);
      } catch {
        setToast({ type: 'error', message: 'Failed to delete post.' });
      } finally {
        setDeletingPost(false);
      }
    }, 400);
  }

  /* ================================================================ */
  /*  Auto-post settings                                               */
  /* ================================================================ */

  function toggleAutoPost(key: keyof AutoPostSettings) {
    setAutoPost((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      saveAutoPost(updated);
      return updated;
    });
  }

  /* ================================================================ */
  /*  Derived data                                                     */
  /* ================================================================ */

  const connectedAccounts = useMemo(() => accounts.filter((a) => a.isConnected), [accounts]);

  const filteredPosts = useMemo(
    () => (postFilter === 'all' ? posts : posts.filter((p) => p.status === postFilter)),
    [posts, postFilter]
  );

  const totalFollowers = useMemo(
    () => connectedAccounts.reduce((sum, a) => sum + a.followers, 0),
    [connectedAccounts]
  );

  const totalImpressions = useMemo(
    () => posts.reduce((sum, p) => sum + p.analytics.impressions, 0),
    [posts]
  );

  const totalEngagement = useMemo(
    () =>
      posts.reduce(
        (sum, p) => sum + p.analytics.likes + p.analytics.comments + p.analytics.shares,
        0
      ),
    [posts]
  );

  const engagementRate = useMemo(() => {
    if (totalImpressions === 0) return 0;
    return ((totalEngagement / totalImpressions) * 100).toFixed(1);
  }, [totalImpressions, totalEngagement]);

  const postCounts = useMemo(
    () => ({
      all: posts.length,
      published: posts.filter((p) => p.status === 'published').length,
      scheduled: posts.filter((p) => p.status === 'scheduled').length,
      draft: posts.filter((p) => p.status === 'draft').length,
      failed: posts.filter((p) => p.status === 'failed').length,
    }),
    [posts]
  );

  /* Per-platform analytics breakdown */
  const platformBreakdown = useMemo(() => {
    const map: Record<Platform, { followers: number; impressions: number; engagement: number; posts: number }> = {
      instagram: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
      linkedin: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
      pinterest: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
      facebook: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
      twitter: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
      tiktok: { followers: 0, impressions: 0, engagement: 0, posts: 0 },
    };

    for (const a of accounts) {
      if (a.isConnected) {
        map[a.platform].followers = a.followers;
      }
    }

    for (const p of posts) {
      for (const pl of p.platforms) {
        map[pl].posts += 1;
        map[pl].impressions += p.analytics.impressions;
        map[pl].engagement +=
          p.analytics.likes + p.analytics.comments + p.analytics.shares;
      }
    }

    return map;
  }, [accounts, posts]);

  /* Bar chart: last 7 days mock data derived from posts */
  const barChartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = days.map((_, i) => {
      // Simulate realistic-looking data with slight variation
      const base = totalImpressions / 7;
      const variance = Math.sin(i * 1.3 + 2) * 0.3 + 1;
      return Math.round(base * variance);
    });
    return days.map((label, i) => ({ label, value: values[i] }));
  }, [totalImpressions]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'accounts', label: 'Accounts' },
    { key: 'posts', label: 'Posts' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'autopost', label: 'Auto-Post' },
  ];

  /* ================================================================ */
  /*  Render                                                           */
  /* ================================================================ */

  return (
    <div className="p-8">
      {/* ---- Local storage banner ---- */}
      <div className="bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] px-5 py-3 mb-8 flex items-center gap-3">
        <AlertCircle size={16} className="text-[#C9A84C] shrink-0" />
        <span className="text-sm text-[#D4C5A9] font-light">
          Social media data is stored locally. Backend integration coming soon.
        </span>
      </div>

      {/* ---- Toast ---- */}
      {toast && (
        <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} />
      )}

      {/* ---- Header ---- */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Social Media</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Accounts, posts, and analytics
          </p>
        </div>
        {activeTab === 'posts' && (
          <button
            onClick={openCreatePost}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 inline-flex items-center gap-2"
          >
            <Plus size={13} />
            New Post
          </button>
        )}
      </div>

      {/* ---- Tab navigation ---- */}
      <div className="flex items-center gap-3 mb-8">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`text-[0.55rem] tracking-[0.25em] uppercase font-semibold px-3.5 py-2 transition-colors ${
              activeTab === t.key
                ? 'bg-[#C9A84C] text-[#0A0A0A]'
                : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/*  CONTENT                                                     */}
      {/* ============================================================ */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent animate-spin" />
        </div>
      ) : (
        <>
          {/* ====================================================== */}
          {/*  TAB 1: ACCOUNTS                                       */}
          {/* ====================================================== */}
          {activeTab === 'accounts' && (
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {accounts.map((account) => {
                  const meta = PLATFORM_META[account.platform];
                  const Icon = meta.icon;

                  return (
                    <div
                      key={account.id}
                      className={`bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 flex flex-col transition-colors ${
                        account.isConnected
                          ? 'hover:border-[rgba(201,168,76,0.4)]'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Platform header */}
                      <div className="flex items-center gap-3 mb-4">
                        <PlatformBadge platform={account.platform} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white font-medium truncate">
                            {meta.label}
                          </p>
                          <p className="text-xs text-[#8A8073] font-light truncate">
                            {account.displayName}
                          </p>
                        </div>
                        <StatusBadge
                          status={account.isConnected ? 'published' : 'draft'}
                          label={account.isConnected ? 'Connected' : 'Not Connected'}
                        />
                      </div>

                      {/* Username */}
                      <p className="text-xs text-[#C9A84C] font-medium mb-3 truncate">
                        {account.username}
                      </p>

                      {/* Stats (only show when connected) */}
                      {account.isConnected && (
                        <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-t border-b border-[rgba(201,168,76,0.1)]">
                          <div className="text-center">
                            <p className="text-sm text-white font-medium">
                              {formatNumber(account.followers)}
                            </p>
                            <p className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">
                              Followers
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-white font-medium">
                              {formatNumber(account.following)}
                            </p>
                            <p className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">
                              Following
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-white font-medium">
                              {formatNumber(account.posts)}
                            </p>
                            <p className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">
                              Posts
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Last sync */}
                      <div className="flex items-center gap-1.5 mb-4">
                        <Clock size={11} className="text-[#8A8073]" />
                        <span className="text-[0.55rem] text-[#8A8073] font-light">
                          Last sync: {timeAgo(account.lastSyncAt)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto pt-4 border-t border-[rgba(201,168,76,0.1)] flex items-center gap-2">
                        {account.isConnected ? (
                          <>
                            <button
                              onClick={() => syncAccount(account)}
                              disabled={connectingId === account.id}
                              className="btn-lux btn-outline text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5 disabled:opacity-50"
                            >
                              {connectingId === account.id ? (
                                <div className="w-3 h-3 border border-[#C9A84C] border-t-transparent animate-spin" />
                              ) : (
                                <RefreshCw size={11} />
                              )}
                              Sync
                            </button>
                            <button
                              onClick={() => toggleConnect(account)}
                              disabled={connectingId === account.id}
                              className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-3.5 py-2 bg-[rgba(220,38,38,0.1)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
                            >
                              <X size={11} />
                              Disconnect
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => toggleConnect(account)}
                            disabled={connectingId === account.id}
                            className="btn-lux btn-gold text-[0.55rem] py-2 px-3.5 inline-flex items-center gap-1.5 disabled:opacity-50 w-full justify-center"
                          >
                            {connectingId === account.id ? (
                              <div className="w-3 h-3 border border-[#0A0A0A] border-t-transparent animate-spin" />
                            ) : (
                              <LinkIcon size={11} />
                            )}
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Account summary */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
                  {connectedAccounts.length} of {accounts.length} accounts connected
                </span>
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/*  TAB 2: POSTS                                           */}
          {/* ====================================================== */}
          {activeTab === 'posts' && (
            <div>
              {/* Filter tabs */}
              <div className="flex items-center gap-3 mb-8">
                {(
                  [
                    { key: 'all' as const, label: 'All' },
                    { key: 'published' as const, label: 'Published' },
                    { key: 'scheduled' as const, label: 'Scheduled' },
                    { key: 'draft' as const, label: 'Draft' },
                    { key: 'failed' as const, label: 'Failed' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setPostFilter(f.key)}
                    className={`text-[0.55rem] tracking-[0.25em] uppercase font-semibold px-3.5 py-2 transition-colors ${
                      postFilter === f.key
                        ? 'bg-[#C9A84C] text-[#0A0A0A]'
                        : 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
                    }`}
                  >
                    {f.label}
                    <span className="ml-1 opacity-70">({postCounts[f.key]})</span>
                  </button>
                ))}
              </div>

              {/* Post list */}
              {filteredPosts.length === 0 ? (
                <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] text-center py-16">
                  <Send size={32} className="mx-auto mb-4 text-[#8A8073] opacity-50" />
                  <p className="text-[#8A8073] font-light">
                    No posts {postFilter !== 'all' ? `with status "${postFilter}"` : 'yet'}
                  </p>
                  <button
                    onClick={openCreatePost}
                    className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 inline-flex items-center gap-2"
                  >
                    <Plus size={13} />
                    Create your first post
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 hover:border-[rgba(201,168,76,0.4)] transition-colors"
                    >
                      <div className="flex items-start gap-5">
                        {/* Thumbnail placeholder */}
                        <div className="w-16 h-16 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)] flex items-center justify-center shrink-0">
                          <ImageIcon size={18} className="text-[#8A8073] opacity-50" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {/* Top row: platforms + status */}
                          <div className="flex items-center gap-2 mb-2">
                            {post.platforms.map((pl) => (
                              <PlatformBadge key={pl} platform={pl} size="sm" />
                            ))}
                            <span className="text-[0.5rem] text-[#8A8073] uppercase tracking-wider ml-1">
                              {post.platforms.map((p) => PLATFORM_META[p].label).join(', ')}
                            </span>
                            <span className="ml-auto">
                              <StatusBadge status={post.status} />
                            </span>
                          </div>

                          {/* Content preview */}
                          <p className="text-sm text-[#D4C5A9] font-light leading-relaxed line-clamp-2 mb-2">
                            {post.content}
                          </p>

                          {/* Link */}
                          {post.link && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <LinkIcon size={10} className="text-[#C9A84C]" />
                              <span className="text-xs text-[#C9A84C] truncate max-w-xs">
                                {post.link}
                              </span>
                            </div>
                          )}

                          {/* Timing */}
                          <div className="flex items-center gap-3 text-[0.55rem] text-[#8A8073]">
                            {post.publishedAt && (
                              <span>Published {timeAgo(post.publishedAt)}</span>
                            )}
                            {post.scheduledFor && (
                              <span className="flex items-center gap-1">
                                <Clock size={10} />
                                Scheduled{' '}
                                {new Date(post.scheduledFor).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Globe size={10} />
                              {post.source}
                            </span>
                          </div>
                        </div>

                        {/* Analytics + actions (right side) */}
                        <div className="flex flex-col items-end gap-3 shrink-0">
                          {/* Mini analytics (only for published) */}
                          {post.status === 'published' && (
                            <div className="flex items-center gap-4 text-[0.55rem]">
                              <span className="flex items-center gap-1 text-[#8A8073]">
                                <Eye size={11} />
                                {formatNumber(post.analytics.impressions)}
                              </span>
                              <span className="flex items-center gap-1 text-[#8A8073]">
                                <Heart size={11} />
                                {formatNumber(post.analytics.likes)}
                              </span>
                              <span className="flex items-center gap-1 text-[#8A8073]">
                                <MessageCircle size={11} />
                                {formatNumber(post.analytics.comments)}
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {post.link && (
                              <a
                                href={post.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-lux btn-outline text-[0.55rem] py-1.5 px-2.5 inline-flex items-center gap-1"
                              >
                                <ExternalLink size={10} />
                              </a>
                            )}
                            <button
                              onClick={() => openEditPost(post)}
                              className="btn-lux btn-outline text-[0.55rem] py-1.5 px-2.5 inline-flex items-center gap-1"
                            >
                              <Pencil size={10} />
                            </button>
                            <button
                              onClick={() => setDeletePostTarget(post)}
                              className="text-[0.55rem] tracking-[0.22em] uppercase font-semibold px-2.5 py-1.5 bg-[rgba(220,38,38,0.1)] text-[#DC2626] hover:bg-[rgba(220,38,38,0.2)] transition-colors inline-flex items-center gap-1"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Footer count */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
                      {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================== */}
          {/*  TAB 3: ANALYTICS                                       */}
          {/* ====================================================== */}
          {activeTab === 'analytics' && (
            <div>
              {/* Summary cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                <StatCard
                  icon={Users}
                  label="Total Followers"
                  value={formatNumber(totalFollowers)}
                />
                <StatCard
                  icon={Eye}
                  label="Total Impressions"
                  value={formatNumber(totalImpressions)}
                />
                <StatCard
                  icon={Heart}
                  label="Total Engagement"
                  value={formatNumber(totalEngagement)}
                />
                <StatCard
                  icon={BarChart3}
                  label="Engagement Rate"
                  value={`${engagementRate}%`}
                />
              </div>

              {/* Bar chart: Last 7 days */}
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-6 mb-8">
                <h3 className="font-display text-lg text-white mb-1">Impressions - Last 7 Days</h3>
                <p className="text-xs text-[#8A8073] font-light mb-6">
                  Daily impression breakdown across all connected platforms
                </p>
                <SimpleBarChart data={barChartData} />
              </div>

              {/* Per-platform breakdown */}
              <h3 className="font-display text-lg text-white mb-4">Platform Breakdown</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {ALL_PLATFORMS.map((pl) => {
                  const meta = PLATFORM_META[pl];
                  const data = platformBreakdown[pl];
                  const account = accounts.find((a) => a.platform === pl);

                  return (
                    <div
                      key={pl}
                      className={`bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5 transition-colors ${
                        account?.isConnected
                          ? 'hover:border-[rgba(201,168,76,0.4)]'
                          : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <PlatformBadge platform={pl} />
                        <div>
                          <p className="text-sm text-white font-medium">{meta.label}</p>
                          <p className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">
                            {account?.isConnected ? 'Connected' : 'Not connected'}
                          </p>
                        </div>
                      </div>

                      {account?.isConnected ? (
                        <div className="grid grid-cols-2 gap-3">
                          <MiniStat label="Followers" value={formatNumber(data.followers)} />
                          <MiniStat label="Posts" value={String(data.posts)} />
                          <MiniStat label="Impressions" value={formatNumber(data.impressions)} />
                          <MiniStat label="Engagement" value={formatNumber(data.engagement)} />
                        </div>
                      ) : (
                        <p className="text-xs text-[#8A8073] font-light py-4 text-center">
                          Connect this account to view analytics
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/*  TAB 4: AUTO-POST SETTINGS                              */}
          {/* ====================================================== */}
          {activeTab === 'autopost' && (
            <div>
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] max-w-2xl">
                <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.15)]">
                  <h3 className="font-display text-lg text-white">Auto-Post Settings</h3>
                  <p className="text-xs text-[#8A8073] font-light mt-1">
                    Configure automatic posting rules for your connected platforms.
                  </p>
                </div>

                <div className="divide-y divide-[rgba(201,168,76,0.1)]">
                  {/* Master toggle */}
                  <ToggleRow
                    label="Enable Auto-Posting"
                    description="Master switch for all automatic social media posting. When disabled, no content will be posted automatically."
                    enabled={autoPost.masterToggle}
                    onToggle={() => toggleAutoPost('masterToggle')}
                  />

                  {/* Blog auto-share */}
                  <ToggleRow
                    label="Blog Post Auto-Share"
                    description="Automatically share new blog posts to all connected platforms when published."
                    enabled={autoPost.blogAutoShare && autoPost.masterToggle}
                    onToggle={() => toggleAutoPost('blogAutoShare')}
                    disabled={!autoPost.masterToggle}
                  />

                  {/* Project auto-share */}
                  <ToggleRow
                    label="Project Auto-Share"
                    description="Automatically share new project showcases to connected platforms when they go live."
                    enabled={autoPost.projectAutoShare && autoPost.masterToggle}
                    onToggle={() => toggleAutoPost('projectAutoShare')}
                    disabled={!autoPost.masterToggle}
                  />
                </div>
              </div>

              {/* Info note */}
              <div className="mt-8 bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.15)] px-5 py-4 max-w-2xl">
                <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-[#D4C5A9] font-light leading-relaxed">
                      Auto-posting requires backend integration to monitor content changes and
                      trigger API calls to connected platforms. This feature will be fully
                      functional once the social media backend is connected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================ */}
      {/*  NEW / EDIT POST MODAL                                       */}
      {/* ============================================================ */}
      <AdminModal
        open={postModalOpen}
        onClose={closePostModal}
        title={editingPost ? 'Edit Post' : 'New Post'}
        size="lg"
        footer={
          <>
            <button
              onClick={closePostModal}
              className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePost}
              disabled={
                savingPost || !postForm.content.trim() || postForm.platforms.length === 0
              }
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-50"
            >
              {savingPost ? 'Saving...' : editingPost ? 'Save Changes' : 'Create Post'}
            </button>
          </>
        }
      >
        <div className="space-y-1">
          {/* Platform multi-select */}
          <div className="mb-5">
            <label className="label-lux block mb-2">
              Platforms <span className="text-[#DC2626]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_PLATFORMS.map((pl) => {
                const meta = PLATFORM_META[pl];
                const isSelected = postForm.platforms.includes(pl);
                const account = accounts.find((a) => a.platform === pl);

                return (
                  <button
                    key={pl}
                    type="button"
                    onClick={() => togglePostPlatform(pl)}
                    disabled={!account?.isConnected}
                    className={`flex items-center gap-2 px-3 py-2 text-[0.55rem] tracking-wider uppercase font-semibold transition-colors ${
                      isSelected
                        ? 'bg-[#C9A84C] text-[#0A0A0A]'
                        : account?.isConnected
                        ? 'bg-[rgba(201,168,76,0.08)] text-[#8A8073] hover:text-white'
                        : 'bg-[rgba(138,128,115,0.06)] text-[#6B6355] cursor-not-allowed'
                    }`}
                  >
                    <PlatformBadge platform={pl} size="sm" />
                    {meta.label}
                    {!account?.isConnected && (
                      <span className="text-[0.45rem] opacity-60">(disconnected)</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content (required) */}
          <AdminFormField label="Content" htmlFor="post-content" required>
            <textarea
              id="post-content"
              value={postForm.content}
              onChange={(e) => setPostForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Write your post content..."
              rows={4}
              className="input-lux w-full resize-y"
            />
          </AdminFormField>

          <div className="grid md:grid-cols-2 gap-x-6">
            {/* Image URL */}
            <AdminFormField label="Image URL" htmlFor="post-image" hint="Optional image for the post">
              <input
                id="post-image"
                type="text"
                value={postForm.imageUrl}
                onChange={(e) => setPostForm((p) => ({ ...p, imageUrl: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Link */}
            <AdminFormField label="Link" htmlFor="post-link" hint="Optional URL to link to">
              <input
                id="post-link"
                type="text"
                value={postForm.link}
                onChange={(e) => setPostForm((p) => ({ ...p, link: e.target.value }))}
                placeholder="https://example.com/article"
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Schedule date */}
            <AdminFormField
              label="Schedule For"
              htmlFor="post-schedule"
              hint="Leave empty for immediate posting or draft"
            >
              <input
                id="post-schedule"
                type="datetime-local"
                value={postForm.scheduledFor}
                onChange={(e) => setPostForm((p) => ({ ...p, scheduledFor: e.target.value }))}
                className="input-lux w-full"
              />
            </AdminFormField>

            {/* Status */}
            <AdminFormField label="Status" htmlFor="post-status">
              <select
                id="post-status"
                value={postForm.status}
                onChange={(e) =>
                  setPostForm((p) => ({
                    ...p,
                    status: e.target.value as PostStatus,
                  }))
                }
                className="input-lux w-full"
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>
            </AdminFormField>
          </div>
        </div>
      </AdminModal>

      {/* ============================================================ */}
      {/*  DELETE POST CONFIRMATION                                    */}
      {/* ============================================================ */}
      <ConfirmDialog
        open={!!deletePostTarget}
        onClose={() => setDeletePostTarget(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message={`Are you sure you want to delete this post? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deletingPost}
      />
    </div>
  );
}

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-[rgba(201,168,76,0.12)] flex items-center justify-center">
          <Icon size={16} className="text-[#C9A84C]" />
        </div>
      </div>
      <p className="text-2xl text-white font-display mb-1">{value}</p>
      <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">{label}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center py-2">
      <p className="text-sm text-white font-medium">{value}</p>
      <p className="text-[0.5rem] tracking-wider uppercase text-[#8A8073]">{label}</p>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  disabled = false,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-6 px-6 py-5 transition-opacity ${
        disabled ? 'opacity-40' : ''
      }`}
    >
      <div className="min-w-0">
        <p className="text-sm text-white font-medium">{label}</p>
        <p className="text-xs text-[#8A8073] font-light mt-1 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="shrink-0 focus:outline-none disabled:cursor-not-allowed"
      >
        {enabled ? (
          <ToggleRight size={32} className="text-[#C9A84C]" />
        ) : (
          <ToggleLeft size={32} className="text-[#3A3530]" />
        )}
      </button>
    </div>
  );
}
