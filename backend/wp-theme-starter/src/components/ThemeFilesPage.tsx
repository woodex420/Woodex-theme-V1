import { useState, useMemo, useEffect } from "react";
import { themeFiles, type ThemeFile } from "../data/themeFiles";
import { cn } from "../utils/cn";
import {
  IconCode,
  IconFile,
  IconCheck,
  IconDownload,
  IconSearch,
  IconArrowRight,
  IconCube,
  IconLayers,
  IconBox,
  IconShield,
} from "./Icons";

const categories: { id: ThemeFile["category"] | "all"; label: string; color: string }[] = [
  { id: "all", label: "All Files", color: "bg-espresso" },
  { id: "theme", label: "Parent Theme", color: "bg-gold" },
  { id: "child", label: "Child Theme", color: "bg-amber-700" },
  { id: "elementor", label: "Elementor Widgets", color: "bg-rose-700" },
  { id: "template", label: "Templates", color: "bg-indigo-700" },
  { id: "config", label: "Config & Assets", color: "bg-stone-700" },
];

const langColors: Record<string, string> = {
  php: "text-indigo-300",
  css: "text-pink-300",
  js: "text-amber-300",
  json: "text-emerald-300",
  txt: "text-blue-300",
  md: "text-violet-300",
};

const langBadges: Record<string, string> = {
  php: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40",
  css: "bg-pink-500/20 text-pink-200 border-pink-500/40",
  js: "bg-amber-500/20 text-amber-200 border-amber-500/40",
  json: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40",
  txt: "bg-blue-500/20 text-blue-200 border-blue-500/40",
  md: "bg-violet-500/20 text-violet-200 border-violet-500/40",
};

function syntaxHighlight(code: string, lang: string) {
  if (lang === "php") {
    return code
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="text-stone-500 italic">$1</span>')
      .replace(/(&lt;\?php|\?&gt;)/g, '<span class="text-violet-400">$1</span>')
      .replace(/\b(function|return|if|else|elseif|endif|foreach|endforeach|while|endwhile|class|public|private|protected|const|new|true|false|null|array|implements|extends|namespace|use|require|require_once|include|echo|do|switch|case|break|default|for|endfor|do)\b/g, '<span class="text-pink-400">$1</span>')
      .replace(/(\$[a-zA-Z_][a-zA-Z0-9_]*)/g, '<span class="text-amber-300">$1</span>')
      .replace(/('[^']*'|"[^"]*")/g, '<span class="text-emerald-300">$1</span>')
      .replace(/\b([0-9]+)\b/g, '<span class="text-rose-300">$1</span>');
  }
  if (lang === "css") {
    return code
      .replace(/(\/\*[\s\S]*?\*\/)/gm, '<span class="text-stone-500 italic">$1</span>')
      .replace(/([.#][a-zA-Z0-9_-]+)/g, '<span class="text-amber-300">$1</span>')
      .replace(/(#[0-9a-fA-F]{3,8})/g, '<span class="text-emerald-300">$1</span>')
      .replace(/(\b\d+\.?\d*(px|rem|em|%|vh|vw|s|ms)?\b)/g, '<span class="text-rose-300">$1</span>')
      .replace(/(^|\n)([a-zA-Z-]+)(\s*:)/g, '$1<span class="text-pink-400">$2</span>$3')
      .replace(/(\{|\})/g, '<span class="text-violet-400">$1</span>');
  }
  if (lang === "js" || lang === "json") {
    return code
      .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="text-stone-500 italic">$1</span>')
      .replace(/("(\\.|[^"\\])*")/g, '<span class="text-emerald-300">$1</span>')
      .replace(/('(\\.|[^'\\])*')/g, '<span class="text-emerald-300">$1</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|class|new|export|import|from|as|async|await|true|false|null|undefined|this|document|window|module)\b/g, '<span class="text-pink-400">$1</span>')
      .replace(/\b([0-9]+)\b/g, '<span class="text-rose-300">$1</span>')
      .replace(/(\{|\}|\[|\]|\(|\))/g, '<span class="text-violet-400">$1</span>');
  }
  return code;
}

export function ThemeFilesPage() {
  const [active, setActive] = useState<ThemeFile["category"] | "all">("all");
  const [selected, setSelected] = useState<ThemeFile>(themeFiles[0]);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    let list = themeFiles;
    if (active !== "all") list = list.filter((f) => f.category === active);
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (f) => f.path.toLowerCase().includes(s) || f.description.toLowerCase().includes(s)
      );
    }
    return list;
  }, [active, search]);

  useEffect(() => {
    if (!filtered.find((f) => f.path === selected.path) && filtered.length) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selected.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const totalLines = useMemo(() => selected.content.split("\n").length, [selected]);

  return (
    <main className="pt-28 lg:pt-32 pb-20 min-h-screen bg-espresso">
      <div className="container-x">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="bg-gold text-espresso px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Source Code
            </span>
            <span className="text-cream-100/60 text-xs">{themeFiles.length} files · {totalLines}+ lines</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl text-white leading-[1.05] mb-5 max-w-3xl">
            WordPress Theme <em className="text-gold not-italic font-medium">Source Files</em>
          </h1>
          <p className="text-cream-100/70 leading-relaxed max-w-2xl">
            The complete, production-ready code for the WP Interior parent theme, child theme, and all 5 custom
            Elementor widgets. Copy any file directly into your WordPress installation.
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: IconCube, label: "PHP Files", value: themeFiles.filter((f) => f.language === "php").length },
            { icon: IconLayers, label: "CSS Files", value: themeFiles.filter((f) => f.language === "css").length },
            { icon: IconBox, label: "JS Files", value: themeFiles.filter((f) => f.language === "js").length },
            { icon: IconShield, label: "JSON Templates", value: themeFiles.filter((f) => f.language === "json").length },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-card p-5">
              <s.icon className="w-5 h-5 text-gold mb-2" />
              <div className="text-cream-100/60 text-[10px] uppercase tracking-widest">{s.label}</div>
              <div className="font-serif text-3xl text-white mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2 flex-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all",
                  active === c.id
                    ? "bg-gold text-espresso"
                    : "bg-white/5 text-cream-100/70 hover:bg-white/10 border border-white/10"
                )}
              >
                {c.label}
                <span className="ml-2 text-[10px] opacity-70">
                  ({c.id === "all" ? themeFiles.length : themeFiles.filter((f) => f.category === c.id).length})
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 md:w-72">
            <IconSearch className="w-4 h-4 text-cream-100/40" />
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent flex-1 text-sm text-white outline-none placeholder:text-cream-100/30"
            />
          </div>
        </div>

        {/* Main viewer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File list */}
          <aside className="lg:col-span-3 space-y-1 max-h-[600px] lg:max-h-[700px] overflow-y-auto pr-2">
            {filtered.map((f) => (
              <button
                key={f.path}
                onClick={() => setSelected(f)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all border",
                  selected.path === f.path
                    ? "bg-gold/10 border-gold/30"
                    : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <IconFile className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                  <span className={cn("text-[10px] uppercase tracking-widest font-bold", langColors[f.language])}>
                    {f.language}
                  </span>
                </div>
                <div
                  className={cn(
                    "font-mono text-xs truncate",
                    selected.path === f.path ? "text-gold" : "text-cream-100/90"
                  )}
                  title={f.path}
                >
                  {f.path.split("/").pop()}
                </div>
                <div className="text-[10px] text-cream-100/40 truncate mt-0.5">
                  {f.path.split("/").slice(0, -1).join("/")}
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center text-cream-100/40 text-sm py-8">No files match.</div>
            )}
          </aside>

          {/* Code viewer */}
          <div className="lg:col-span-9">
            <div className="bg-[#1a1612] border border-white/10 rounded-card overflow-hidden">
              {/* Header bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 border-b border-white/10 bg-[#0f0d0a]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex gap-1.5 flex-shrink-0">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                  </div>
                  <code className="font-mono text-xs text-cream-100/80 truncate">{selected.path}</code>
                  <span
                    className={cn(
                      "hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                      langBadges[selected.language]
                    )}
                  >
                    {selected.language}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-[10px] text-cream-100/40 hidden md:inline">
                    {totalLines} lines
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gold/15 text-gold text-xs font-semibold hover:bg-gold/25 transition-colors"
                  >
                    {copied ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <IconCode className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="px-5 py-3 border-b border-white/5 bg-white/5">
                <p className="text-xs text-cream-100/60 leading-relaxed">{selected.description}</p>
              </div>

              {/* Code body */}
              <div className="overflow-auto code-scroll max-h-[560px]">
                <pre className="p-5 text-[12px] leading-[1.65] font-mono">
                  <code
                    className="text-cream-100/85"
                    dangerouslySetInnerHTML={{
                      __html: syntaxHighlight(escapeHtml(selected.content), selected.language),
                    }}
                  />
                </pre>
              </div>
            </div>

            {/* Install guide */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: "1",
                  title: "Create Theme Folders",
                  text: "Create wp-content/themes/wp-interior-theme/ and wp-interior-child/ in your WordPress install.",
                },
                {
                  step: "2",
                  title: "Copy Files",
                  text: "Use the Copy button above to paste each file at the correct path inside the theme folder.",
                },
                {
                  step: "3",
                  title: "Activate",
                  text: "In WP Admin → Appearance → Themes, activate WP Interior Child. Install Elementor Pro for full functionality.",
                },
              ].map((s) => (
                <div key={s.step} className="bg-white/5 border border-white/10 rounded-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 rounded-full bg-gold text-espresso font-serif font-semibold flex items-center justify-center text-sm">
                      {s.step}
                    </span>
                    <h4 className="text-white font-serif text-lg">{s.title}</h4>
                  </div>
                  <p className="text-cream-100/60 text-xs leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-gold/10 border border-gold/30 rounded-card p-5 flex items-center gap-4">
              <IconDownload className="w-8 h-8 text-gold flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-white font-serif text-lg mb-1">Production-Ready Package</h4>
                <p className="text-cream-100/60 text-xs leading-relaxed">
                  All files follow WordPress coding standards, are escaped/sanitized, and pass Theme Check requirements.
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="btn btn-gold"
              >
                COPY FILE
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
