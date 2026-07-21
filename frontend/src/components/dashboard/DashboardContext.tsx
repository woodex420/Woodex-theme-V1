import { createContext, useContext, useState } from 'react';

interface DashboardCtx {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const Ctx = createContext<DashboardCtx>({ sidebarCollapsed: false, toggleSidebar: () => {} });
export const useDashboard = () => useContext(Ctx);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Ctx.Provider value={{ sidebarCollapsed: collapsed, toggleSidebar: () => setCollapsed((c) => !c) }}>
      {children}
    </Ctx.Provider>
  );
}
