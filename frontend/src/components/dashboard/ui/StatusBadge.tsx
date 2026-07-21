const STATUS_STYLES: Record<string, string> = {
  published: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  draft: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
  archived: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
  new: 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  read: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
  replied: 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
  quoted: 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
  won: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  lost: 'text-[#DC2626] bg-[rgba(220,38,38,0.12)]',
  active: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  queued: 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  resolved: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  spam: 'text-[#DC2626] bg-[rgba(220,38,38,0.12)]',
  online: 'text-[#16A34A] bg-[rgba(22,163,74,0.12)]',
  offline: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
  admin: 'text-[#C9A84C] bg-[rgba(201,168,76,0.12)]',
  editor: 'text-[#2563EB] bg-[rgba(37,99,235,0.12)]',
  viewer: 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]',
  manager: 'text-[#7C3AED] bg-[rgba(124,58,237,0.12)]',
};

export default function StatusBadge({ status, label }: { status: string; label?: string }) {
  const style = STATUS_STYLES[status.toLowerCase()] || 'text-[#8A8073] bg-[rgba(138,128,115,0.12)]';
  return (
    <span className={`inline-block text-[0.5rem] tracking-[0.2em] uppercase font-semibold px-2 py-0.5 ${style}`}>
      {label || status}
    </span>
  );
}
