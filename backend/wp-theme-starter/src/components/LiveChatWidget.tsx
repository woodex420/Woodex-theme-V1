// Live Chat Widget - WhatsApp Agent button with quick replies

import { useState } from "react";
import { cn } from "../utils/cn";
import { IconWhatsapp, IconClose, IconArrowRight } from "./Icons";

type QuickReply = {
  label: string;
  message: string;
};

const QUICK_REPLIES: QuickReply[] = [
  { label: "Office Design", message: "Hi! I'd like to discuss office interior design for our space." },
  { label: "Restaurant", message: "Hi! We're opening a restaurant and need a full design package." },
  { label: "3D Visualization", message: "Hi! I'd like to inquire about 3D visualization services." },
  { label: "Free Consultation", message: "Hi! I'd like to book a free 30-minute design consultation." },
];

export function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const phone = "923001234567"; // WP Interior phone

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-card shadow-elevated border border-border overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-espresso to-espresso/95 text-white p-5 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
              <span className="text-espresso font-serif font-semibold">W</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-base text-white">WP Interior</div>
              <div className="flex items-center gap-1.5 text-[10px] text-cream-100/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online · Replies in minutes
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-md hover:bg-white/10 text-cream-100 hover:text-white flex items-center justify-center transition-colors"
            >
              <IconClose className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-cream-50/30 max-h-[400px] overflow-y-auto">
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center flex-shrink-0">
                <span className="text-espresso font-serif text-sm">W</span>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm max-w-[80%]">
                <p className="text-sm text-heading leading-relaxed">
                  👋 Hi there! Welcome to WP Interior Studio. How can we help with your project today?
                </p>
                <p className="text-[10px] text-text-gray mt-1">Just now</p>
              </div>
            </div>

            <p className="text-[10px] text-text-gray uppercase tracking-widest font-semibold mb-2 px-1">Quick replies</p>
            <div className="space-y-2">
              {QUICK_REPLIES.map((q) => (
                <a
                  key={q.label}
                  href={`https://wa.me/${phone}?text=${encodeURIComponent(q.message)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white border border-border rounded-xl hover:border-gold hover:shadow-sm transition-all group"
                >
                  <span className="text-sm text-heading font-medium">{q.label}</span>
                  <IconArrowRight className="w-3.5 h-3.5 text-text-gray group-hover:text-gold group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>

            <p className="text-[10px] text-text-gray mt-4 px-1 text-center">
              Powered by WhatsApp Business · Average reply time: <span className="font-semibold text-heading">2 minutes</span>
            </p>
          </div>

          {/* Footer CTA */}
          <div className="p-4 border-t border-border bg-white">
            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent("Hi! I'd like to chat about a project.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn btn-gold justify-center"
            >
              <IconWhatsapp className="w-4 h-4" />
              START WHATSAPP CHAT
            </a>
            <p className="text-[10px] text-text-gray text-center mt-2">
              Or call us at <a href="tel:+923001234567" className="text-gold font-semibold">+92 300 1234567</a>
            </p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed bottom-6 right-6 z-50 transition-all duration-300 group",
          open ? "w-12 h-12 rounded-full bg-espresso text-white" : "w-16 h-16 rounded-full shadow-2xl"
        )}
        aria-label="Open live chat"
      >
        {open ? (
          <IconClose className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-50 animate-ping-slow" />
            <span className="absolute inset-0 rounded-full bg-[#25D366] flex items-center justify-center text-white">
              <IconWhatsapp className="w-7 h-7" />
            </span>
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
              1
            </span>
          </>
        )}
      </button>
    </>
  );
}
