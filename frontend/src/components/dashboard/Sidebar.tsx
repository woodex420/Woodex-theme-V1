import { NavLink, useLocation } from 'react-router';
import {
  LayoutDashboard,
  Layers,
  Navigation,
  Paintbrush,
  Sliders,
  FolderOpen,
  ShoppingBag,
  FileText,
  Star,
  MessageCircle,
  Users,
  Image,
  Shield,
  Share2,
  Settings,
  TestTube,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { getUser, logout } from '@/lib/auth';
import { useDashboard } from './DashboardContext';

interface NavItem {
  label: string;
  sub: string;
  to: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', sub: 'Overview & analytics', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Pages', sub: 'Manage pages & blocks', to: '/dashboard/pages', icon: Layers },
  { label: 'Header & Footer', sub: 'Nav links, footer', to: '/dashboard/header-footer', icon: Navigation },
  { label: 'Theme Manager', sub: 'Master theme controls', to: '/dashboard/theme', icon: Paintbrush },
  { label: 'Live Builder', sub: 'Drag-and-drop editor', to: '/dashboard/builder', icon: Sliders },
  { label: 'Projects', sub: 'Portfolio & case studies', to: '/dashboard/projects', icon: FolderOpen },
  { label: 'Services', sub: 'Service offerings', to: '/dashboard/services', icon: ShoppingBag },
  { label: 'Blog Posts', sub: 'Articles & content', to: '/dashboard/blog', icon: FileText },
  { label: 'Testimonials', sub: 'Client reviews', to: '/dashboard/testimonials', icon: Star },
  { label: 'Live Support', sub: 'WhatsApp & agents', to: '/dashboard/support', icon: MessageCircle },
  { label: 'Contact Leads', sub: 'Form submissions', to: '/dashboard/leads', icon: Users, badge: 'new' },
  { label: 'Media Library', sub: 'Images & files', to: '/dashboard/media', icon: Image },
  { label: 'Users', sub: 'Team management', to: '/dashboard/users', icon: Shield },
  { label: 'Social Media', sub: 'Accounts & posts', to: '/dashboard/social', icon: Share2 },
  { label: 'Settings', sub: 'Site configuration', to: '/dashboard/settings', icon: Settings },
  { label: 'QA Tests', sub: 'Run automated tests', to: '/dashboard/qa', icon: TestTube },
];

export default function Sidebar() {
  const user = getUser();
  const location = useLocation();
  const { sidebarCollapsed: collapsed, toggleSidebar } = useDashboard();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-[#111110] border-r border-[rgba(201,168,76,0.2)] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[rgba(201,168,76,0.15)]">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#C9A84C] rotate-45 flex items-center justify-center shrink-0">
              <span className="font-display text-[#C9A84C] text-sm -rotate-45 font-semibold">W</span>
            </div>
            <div>
              <div className="font-display text-sm text-white leading-tight">Woodex <span className="text-[#C9A84C]">Admin</span></div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 border border-[#C9A84C] rotate-45 flex items-center justify-center mx-auto">
            <span className="font-display text-[#C9A84C] text-sm -rotate-45 font-semibold">W</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 scrollbar-lux">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 mb-0.5 text-sm transition-all rounded-[2px] group relative ${
                isActive
                  ? 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                  : 'text-[#8A8073] hover:text-white hover:bg-[rgba(201,168,76,0.05)]'
              }`}
            >
              <Icon size={17} className={`shrink-0 ${isActive ? 'text-[#C9A84C]' : 'text-[#8A8073] group-hover:text-[#C9A84C]'} transition-colors`} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className={`text-[0.65rem] tracking-[0.15em] uppercase font-medium ${isActive ? 'text-[#C9A84C]' : 'text-[#B8AA8D]'} transition-colors`}>
                    {item.label}
                  </div>
                  <div className="text-[0.55rem] text-[#6B6355] truncate">{item.sub}</div>
                </div>
              )}
              {item.badge && !collapsed && (
                <span className="text-[0.45rem] tracking-[0.2em] uppercase bg-[#C9A84C] text-[#0A0A0A] px-1.5 py-0.5 font-semibold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-[rgba(201,168,76,0.15)] px-3 py-3">
        {!collapsed && user && (
          <div className="mb-2 px-1">
            <div className="text-[0.6rem] tracking-[0.2em] uppercase text-[#8A8073] truncate">{user.fullName}</div>
            <div className="text-[0.5rem] text-[#C9A84C] capitalize">{user.role}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2.5 w-full px-3 py-2 text-[0.6rem] tracking-[0.2em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors ${collapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut size={15} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
