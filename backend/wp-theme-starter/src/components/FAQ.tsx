import { useState } from "react";
import { IconPlus, IconMinus, IconArrowRight, IconHelp } from "./Icons";
import { cn } from "../utils/cn";

// Premium FAQ with minimal height, modern numbered design.

type FAQItem = { q: string; a: string };

export function FAQ({
  items,
  eyebrow = "FREQUENTLY ASKED QUESTIONS",
  title = "Everything you",
  italic = "need to know",
  bg = "white",
  onContactClick,
  columns = 2,
}: {
  items: FAQItem[];
  eyebrow?: string;
  title?: string;
  italic?: string;
  bg?: "white" | "cream";
  onContactClick?: () => void;
  columns?: 1 | 2;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const sectionClass = bg === "cream" ? "section-cream" : "section-white";

  return (
    <section className={cn(sectionClass, "py-14 lg:py-16 relative overflow-hidden")}>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className={cn("container-x relative", columns === 1 ? "max-w-3xl" : "max-w-5xl")}>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full mb-4">
            <IconHelp className="w-3.5 h-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">{eyebrow}</span>
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl text-heading">
            {title} <em className="text-emphasis font-medium not-italic">{italic}</em>
          </h2>
        </div>

        <div
          className={cn(
            "grid gap-x-6 gap-y-0 border-t border-border",
            columns === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}
        >
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={cn(
                  "border-b border-border transition-colors",
                  isOpen && "bg-cream-50/50"
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full py-4 flex items-start justify-between text-left gap-3 group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={cn(
                        "font-serif text-[11px] font-semibold w-7 flex-shrink-0 mt-1.5 transition-colors tabular-nums",
                        isOpen ? "text-gold" : "text-gold/70"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "font-serif text-[15px] pr-3 transition-colors leading-snug",
                        isOpen ? "text-espresso font-semibold" : "text-heading group-hover:text-gold"
                      )}
                    >
                      {f.q}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 mt-0.5",
                      isOpen
                        ? "bg-gold text-espresso rotate-180"
                        : "bg-gold/10 text-gold group-hover:bg-gold/20 group-hover:scale-110"
                    )}
                  >
                    {isOpen ? <IconMinus className="w-3.5 h-3.5" /> : <IconPlus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="text-text-gray text-[13px] leading-relaxed pl-10 pr-10">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>

        {onContactClick && (
          <div className="text-center mt-8">
            <button onClick={onContactClick} className="btn btn-outline !py-2.5 !px-6 !text-[11px]">
              STILL HAVE QUESTIONS? CONTACT US
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
