import { useRef, useCallback } from 'react';
import { Bold, Italic, List, ListOrdered, Link2, Heading2, Heading3, Quote, Code, Minus } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  label?: string;
}

function wrapSelection(textarea: HTMLTextAreaElement, before: string, after: string, value: string, onChange: (v: string) => void) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.substring(start, end);
  const replacement = before + (selected || 'text') + after;
  const newValue = value.substring(0, start) + replacement + value.substring(end);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    const newCursorPos = start + before.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos + (selected || 'text').length);
  });
}

function insertAtLineStart(textarea: HTMLTextAreaElement, prefix: string, value: string, onChange: (v: string) => void) {
  const start = textarea.selectionStart;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const newValue = value.substring(0, lineStart) + prefix + value.substring(lineStart);
  onChange(newValue);
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
  });
}

export default function RichTextEditor({ value, onChange, rows = 8, placeholder, label }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const exec = useCallback((action: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    switch (action) {
      case 'bold': wrapSelection(ta, '**', '**', value, onChange); break;
      case 'italic': wrapSelection(ta, '*', '*', value, onChange); break;
      case 'h2': insertAtLineStart(ta, '## ', value, onChange); break;
      case 'h3': insertAtLineStart(ta, '### ', value, onChange); break;
      case 'ul': insertAtLineStart(ta, '- ', value, onChange); break;
      case 'ol': insertAtLineStart(ta, '1. ', value, onChange); break;
      case 'quote': insertAtLineStart(ta, '> ', value, onChange); break;
      case 'code': wrapSelection(ta, '`', '`', value, onChange); break;
      case 'hr': {
        const start = ta.selectionStart;
        const insertion = '\n---\n';
        const newValue = value.substring(0, start) + insertion + value.substring(start);
        onChange(newValue);
        requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(start + insertion.length, start + insertion.length); });
        break;
      }
      case 'link': {
        const url = prompt('Enter URL:');
        if (url) wrapSelection(ta, '[', `](${url})`, value, onChange);
        break;
      }
    }
  }, [value, onChange]);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="border border-[rgba(201,168,76,0.25)] bg-[#0A0A0A]">
      {label && (
        <div className="px-4 py-2 border-b border-[rgba(201,168,76,0.1)]">
          <span className="text-[0.55rem] tracking-[0.25em] uppercase text-[#8A8073]">{label}</span>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-[rgba(201,168,76,0.15)] flex-wrap">
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Bold (Ctrl+B)"><Bold size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Italic (Ctrl+I)"><Italic size={13} /></button>
        <div className="w-px h-4 bg-[rgba(201,168,76,0.15)] mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('h2'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Heading 2"><Heading2 size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('h3'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Heading 3"><Heading3 size={13} /></button>
        <div className="w-px h-4 bg-[rgba(201,168,76,0.15)] mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('ul'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Bullet List"><List size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('ol'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Numbered List"><ListOrdered size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('quote'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Quote"><Quote size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('code'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Inline Code"><Code size={13} /></button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('hr'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Horizontal Rule"><Minus size={13} /></button>
        <div className="w-px h-4 bg-[rgba(201,168,76,0.15)] mx-1" />
        <button type="button" onMouseDown={(e) => { e.preventDefault(); exec('link'); }} className="w-7 h-7 flex items-center justify-center text-[#8A8073] hover:text-[#C9A84C] transition-colors rounded" title="Insert Link"><Link2 size={13} /></button>
        {/* Word count */}
        <div className="ml-auto flex items-center gap-2 text-[0.5rem] text-[#6B6355]">
          <span>{wordCount} words</span>
          <span>·</span>
          <span>{readTime} min read</span>
        </div>
      </div>
      {/* Content area — textarea with markdown insertion */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder || 'Write your content here... Supports **bold**, *italic*, ## headings, - lists, and [links](url)'}
        className="w-full bg-transparent px-4 py-3 text-sm text-[#D4C5A9] font-light leading-relaxed resize-y focus:outline-none placeholder:text-[#4A4439] min-h-[200px]"
      />
    </div>
  );
}
