// Social Media Admin - Manage accounts, posts, and analytics

import { useState, useMemo } from "react";
import { PageHeader, Button, Modal, FormField, TextInput, TextareaInput, EmptyState, StatusBadge } from "./AdminLayout";
import { useSocialStore, type SocialPlatform, type SocialPost } from "../../lib/socialStore";
import { IconCheck, IconClose, IconArrowRight, IconPlus, IconTrash } from "../Icons";
import { cn } from "../../utils/cn";

const PLATFORM_INFO: Record<SocialPlatform, { name: string; icon: string; color: string }> = {
  facebook: { name: "Facebook", icon: "f", color: "bg-blue-600" },
  instagram: { name: "Instagram", icon: "📷", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
  linkedin: { name: "LinkedIn", icon: "in", color: "bg-blue-700" },
  twitter: { name: "Twitter / X", icon: "𝕏", color: "bg-black" },
  pinterest: { name: "Pinterest", icon: "P", color: "bg-red-600" },
  tiktok: { name: "TikTok", icon: "♪", color: "bg-black" },
};

const PLATFORMS: SocialPlatform[] = ["facebook", "instagram", "linkedin", "twitter", "pinterest", "tiktok"];

export function SocialAdmin() {
  const social = useSocialStore();
  const [tab, setTab] = useState<"accounts" | "posts" | "analytics" | "settings">("accounts");
  const [showConnectModal, setShowConnectModal] = useState<SocialPlatform | null>(null);
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "draft" | "scheduled" | "published">("all");

  const analytics = social.getAnalytics();
  const filteredPosts = useMemo(
    () => social.posts.filter((p) => filter === "all" || p.status === filter).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [social.posts, filter]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Social Media"
        description="Manage social accounts, schedule posts, and view analytics across all platforms."
      />

      <div className="card p-1.5 flex gap-1 max-w-2xl">
        {[
          { id: "accounts", label: "Accounts", icon: "🔗" },
          { id: "posts", label: "Posts", icon: "📝" },
          { id: "analytics", label: "Analytics", icon: "📊" },
          { id: "settings", label: "Auto-Post", icon: "⚙️" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as never)}
            className={cn(
              "flex-1 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2",
              tab === t.id ? "bg-espresso text-white shadow-md" : "text-text-gray hover:bg-cream-50"
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "accounts" && (
        <AccountsTab
          social={social}
          onConnect={(p) => setShowConnectModal(p)}
        />
      )}

      {tab === "posts" && (
        <PostsTab
          posts={filteredPosts}
          filter={filter}
          setFilter={setFilter}
          onNew={() => { setEditingPost(null); setShowPostForm(true); }}
          onEdit={(p) => { setEditingPost(p); setShowPostForm(true); }}
          social={social}
        />
      )}

      {tab === "analytics" && <AnalyticsTab analytics={analytics} accounts={social.accounts} />}

      {tab === "settings" && <AutoPostSettings social={social} />}

      {showConnectModal && (
        <ConnectModal
          platform={showConnectModal}
          account={social.accounts.find((a) => a.platform === showConnectModal)!}
          onClose={() => setShowConnectModal(null)}
          onConnect={(username, displayName) => {
            social.connectAccount(social.accounts.find((a) => a.platform === showConnectModal)!.id, {
              username,
              displayName,
              isConnected: true,
            });
            setShowConnectModal(null);
          }}
        />
      )}

      {showPostForm && (
        <PostForm
          post={editingPost}
          social={social}
          onClose={() => { setShowPostForm(false); setEditingPost(null); }}
        />
      )}
    </div>
  );
}

function AccountsTab({ social, onConnect }: { social: ReturnType<typeof useSocialStore>; onConnect: (p: SocialPlatform) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {social.accounts.map((a) => {
        const info = PLATFORM_INFO[a.platform];
        return (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg", info.color)}>
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-serif text-base text-heading">{info.name}</h3>
                  <p className="text-[10px] text-text-gray">{a.username}</p>
                </div>
              </div>
              <StatusBadge status={a.isConnected ? "published" : "draft"} />
            </div>
            {a.isConnected ? (
              <>
                <div className="grid grid-cols-3 gap-2 my-4 text-center">
                  <div>
                    <div className="font-serif text-lg text-heading">{a.followers.toLocaleString()}</div>
                    <div className="text-[9px] text-text-gray uppercase tracking-widest">Followers</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg text-heading">{a.posts}</div>
                    <div className="text-[9px] text-text-gray uppercase tracking-widest">Posts</div>
                  </div>
                  <div>
                    <div className="font-serif text-lg text-heading">{a.following}</div>
                    <div className="text-[9px] text-text-gray uppercase tracking-widest">Following</div>
                  </div>
                </div>
                <p className="text-[10px] text-text-gray mb-3">Last sync: {a.lastSyncAt ? new Date(a.lastSyncAt).toLocaleString() : "Never"}</p>
                <Button size="sm" variant="ghost" onClick={() => { if (confirm("Disconnect this account?")) social.disconnectAccount(a.id); }}>
                  <IconClose className="w-3 h-3" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button size="sm" variant="primary" onClick={() => onConnect(a.platform)}>
                <IconArrowRight className="w-3 h-3" />
                Connect
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ConnectModal({ platform, account, onClose, onConnect }: { platform: SocialPlatform; account: any; onClose: () => void; onConnect: (u: string, d: string) => void }) {
  const [username, setUsername] = useState(account?.username || "@");
  const [displayName, setDisplayName] = useState(account?.displayName || "");
  const info = PLATFORM_INFO[platform];
  return (
    <Modal open onClose={onClose} title={`Connect ${info.name}`} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white font-bold", info.color)}>
            {info.icon}
          </div>
          <p className="text-sm text-text-gray">Connect your {info.name} account to publish content and view analytics.</p>
        </div>
        <FormField label="Username" required>
          <TextInput value={username} onChange={setUsername} placeholder="@username" />
        </FormField>
        <FormField label="Display Name" required>
          <TextInput value={displayName} onChange={setDisplayName} placeholder="Your display name" />
        </FormField>
        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onConnect(username, displayName)}>
            <IconCheck className="w-3 h-3" />
            Connect
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function PostsTab({ posts, filter, setFilter, onNew, onEdit, social }: any) {
  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "draft", "scheduled", "published"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded transition-colors",
              filter === f ? "bg-espresso text-white" : "bg-cream-50 text-text-gray hover:bg-gold/15"
            )}
          >
            {f} ({f === "all" ? posts.length : posts.filter((p: SocialPost) => p.status === f).length})
          </button>
        ))}
        <div className="ml-auto">
          <Button onClick={onNew} size="sm" variant="primary">
            <IconPlus className="w-3 h-3" />
            New Post
          </Button>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState title="No posts yet" message="Create your first social media post to get started." />
      ) : (
        <div className="space-y-3">
          {posts.map((p: SocialPost) => (
            <PostCard key={p.id} post={p} onEdit={() => onEdit(p)} social={social} />
          ))}
        </div>
      )}
    </>
  );
}

function PostCard({ post, onEdit, social }: { post: SocialPost; onEdit: () => void; social: ReturnType<typeof useSocialStore> }) {
  return (
    <div className="card p-4 flex gap-4">
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" className="w-20 h-20 object-cover rounded flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <StatusBadge status={post.status === "published" ? "published" : post.status === "scheduled" ? "replied" : "draft"} />
          {post.platforms.map((p) => (
            <span key={p} className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold", PLATFORM_INFO[p].color)}>
              {PLATFORM_INFO[p].icon}
            </span>
          ))}
          {post.status === "scheduled" && post.scheduledFor && (
            <span className="text-[10px] text-text-gray">
              ⏰ {new Date(post.scheduledFor).toLocaleString()}
            </span>
          )}
        </div>
        <p className="text-sm text-heading line-clamp-2 mb-2">{post.content}</p>
        {post.analytics && (
          <div className="flex items-center gap-3 text-[10px] text-text-gray">
            <span>👁 {post.analytics.impressions.toLocaleString()}</span>
            <span>❤️ {post.analytics.likes.toLocaleString()}</span>
            <span>💬 {post.analytics.comments.toLocaleString()}</span>
            <span>🔄 {post.analytics.shares.toLocaleString()}</span>
          </div>
        )}
        <p className="text-[10px] text-text-gray mt-1">
          {post.source === "auto-blog" ? "🤖 Auto-posted from blog" : post.source === "auto-project" ? "🤖 Auto-posted from project" : "✍️ Manual"}
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <Button size="sm" variant="ghost" onClick={onEdit}>Edit</Button>
        {post.status !== "published" && (
          <Button size="sm" variant="primary" onClick={() => social.publishPost(post.id)}>Publish</Button>
        )}
        <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this post?")) social.deletePost(post.id); }}>
          <IconTrash className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

function PostForm({ post, social, onClose }: { post: SocialPost | null; social: ReturnType<typeof useSocialStore>; onClose: () => void }) {
  const [form, setForm] = useState<Partial<SocialPost>>({
    content: post?.content || "",
    platforms: post?.platforms || [],
    imageUrl: post?.imageUrl || "",
    link: post?.link || "",
    scheduledFor: post?.scheduledFor || "",
    status: post?.status || "draft",
  });

  const togglePlatform = (p: SocialPlatform) => {
    const platforms = form.platforms || [];
    setForm({
      ...form,
      platforms: platforms.includes(p) ? platforms.filter((x) => x !== p) : [...platforms, p],
    });
  };

  const handleSave = () => {
    if (!form.content || (form.platforms || []).length === 0) {
      alert("Please add content and select at least one platform");
      return;
    }
    if (post) {
      social.updatePost(post.id, form);
    } else {
      social.createPost(form as any);
    }
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={post ? "Edit Post" : "New Post"} size="lg">
      <div className="space-y-4">
        <FormField label="Platforms" required>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const info = PLATFORM_INFO[p];
              const selected = (form.platforms || []).includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all",
                    selected ? "border-gold bg-gold/10" : "border-stone-200 hover:border-gold/50"
                  )}
                >
                  <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold", info.color)}>
                    {info.icon}
                  </span>
                  <span className="text-xs font-medium text-heading">{info.name}</span>
                  {selected && <IconCheck className="w-3 h-3 text-gold" />}
                </button>
              );
            })}
          </div>
        </FormField>
        <FormField label="Content" required>
          <TextareaInput value={form.content || ""} onChange={(v) => setForm({ ...form, content: v })} rows={5} placeholder="Write your post..." />
        </FormField>
        <FormField label="Image URL">
          <TextInput value={form.imageUrl || ""} onChange={(v) => setForm({ ...form, imageUrl: v })} placeholder="https://..." />
        </FormField>
        <FormField label="Link">
          <TextInput value={form.link || ""} onChange={(v) => setForm({ ...form, link: v })} placeholder="https://..." />
        </FormField>
        <FormField label="Schedule (optional)" hint="Leave empty to publish immediately">
          <input
            type="datetime-local"
            value={form.scheduledFor ? new Date(form.scheduledFor).toISOString().slice(0, 16) : ""}
            onChange={(e) => setForm({ ...form, scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
            className="w-full px-3 py-2 text-sm rounded-md border border-stone-200 bg-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </FormField>
        <div className="flex justify-end gap-2 pt-2 border-t border-stone-200">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>
            <IconCheck className="w-3 h-3" />
            {post ? "Save" : "Create Post"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function AnalyticsTab({ analytics, accounts }: { analytics: any; accounts: any[] }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Total Followers</div>
          <div className="font-serif text-3xl text-heading">{analytics.totalFollowers.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Total Impressions</div>
          <div className="font-serif text-3xl text-heading">{analytics.totalImpressions.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Total Engagement</div>
          <div className="font-serif text-3xl text-heading">{analytics.totalEngagement.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-[10px] uppercase tracking-widest text-text-gray font-semibold mb-1">Engagement Rate</div>
          <div className="font-serif text-3xl text-heading">{analytics.engagementRate.toFixed(1)}%</div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">By Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(analytics.byPlatform).map(([platform, data]: [string, any]) => {
            const info = PLATFORM_INFO[platform as SocialPlatform];
            return (
              <div key={platform} className="p-4 rounded-lg border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold", info.color)}>
                    {info.icon}
                  </span>
                  <span className="font-medium text-heading">{info.name}</span>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-text-gray">Followers</span><span className="text-heading font-semibold">{data.followers.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-text-gray">Impressions</span><span className="text-heading font-semibold">{data.impressions.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-text-gray">Engagement</span><span className="text-heading font-semibold">{data.engagement.toLocaleString()}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-serif text-lg text-heading mb-4">Last 7 Days</h3>
        <div className="flex items-end gap-2 h-40">
          {analytics.last7Days.map((d: any) => (
            <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-gradient-to-t from-gold to-amber-300 rounded-t"
                style={{ height: `${(d.impressions / 1500) * 100}%` }}
                title={`${d.impressions} impressions`}
              />
              <div className="text-[9px] text-text-gray">{d.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AutoPostSettings({ social }: { social: ReturnType<typeof useSocialStore> }) {
  return (
    <div className="card p-6 max-w-2xl space-y-4">
      <h3 className="font-serif text-lg text-heading">Auto-Post Settings</h3>
      <p className="text-sm text-text-gray">
        Automatically publish to social media when you create new blog posts or projects.
      </p>
      <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer hover:bg-cream-50/50">
        <input
          type="checkbox"
          checked={social.autoPostEnabled}
          onChange={(e) => social.setAutoPostEnabled(e.target.checked)}
          className="w-4 h-4 text-gold focus:ring-gold"
        />
        <div>
          <div className="text-sm font-medium text-heading">Enable Auto-Post</div>
          <div className="text-[11px] text-text-gray">Master switch for all auto-posting</div>
        </div>
      </label>
      <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer hover:bg-cream-50/50">
        <input
          type="checkbox"
          checked={social.autoPostForBlog}
          onChange={(e) => social.setAutoPostForBlog(e.target.checked)}
          disabled={!social.autoPostEnabled}
          className="w-4 h-4 text-gold focus:ring-gold disabled:opacity-30"
        />
        <div>
          <div className="text-sm font-medium text-heading">Auto-Post Blog Articles</div>
          <div className="text-[11px] text-text-gray">When a new blog post is published</div>
        </div>
      </label>
      <label className="flex items-center gap-3 p-3 rounded-lg border border-stone-200 cursor-pointer hover:bg-cream-50/50">
        <input
          type="checkbox"
          checked={social.autoPostForProject}
          onChange={(e) => social.setAutoPostForProject(e.target.checked)}
          disabled={!social.autoPostEnabled}
          className="w-4 h-4 text-gold focus:ring-gold disabled:opacity-30"
        />
        <div>
          <div className="text-sm font-medium text-heading">Auto-Post Projects</div>
          <div className="text-[11px] text-text-text-gray">When a new project is added</div>
        </div>
      </label>
    </div>
  );
}
