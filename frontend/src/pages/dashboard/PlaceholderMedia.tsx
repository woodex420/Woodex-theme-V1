import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Image,
  Upload,
  Search,
  Grid3X3,
  List,
  Trash2,
  FileImage,
  FileText,
  Film,
  Music,
  Archive,
  File,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
  Copy,
  Link,
  AlertTriangle,
  Calendar,
  HardDrive,
  FileType,
  Eye,
} from 'lucide-react';
import { adminFetch, getToken } from '@/lib/auth';
import ConfirmDialog from '@/components/dashboard/ui/ConfirmDialog';
import AdminModal from '@/components/dashboard/ui/AdminModal';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MediaItem {
  _id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface UploadProgress {
  files: { name: string; percent: number }[];
  totalFiles: number;
}

interface Toast {
  id: number;
  type: 'success' | 'error' | 'warning';
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const MAX_RECOMMENDED_SIZE = 5 * 1024 * 1024; // 5MB

let toastCounter = 0;

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fileIcon(type: string) {
  if (type.startsWith('image/')) return FileImage;
  if (type.startsWith('video/')) return Film;
  if (type.startsWith('audio/')) return Music;
  if (type.includes('pdf')) return FileText;
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return Archive;
  return File;
}

/* ------------------------------------------------------------------ */
/*  Toast System                                                       */
/* ------------------------------------------------------------------ */

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-start gap-3 px-5 py-3.5 max-w-sm
            border backdrop-blur-sm shadow-2xl animate-in slide-in-from-right-5
            transition-all duration-300
            ${
              t.type === 'success'
                ? 'bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.3)]'
                : t.type === 'warning'
                  ? 'bg-[rgba(234,179,8,0.12)] border-[rgba(234,179,8,0.3)]'
                  : 'bg-[rgba(220,38,38,0.12)] border-[rgba(220,38,38,0.3)]'
            }
          `}
        >
          {t.type === 'success' && <CheckCircle2 size={15} className="text-[#22C55E] shrink-0 mt-0.5" />}
          {t.type === 'warning' && <AlertTriangle size={15} className="text-[#EAB308] shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle size={15} className="text-[#DC2626] shrink-0 mt-0.5" />}
          <span
            className={`text-sm font-light leading-relaxed ${
              t.type === 'success'
                ? 'text-[#22C55E]'
                : t.type === 'warning'
                  ? 'text-[#EAB308]'
                  : 'text-[#DC2626]'
            }`}
          >
            {t.message}
          </span>
          <button
            onClick={() => onDismiss(t.id)}
            className="shrink-0 ml-2 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function PlaceholderMedia() {
  /* ---- state ---- */
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---- bulk selection ---- */
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  /* ---- detail modal ---- */
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null);
  const [detailDeleteTarget, setDetailDeleteTarget] = useState<MediaItem | null>(null);
  const [detailDeleting, setDetailDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  /* ---- toast system ---- */
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(type: Toast['type'], message: string) {
    const id = ++toastCounter;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  /* ---- fetch media ---- */
  const loadMedia = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminFetch<{ media: MediaItem[] }>('/admin/media');
      setMedia(res.media || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  /* ---- upload ---- */
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    // File size warnings
    const oversized = fileArray.filter((f) => f.size > MAX_RECOMMENDED_SIZE);
    for (const f of oversized) {
      addToast('warning', `File ${f.name} is ${formatBytes(f.size)}. Maximum recommended size is 5MB.`);
    }

    setUploading(true);
    setUploadProgress({
      files: fileArray.map((f) => ({ name: f.name, percent: 0 })),
      totalFiles: fileArray.length,
    });
    setError('');

    try {
      const formData = new FormData();
      fileArray.forEach((f) => formData.append('files', f));

      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const xhr = new XMLHttpRequest();

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress((prev) =>
              prev
                ? {
                    ...prev,
                    files: prev.files.map((f, i) =>
                      i === 0 ? { ...f, percent: pct } : f
                    ),
                  }
                : prev
            );
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            try {
              const body = JSON.parse(xhr.responseText);
              reject(new Error(body.error || `Upload failed (${xhr.status})`));
            } catch {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          }
        });

        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

        xhr.open('POST', `${API_BASE}/admin/media/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

      addToast('success', `Uploaded ${fileArray.length} ${fileArray.length === 1 ? 'file' : 'files'} successfully`);
      await loadMedia();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      addToast('error', msg);
    } finally {
      setUploading(false);
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  /* ---- single delete ---- */
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await adminFetch(`/admin/media/${deleteTarget._id}`, { method: 'DELETE' });
      setMedia((prev) => prev.filter((m) => m._id !== deleteTarget._id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget._id);
        return next;
      });
      setDeleteTarget(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  /* ---- detail modal delete ---- */
  async function handleDetailDelete() {
    if (!detailDeleteTarget) return;
    setDetailDeleting(true);
    try {
      await adminFetch(`/admin/media/${detailDeleteTarget._id}`, { method: 'DELETE' });
      setMedia((prev) => prev.filter((m) => m._id !== detailDeleteTarget._id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(detailDeleteTarget._id);
        return next;
      });
      setDetailDeleteTarget(null);
      setDetailItem(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDetailDeleting(false);
    }
  }

  /* ---- bulk delete ---- */
  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkDeleting(true);
    try {
      const results = await Promise.allSettled(
        ids.map((id) => adminFetch(`/admin/media/${id}`, { method: 'DELETE' }))
      );

      const succeeded = results.filter((r) => r.status === 'fulfilled').length;
      const failed = results.filter((r) => r.status === 'rejected').length;

      if (failed > 0) {
        addToast('error', `Failed to delete ${failed} ${failed === 1 ? 'file' : 'files'}. ${succeeded} deleted.`);
      } else {
        addToast('success', `Deleted ${succeeded} ${succeeded === 1 ? 'file' : 'files'}`);
      }

      setMedia((prev) => prev.filter((m) => !selectedIds.has(m._id)));
      setSelectedIds(new Set());
      setBulkDeleteDialog(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Bulk delete failed');
    } finally {
      setBulkDeleting(false);
    }
  }

  /* ---- selection helpers ---- */
  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = media.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((m) => selectedIds.has(m._id));

  function toggleSelectAll() {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((m) => m._id)));
    }
  }

  /* ---- copy URL ---- */
  async function copyUrl(item: MediaItem) {
    const fullUrl = `${window.location.origin}${API_BASE}${item.url}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(true);
      addToast('success', 'URL copied to clipboard');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = fullUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedUrl(true);
      addToast('success', 'URL copied to clipboard');
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  }

  /* ---- drag handlers ---- */
  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }

  /* ---- item click handler (opens detail) ---- */
  function handleItemClick(item: MediaItem) {
    setDetailItem(item);
    setCopiedUrl(false);
  }

  /* ---- render ---- */
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="p-8">
      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-white">Media Library</h1>
          <p className="text-[#8A8073] font-light text-sm mt-1">
            Images and files for your content. Drag &amp; drop or click to upload.
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 flex items-center gap-2"
        >
          <Upload size={13} />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.zip,.rar"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] px-5 py-3 mb-8 flex items-center gap-2">
          <AlertCircle size={14} className="text-[#DC2626] shrink-0" />
          <span className="text-sm text-[#DC2626]">{error}</span>
          <button onClick={() => setError('')} className="ml-auto text-[#DC2626] hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload progress */}
      {uploading && uploadProgress && (
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] px-5 py-4 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 size={14} className="text-[#C9A84C] animate-spin" />
            <span className="text-xs text-[#D4C5A9]">
              Uploading {uploadProgress.totalFiles} {uploadProgress.totalFiles === 1 ? 'file' : 'files'}...
            </span>
          </div>
          {uploadProgress.files.map((f, i) => (
            <div key={`${f.name}-${i}`} className="mb-2 last:mb-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[0.65rem] text-[#8A8073] truncate max-w-[200px]">{f.name}</span>
                <span className="text-[0.65rem] text-[#C9A84C] ml-auto font-medium tabular-nums">
                  {f.percent}%
                </span>
              </div>
              <div className="w-full h-1 bg-[rgba(201,168,76,0.1)] overflow-hidden">
                <div
                  className="h-full bg-[#C9A84C] transition-all duration-300"
                  style={{ width: `${f.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed transition-all duration-200 mb-8
          flex flex-col items-center justify-center py-10 cursor-pointer
          ${
            dragOver
              ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.06)]'
              : 'border-[rgba(201,168,76,0.25)] bg-transparent hover:border-[rgba(201,168,76,0.45)] hover:bg-[rgba(201,168,76,0.03)]'
          }
        `}
      >
        <Upload
          size={28}
          className={`mb-3 transition-colors ${dragOver ? 'text-[#C9A84C]' : 'text-[#8A8073]'}`}
        />
        <p className="text-sm text-[#D4C5A9] font-light">
          Drag &amp; drop images here or click to browse
        </p>
        <p className="text-[0.65rem] text-[#8A8073] mt-1.5">
          JPG, PNG, GIF, SVG, WebP, PDF &middot; Max 10 MB
        </p>
      </div>

      {/* Toolbar: search + view toggle */}
      <div className="flex items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8073]" />
          <input
            type="text"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-lux w-full pl-9 pr-4 py-2.5 text-sm"
          />
        </div>

        {/* View toggle */}
        <div className="flex border border-[rgba(201,168,76,0.2)] overflow-hidden">
          <button
            onClick={() => setView('grid')}
            className={`p-2.5 transition-colors ${
              view === 'grid'
                ? 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C]'
                : 'text-[#8A8073] hover:text-white'
            }`}
            title="Grid view"
          >
            <Grid3X3 size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2.5 transition-colors border-l border-[rgba(201,168,76,0.2)] ${
              view === 'list'
                ? 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C]'
                : 'text-[#8A8073] hover:text-white'
            }`}
            title="List view"
          >
            <List size={15} />
          </button>
        </div>

        {/* Select All */}
        {!loading && filtered.length > 0 && (
          <label className="flex items-center gap-2 cursor-pointer ml-1 select-none">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
              className="w-3.5 h-3.5 accent-[#C9A84C] cursor-pointer"
            />
            <span className="text-[0.6rem] tracking-[0.2em] uppercase text-[#8A8073]">
              Select All
            </span>
          </label>
        )}

        {/* Count */}
        {!loading && (
          <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] ml-2">
            {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
          </span>
        )}
      </div>

      {/* Bulk action bar */}
      {hasSelection && (
        <div className="bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.25)] px-5 py-3 mb-6 flex items-center gap-4">
          <span className="text-sm text-[#D4C5A9]">
            <span className="text-[#C9A84C] font-semibold">{selectedIds.size}</span>{' '}
            {selectedIds.size === 1 ? 'item' : 'items'} selected
          </span>
          <button
            onClick={() => setBulkDeleteDialog(true)}
            disabled={bulkDeleting}
            className="text-[0.6rem] tracking-[0.22em] uppercase font-semibold px-4 py-2 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 size={12} />
            {bulkDeleting ? 'Deleting...' : 'Delete Selected'}
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-[0.6rem] tracking-[0.22em] uppercase font-medium px-4 py-2 border border-[rgba(201,168,76,0.2)] text-[#8A8073] hover:text-white hover:border-[rgba(201,168,76,0.4)] transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={28} className="text-[#C9A84C] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)] py-20 flex flex-col items-center justify-center">
          <Image size={40} className="text-[#8A8073] mb-4" />
          <p className="text-sm text-[#D4C5A9] font-light mb-1">
            {search ? 'No files match your search' : 'No media files yet'}
          </p>
          <p className="text-xs text-[#8A8073]">
            {search ? 'Try a different search term' : 'Upload your first file to get started'}
          </p>
          {!search && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-lux btn-gold text-[0.6rem] py-2.5 px-5 mt-6 flex items-center gap-2"
            >
              <Upload size={12} />
              Upload Files
            </button>
          )}
        </div>
      ) : view === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => {
            const isImage = item.type.startsWith('image/');
            const Icon = fileIcon(item.type);
            const isSelected = selectedIds.has(item._id);
            return (
              <div
                key={item._id}
                className={`group bg-[#111110] border transition-colors overflow-hidden ${
                  isSelected
                    ? 'border-[#C9A84C] ring-1 ring-[rgba(201,168,76,0.3)]'
                    : 'border-[rgba(201,168,76,0.2)] hover:border-[rgba(201,168,76,0.4)]'
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="aspect-square bg-[rgba(201,168,76,0.04)] flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  {isImage ? (
                    <>
                      <img
                        src={`${API_BASE}${item.url}`}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Hover preview overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="transform scale-90 group-hover:scale-105 transition-transform duration-300">
                          <Eye size={20} className="text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <Icon size={32} className="text-[#8A8073]" />
                  )}

                  {/* Checkbox */}
                  <label
                    className="absolute top-2 left-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item._id)}
                      className="w-4 h-4 accent-[#C9A84C] cursor-pointer"
                    />
                  </label>

                  {/* Delete overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(item);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[rgba(220,38,38,0.8)]"
                    title="Delete"
                  >
                    <Trash2 size={13} className="text-white" />
                  </button>
                </div>
                {/* Info */}
                <div className="px-3 py-2.5">
                  <p className="text-xs text-white truncate font-medium" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[0.6rem] text-[#8A8073] mt-0.5">
                    {formatBytes(item.size)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="bg-[#111110] border border-[rgba(201,168,76,0.2)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] border-b border-[rgba(201,168,76,0.1)]">
                  <th className="px-6 py-4 font-medium w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      onChange={toggleSelectAll}
                      className="w-3.5 h-3.5 accent-[#C9A84C] cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 font-medium">Image</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium hidden md:table-cell">Size</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Type</th>
                  <th className="px-6 py-4 font-medium hidden lg:table-cell">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const isImage = item.type.startsWith('image/');
                  const Icon = fileIcon(item.type);
                  const isSelected = selectedIds.has(item._id);
                  return (
                    <tr
                      key={item._id}
                      className={`border-b border-[rgba(201,168,76,0.06)] transition-colors ${
                        isSelected
                          ? 'bg-[rgba(201,168,76,0.06)]'
                          : 'hover:bg-[rgba(201,168,76,0.03)]'
                      }`}
                    >
                      <td className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(item._id)}
                          className="w-3.5 h-3.5 accent-[#C9A84C] cursor-pointer"
                        />
                      </td>
                      <td
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="w-10 h-10 bg-[rgba(201,168,76,0.04)] flex items-center justify-center overflow-hidden shrink-0">
                          {isImage ? (
                            <img
                              src={`${API_BASE}${item.url}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Icon size={18} className="text-[#8A8073]" />
                          )}
                        </div>
                      </td>
                      <td
                        className="px-6 py-3 cursor-pointer"
                        onClick={() => handleItemClick(item)}
                      >
                        <span className="text-sm text-white font-medium">{item.name}</span>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <span className="text-xs text-[#8A8073]">{formatBytes(item.size)}</span>
                      </td>
                      <td className="px-6 py-3 hidden lg:table-cell">
                        <span className="text-[0.55rem] tracking-[0.2em] uppercase text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2.5 py-1 font-semibold">
                          {item.type.split('/')[1] || item.type}
                        </span>
                      </td>
                      <td className="px-6 py-3 hidden lg:table-cell">
                        <span className="text-xs text-[#8A8073]">{formatDate(item.uploadedAt)}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="inline-flex items-center gap-1.5 text-[0.6rem] tracking-[0.15em] uppercase text-[#8A8073] hover:text-[#DC2626] transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.1)]">
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">
              {filtered.length} {filtered.length === 1 ? 'file' : 'files'}
            </span>
          </div>
        </div>
      )}

      {/* ---- Image Detail Modal ---- */}
      <AdminModal
        open={!!detailItem}
        onClose={() => setDetailItem(null)}
        title="Media Details"
        size="lg"
        footer={
          detailItem ? (
            <>
              <button
                onClick={() => copyUrl(detailItem)}
                className="btn-lux btn-outline text-[0.6rem] py-2.5 px-5 flex items-center gap-2"
              >
                <Copy size={12} />
                {copiedUrl ? 'Copied!' : 'Copy URL'}
              </button>
              <button
                onClick={() => setDetailDeleteTarget(detailItem)}
                className="text-[0.6rem] tracking-[0.22em] uppercase font-semibold px-5 py-2.5 bg-[#DC2626] text-white hover:bg-[#B91C1C] transition-colors flex items-center gap-2"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </>
          ) : null
        }
      >
        {detailItem && (
          <div className="flex flex-col gap-6">
            {/* Large preview */}
            {detailItem.type.startsWith('image/') ? (
              <div className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.1)] overflow-hidden flex items-center justify-center max-h-[50vh]">
                <img
                  src={`${API_BASE}${detailItem.url}`}
                  alt={detailItem.name}
                  className="max-w-full max-h-[50vh] object-contain"
                />
              </div>
            ) : (
              <div className="bg-[rgba(201,168,76,0.04)] border border-[rgba(201,168,76,0.1)] py-16 flex items-center justify-center">
                {(() => {
                  const Icon = fileIcon(detailItem.type);
                  return <Icon size={56} className="text-[#8A8073]" />;
                })()}
              </div>
            )}

            {/* Metadata grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File Name */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                  <FileImage size={14} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">File Name</p>
                  <p className="text-sm text-white font-medium break-all">{detailItem.name}</p>
                </div>
              </div>

              {/* File Size */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                  <HardDrive size={14} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">File Size</p>
                  <p className="text-sm text-white font-medium">{formatBytes(detailItem.size)}</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                  <FileType size={14} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">Type</p>
                  <p className="text-sm text-[#C9A84C] bg-[rgba(201,168,76,0.12)] px-2.5 py-1 inline-block font-semibold text-[0.65rem] tracking-[0.15em] uppercase">
                    {detailItem.type}
                  </p>
                </div>
              </div>

              {/* Uploaded Date */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={14} className="text-[#C9A84C]" />
                </div>
                <div>
                  <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">Uploaded</p>
                  <p className="text-sm text-white font-medium">{formatDateTime(detailItem.uploadedAt)}</p>
                </div>
              </div>
            </div>

            {/* Full URL */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0 mt-0.5">
                <Link size={14} className="text-[#C9A84C]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">Full URL</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-[#D4C5A9] bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.1)] px-3 py-2 flex-1 truncate font-mono">
                    {`${window.location.origin}${API_BASE}${detailItem.url}`}
                  </code>
                  <button
                    onClick={() => copyUrl(detailItem)}
                    className="shrink-0 p-2 border border-[rgba(201,168,76,0.2)] text-[#8A8073] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.4)] transition-colors"
                    title="Copy URL"
                  >
                    <Copy size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* ---- Detail Modal Delete Confirmation ---- */}
      <ConfirmDialog
        open={!!detailDeleteTarget}
        onClose={() => setDetailDeleteTarget(null)}
        onConfirm={handleDetailDelete}
        title="Delete Media"
        message={
          detailDeleteTarget
            ? `Are you sure you want to delete "${detailDeleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        danger
        loading={detailDeleting}
      />

      {/* ---- Single Delete Confirmation Dialog ---- */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        danger
        loading={deleting}
      />

      {/* ---- Bulk Delete Confirmation Dialog ---- */}
      <ConfirmDialog
        open={bulkDeleteDialog}
        onClose={() => setBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Media"
        message={`Are you sure you want to delete ${selectedIds.size} ${selectedIds.size === 1 ? 'file' : 'files'}? This action cannot be undone.`}
        confirmLabel="Delete All"
        danger
        loading={bulkDeleting}
      />
    </div>
  );
}
