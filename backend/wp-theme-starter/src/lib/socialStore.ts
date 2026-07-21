// Social Media Store - Manage connected accounts, posts, analytics

export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "twitter" | "pinterest" | "tiktok";

export type SocialAccount = {
  id: string;
  platform: SocialPlatform;
  username: string;
  displayName: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  isConnected: boolean;
  lastSyncAt?: string;
  followers: number;
  following: number;
  posts: number;
};

export type SocialPost = {
  id: string;
  platforms: SocialPlatform[];
  content: string;
  imageUrl?: string;
  link?: string;
  scheduledFor?: string;
  publishedAt?: string;
  status: "draft" | "scheduled" | "publishing" | "published" | "failed";
  analytics?: {
    impressions: number;
    likes: number;
    comments: number;
    shares: number;
    clicks: number;
    reach: number;
  };
  errorMessage?: string;
  source: "manual" | "auto-blog" | "auto-project";
  sourceId?: string;
  createdAt: string;
};

export type SocialAnalytics = {
  totalFollowers: number;
  totalImpressions: number;
  totalEngagement: number;
  engagementRate: number;
  topPlatform: SocialPlatform;
  byPlatform: Record<SocialPlatform, {
    followers: number;
    impressions: number;
    engagement: number;
  }>;
  last7Days: { date: string; impressions: number; engagement: number }[];
};

const STORAGE_KEY = "wp-social-store-v1";

const defaultAccounts: SocialAccount[] = [
  {
    id: "sa-1",
    platform: "instagram",
    username: "@wpinterior",
    displayName: "WP Interior Studio",
    avatarUrl: "",
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    followers: 12480,
    following: 342,
    posts: 186,
  },
  {
    id: "sa-2",
    platform: "linkedin",
    username: "wp-interior-studio",
    displayName: "WP Interior Studio",
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    followers: 8930,
    following: 1240,
    posts: 64,
  },
  {
    id: "sa-3",
    platform: "pinterest",
    username: "@wpinterior",
    displayName: "WP Interior Studio",
    isConnected: true,
    lastSyncAt: new Date().toISOString(),
    followers: 5640,
    following: 89,
    posts: 124,
  },
  {
    id: "sa-4",
    platform: "facebook",
    username: "wpinterior",
    displayName: "WP Interior Studio",
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
  },
  {
    id: "sa-5",
    platform: "twitter",
    username: "@wpinterior",
    displayName: "WP Interior Studio",
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
  },
  {
    id: "sa-6",
    platform: "tiktok",
    username: "@wpinterior",
    displayName: "WP Interior Studio",
    isConnected: false,
    followers: 0,
    following: 0,
    posts: 0,
  },
];

const defaultPosts: SocialPost[] = [
  {
    id: "sp-1",
    platforms: ["instagram", "linkedin", "pinterest"],
    content: "Just completed: A stunning 4,200 sq ft office transformation in Gulberg, Lahore. Where vision meets craftsmanship. 🏛️✨ #interiordesign #pakistan #lahore #officedesign #wpinterior",
    imageUrl: "/images/services/office.jpg",
    link: "https://wpinterior.com/portfolio/atelier-9",
    status: "published",
    publishedAt: "2025-03-18T10:30:00Z",
    analytics: { impressions: 4820, likes: 312, comments: 28, shares: 14, clicks: 89, reach: 3940 },
    source: "auto-project",
    sourceId: "1",
    createdAt: "2025-03-18T10:00:00Z",
  },
  {
    id: "sp-2",
    platforms: ["instagram", "linkedin"],
    content: "New blog post: How Much Does Office Interior Design Cost in Lahore in 2025? Real numbers from our latest 12 projects. Read the full breakdown. 📊 #officedesign #interior #pakistan",
    imageUrl: "/images/services/office.jpg",
    link: "https://wpinterior.com/blog/office-interior-design-cost-lahore-2025",
    status: "published",
    publishedAt: "2025-03-18T12:00:00Z",
    analytics: { impressions: 2840, likes: 198, comments: 42, shares: 22, clicks: 156, reach: 2340 },
    source: "auto-blog",
    sourceId: "office-interior-design-cost-lahore-2025",
    createdAt: "2025-03-18T11:30:00Z",
  },
  {
    id: "sp-3",
    platforms: ["instagram"],
    content: "Behind the scenes: 3D walkthrough of our latest restaurant design. From sketch to photorealistic render in 48 hours. 🎬🏛️ #3dvisualization #restaurantdesign #interiordesign",
    imageUrl: "/images/hero-3d.jpg", // fallback: restaurant image not generated
    status: "scheduled",
    scheduledFor: "2025-03-25T15:00:00Z",
    source: "manual",
    createdAt: "2025-03-20T09:00:00Z",
  },
];

function loadData() {
  try {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveData(data: { accounts: SocialAccount[]; posts: SocialPost[] }) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  } catch {
    // ignore
  }
}

import { useState, useEffect, useCallback } from "react";

export function useSocialStore() {
  const [accounts, setAccounts] = useState<SocialAccount[]>(defaultAccounts);
  const [posts, setPosts] = useState<SocialPost[]>(defaultPosts);
  const [autoPostEnabled, setAutoPostEnabled] = useState(true);
  const [autoPostForBlog, setAutoPostForBlog] = useState(true);
  const [autoPostForProject, setAutoPostForProject] = useState(true);

  useEffect(() => {
    const data = loadData();
    if (data) {
      if (Array.isArray(data.accounts)) setAccounts(data.accounts);
      if (Array.isArray(data.posts)) setPosts(data.posts);
    }
  }, []);

  const persist = useCallback((next: { accounts: SocialAccount[]; posts: SocialPost[] }) => {
    saveData(next);
  }, []);

  // Account operations
  const connectAccount = useCallback(
    (id: string, accountData: Partial<SocialAccount>) => {
      setAccounts((prev) => {
        const next = prev.map((a) =>
          a.id === id
            ? { ...a, ...accountData, isConnected: true, lastSyncAt: new Date().toISOString() }
            : a
        );
        persist({ accounts: next, posts });
        return next;
      });
    },
    [posts, persist]
  );

  const disconnectAccount = useCallback(
    (id: string) => {
      setAccounts((prev) => {
        const next = prev.map((a) =>
          a.id === id ? { ...a, isConnected: false, accessToken: undefined, refreshToken: undefined } : a
        );
        persist({ accounts: next, posts });
        return next;
      });
    },
    [posts, persist]
  );

  const updateAccount = useCallback(
    (id: string, patch: Partial<SocialAccount>) => {
      setAccounts((prev) => {
        const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a));
        persist({ accounts: next, posts });
        return next;
      });
    },
    [posts, persist]
  );

  // Post operations
  const createPost = useCallback(
    (data: Partial<SocialPost> & Pick<SocialPost, "platforms" | "content">) => {
      const id = `sp-${Date.now()}`;
      const newPost: SocialPost = {
        ...data,
        id,
        status: data.scheduledFor ? "scheduled" : "draft",
        source: data.source || "manual",
        createdAt: new Date().toISOString(),
      };
      setPosts((prev) => {
        const next = [newPost, ...prev];
        persist({ accounts, posts: next });
        return next;
      });
      return id;
    },
    [accounts, persist]
  );

  const updatePost = useCallback(
    (id: string, patch: Partial<SocialPost>) => {
      setPosts((prev) => {
        const next = prev.map((p) => (p.id === id ? { ...p, ...patch } : p));
        persist({ accounts, posts: next });
        return next;
      });
    },
    [accounts, persist]
  );

  const deletePost = useCallback(
    (id: string) => {
      setPosts((prev) => {
        const next = prev.filter((p) => p.id !== id);
        persist({ accounts, posts: next });
        return next;
      });
    },
    [accounts, persist]
  );

  const publishPost = useCallback(
    (id: string) => {
      setPosts((prev) => {
        const next = prev.map((p): SocialPost =>
          p.id === id
            ? {
                ...p,
                status: "published" as const,
                publishedAt: new Date().toISOString(),
                analytics: { impressions: 0, likes: 0, comments: 0, shares: 0, clicks: 0, reach: 0 },
              }
            : p
        );
        persist({ accounts, posts: next });
        return next;
      });
    },
    [accounts, persist]
  );

  // Auto-post when blog post / project is published
  const autoPostContent = useCallback(
    (data: { title: string; excerpt: string; link: string; image?: string; source: "blog" | "project"; sourceId: string }) => {
      if (!autoPostEnabled) return;
      if (data.source === "blog" && !autoPostForBlog) return;
      if (data.source === "project" && !autoPostForProject) return;

      const connectedPlatforms = accounts
        .filter((a) => a.isConnected)
        .map((a) => a.platform);

      if (connectedPlatforms.length === 0) return;

      const postContent = `${data.title}\n\n${data.excerpt}\n\n${data.link} #interiordesign #pakistan #wpinterior`;
      const id = createPost({
        platforms: connectedPlatforms as SocialPlatform[],
        content: postContent,
        imageUrl: data.image,
        link: data.link,
        scheduledFor: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        source: (data.source === "blog" ? "auto-blog" : "auto-project") as SocialPost["source"],
        sourceId: data.sourceId,
      });
      return id;
    },
    [accounts, autoPostEnabled, autoPostForBlog, autoPostForProject, createPost]
  );

  // Analytics
  const getAnalytics = useCallback((): SocialAnalytics => {
    const totalFollowers = accounts.reduce((sum, a) => sum + a.followers, 0);
    const totalImpressions = posts.reduce((sum, p) => sum + (p.analytics?.impressions || 0), 0);
    const totalEngagement = posts.reduce(
      (sum, p) => sum + (p.analytics?.likes || 0) + (p.analytics?.comments || 0) + (p.analytics?.shares || 0),
      0
    );
    const engagementRate = totalImpressions > 0 ? (totalEngagement / totalImpressions) * 100 : 0;
    const byPlatform = accounts.reduce(
      (acc, a) => {
        acc[a.platform] = {
          followers: a.followers,
          impressions: posts.filter((p) => p.platforms.includes(a.platform)).reduce((s, p) => s + (p.analytics?.impressions || 0), 0),
          engagement: posts.filter((p) => p.platforms.includes(a.platform)).reduce(
            (s, p) => s + (p.analytics?.likes || 0) + (p.analytics?.comments || 0) + (p.analytics?.shares || 0),
            0
          ),
        };
        return acc;
      },
      {} as SocialAnalytics["byPlatform"]
    );
    const topPlatform = (Object.keys(byPlatform) as SocialPlatform[]).reduce(
      (top, p) => (byPlatform[p]?.followers > (byPlatform[top]?.followers || 0) ? p : top),
      "instagram" as SocialPlatform
    );
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        impressions: Math.floor(Math.random() * 1000) + 500,
        engagement: Math.floor(Math.random() * 200) + 50,
      };
    }).reverse();
    return { totalFollowers, totalImpressions, totalEngagement, engagementRate, topPlatform, byPlatform, last7Days };
  }, [accounts, posts]);

  return {
    accounts,
    posts,
    autoPostEnabled,
    setAutoPostEnabled,
    autoPostForBlog,
    setAutoPostForBlog,
    autoPostForProject,
    setAutoPostForProject,
    connectAccount,
    disconnectAccount,
    updateAccount,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    autoPostContent,
    getAnalytics,
  };
}

export type SocialStoreApi = ReturnType<typeof useSocialStore>;
