import { useEffect, useState } from 'react';
import { Image, Upload, X, Loader2 } from 'lucide-react';
import { adminFetch } from '@/lib/auth';
import AdminModal from './AdminModal';

interface MediaItem {
  _id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) loadMedia();
  }, [open]);

  async function loadMedia() {
    try {
      setLoading(true);
      const res = await adminFetch<{ media: MediaItem[] }>('/admin/media');
      setMedia(res.media || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) formData.append('files', file);
      const token = localStorage.getItem('woodex_auth_token');
      await fetch(`${API_BASE}/admin/media/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      await loadMedia();
    } catch {
      // ignore
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  }

  return (
    <AdminModal open={open} onClose={onClose} title="Select Media" size="xl"
      footer={
        <>
          <button onClick={onClose} className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5">Cancel</button>
          <button onClick={() => { onSelect(selected); onClose(); }} disabled={!selected}
            className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 disabled:opacity-40">
            Select
          </button>
        </>
      }>
      {/* Upload */}
      <div className="mb-5 flex items-center gap-3">
        <label className="btn-lux btn-gold text-[0.6rem] py-2 px-4 cursor-pointer inline-flex items-center gap-2">
          <Upload size={13} /> Upload New
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
        {uploading && <Loader2 size={14} className="text-[#C9A84C] animate-spin" />}
        <span className="text-[0.55rem] text-[#8A8073]">{media.length} files</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 size={24} className="text-[#C9A84C] animate-spin" /></div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 text-[#8A8073]">
          <Image size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No media files yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 lg:grid-cols-6 gap-3 max-h-[50vh] overflow-y-auto scrollbar-lux">
          {media.map((m) => (
            <button key={m._id} onClick={() => setSelected(m.url)}
              className={`relative aspect-square border overflow-hidden group transition-colors ${
                selected === m.url ? 'border-[#C9A84C]' : 'border-[rgba(201,168,76,0.15)] hover:border-[rgba(201,168,76,0.4)]'
              }`}>
              <img src={`${API_BASE}${m.url}`} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
              {selected === m.url && <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#C9A84C] flex items-center justify-center"><span className="text-[#0A0A0A] text-xs font-bold">✓</span></div>}
            </button>
          ))}
        </div>
      )}
    </AdminModal>
  );
}
