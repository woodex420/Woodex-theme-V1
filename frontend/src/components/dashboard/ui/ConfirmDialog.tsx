import AdminModal from './AdminModal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Delete', danger = true, loading }: ConfirmDialogProps) {
  return (
    <AdminModal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            className={`text-[0.6rem] tracking-[0.22em] uppercase font-semibold px-5 py-2.5 transition-colors ${
              danger ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'bg-[#C9A84C] text-[#0A0A0A] hover:bg-[#D4B45E]'
            } disabled:opacity-50`}>
            {loading ? 'Working...' : confirmLabel}
          </button>
        </>
      }>
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-[rgba(220,38,38,0.12)] flex items-center justify-center shrink-0">
          <AlertTriangle size={20} className="text-[#DC2626]" />
        </div>
        <p className="text-sm text-[#D4C5A9] font-light leading-relaxed">{message}</p>
      </div>
    </AdminModal>
  );
}
