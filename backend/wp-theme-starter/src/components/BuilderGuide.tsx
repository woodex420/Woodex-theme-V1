// A quick-start guide shown when the builder is first opened.
// Helps users understand the no-code editor workflow.

import { useState } from "react";
import {
  IconClose,
  IconCube,
  IconCheck,
  IconArrowRight,
} from "./Icons";

const STEPS = [
  {
    title: "1. Enter builder mode",
    desc: "Click the gold cube button in the bottom-left, or press Cmd/Ctrl+Shift+B. The right-side panel slides in.",
  },
  {
    title: "2. Click any element",
    desc: "Hover over text, images, buttons, or sections — they highlight with a gold outline. Click to select.",
  },
  {
    title: "3. Edit content inline",
    desc: "Double-click any text to edit it directly. Click any image to replace its URL. All changes save automatically.",
  },
  {
    title: "4. Customize design",
    desc: "Use the Design tab in the side panel to change fonts, colors, spacing, borders, and shadows — no code needed.",
  },
  {
    title: "5. Drag to reorder",
    desc: "Section-level blocks (the larger building blocks) can be dragged to reorder. Each section has a small gold tag in its corner.",
  },
  {
    title: "6. Hide or show",
    desc: "Use the Layout tab to hide sections from visitors. Hide what you don't need without deleting.",
  },
  {
    title: "7. Export & import",
    desc: "In the Page tab, export your overrides as JSON. Import on another device or browser to transfer the design.",
  },
];

export function BuilderGuide({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  return (
    <div className="fixed inset-0 bg-espresso/40 backdrop-blur-sm z-[105] flex items-center justify-center p-6">
      <div className="bg-white rounded-card shadow-elevated w-full max-w-2xl overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-border bg-gradient-to-r from-gold/10 to-cream-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <IconCube className="w-5 h-5 text-espresso" />
            </div>
            <div>
              <h2 className="font-serif text-lg text-heading font-semibold">Welcome to the WP Builder</h2>
              <p className="text-[11px] text-text-gray">A no-code drag-and-drop system for the entire site</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md hover:bg-gold/15 flex items-center justify-center text-text-gray">
            <IconClose className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  step === i
                    ? "border-gold bg-gold/5 shadow-sm"
                    : "border-border bg-cream-50/30 hover:border-gold/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${step === i ? "bg-gold text-espresso" : "bg-cream-100 text-text-gray"}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-heading mb-1">{s.title}</h3>
                    <p className="text-sm text-text-gray leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-[11px] text-text-gray">
              <IconCheck className="w-3.5 h-3.5 text-gold" />
              Auto-saved to your browser
            </div>
            <button
              onClick={onClose}
              className="btn btn-gold !py-2.5 !px-5 !text-[11px]"
            >
              START EDITING
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
