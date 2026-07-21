import type { ReactNode } from 'react';

/**
 * Placeholder page for dashboard sections not yet implemented.
 */
export default function DashboardPlaceholder({
  icon: Icon,
  title,
  subtitle,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-white">{title}</h1>
        <p className="text-[#8A8073] font-light text-sm mt-1">{subtitle}</p>
      </div>
      <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] p-16 text-center">
        <Icon size={48} className="text-[#C9A84C] mx-auto mb-6 opacity-40" />
        <p className="text-[#8A8073] font-light max-w-md mx-auto leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
