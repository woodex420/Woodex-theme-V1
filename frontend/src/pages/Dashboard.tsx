import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';
import { DashboardProvider, useDashboard } from '@/components/dashboard/DashboardContext';

function DashboardInner() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  const { sidebarCollapsed } = useDashboard();

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <Sidebar />
      <div className={`flex-1 min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'ml-[72px]' : 'ml-[260px]'}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardInner />
    </DashboardProvider>
  );
}
