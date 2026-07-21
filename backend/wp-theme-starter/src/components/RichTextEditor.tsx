// Rich Text Editor - Lightweight WYSIWYG for admin content

import { useState, useRef, useEffect } from "react";
import {
  IconCheck,
  IconUpload,
} from "./Icons";
import { cn } from "../utils/cn";
import { Button } from "./admin/AdminLayout";
type RichTextEditorProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

const TOOLS = [
  { cmd: "bold", label: "B", style: "font-bold" },
  { cmd: "italic", label: "I", style: "italic" },
  { cmd: "underline", label: "U", style: "underline" },
  { cmd: "strikeThrough", label: "S", style: "line-through" },
  { cmd: "h1", label: "H1", style: "" },
  { cmd: "h2", label: "H2", style: "" },
  { cmd: "h3", label: "H3", style: "" },
  { cmd: "p", label: "P", style: "" },
  { cmd: "ul", label: "• List", style: "" },
  { cmd: "ol", label: "1. List", style: "" },
  { cmd: "blockquote", label: "❝", style: "" },
  { cmd: "createLink", label: "🔗", style: "" },
  { cmd: "insertImage", label: "🖼️", style: "" },
];

export function RichTextEditor({ value, onChange, placeholder, rows = 6 }: RichTextEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  const handleLink = () => {
    if (linkUrl) {
      exec("createLink", linkUrl);
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  const handleImage = () => {
    if (imageUrl) {
      exec("insertImage", imageUrl);
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      exec("insertImage", url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 p-2 border-b border-border bg-cream-50/50 flex-wrap">
        {TOOLS.map((tool) => (
          <button
            key={tool.cmd}
            type="button"
            onClick={() => {
              if (tool.cmd === "createLink") {
                setShowLinkInput(true);
                setShowImageInput(false);
              } else if (tool.cmd === "insertImage") {
                setShowImageInput(true);
                setShowLinkInput(false);
              } else {
                exec(tool.cmd);
              }
            }}
            className={cn(
              "w-8 h-8 rounded text-xs font-medium text-text-gray hover:bg-gold/15 hover:text-espresso transition-colors",
              tool.style
            )}
            title={tool.label}
          >
            {tool.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 rounded text-xs text-text-gray hover:bg-gold/15 hover:text-espresso transition-colors"
          title="Upload Image"
        >
          <IconUpload className="w-3.5 h-3.5 mx-auto" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
        />
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => exec("removeFormat")}
            className="px-2 h-8 rounded text-[10px] uppercase tracking-widest font-bold text-text-gray hover:bg-gold/15 hover:text-espresso transition-colors"
            title="Clear formatting"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 p-2 border-b border-border bg-blue-50/30">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-2 py-1.5 text-xs rounded border border-border"
            onKeyDown={(e) => { if (e.key === "Enter") handleLink(); }}
            autoFocus
          />
          <Button size="sm" variant="primary" onClick={handleLink}>
            <IconCheck className="w-3 h-3" />
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowLinkInput(false)}>Cancel</Button>
        </div>
      )}

      {/* Image input */}
      {showImageInput && (
        <div className="flex items-center gap-2 p-2 border-b border-border bg-blue-50/30">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL..."
            className="flex-1 px-2 py-1.5 text-xs rounded border border-border"
            onKeyDown={(e) => { if (e.key === "Enter") handleImage(); }}
            autoFocus
          />
          <Button size="sm" variant="primary" onClick={handleImage}>
            <IconCheck className="w-3 h-3" />
            Add
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowImageInput(false)}>Cancel</Button>
        </div>
      )}

      {/* Editor */}
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        className="p-3 min-h-[120px] prose prose-sm max-w-none focus:outline-none [&_h1]:text-2xl [&_h1]:font-serif [&_h1]:font-semibold [&_h1]:mt-3 [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-serif [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-serif [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-1 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-gray [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_a]:text-gold [&_a]:underline"
        style={{ minHeight: rows * 24 }}
      />

      <div className="px-3 py-1.5 border-t border-border bg-cream-50/30 text-[10px] text-text-gray flex items-center gap-2">
        <span>{value.replace(/<[^>]*>/g, "").length} characters</span>
        <span>·</span>
        <span>HTML allowed</span>
      </div>
    </div>
  );
}

