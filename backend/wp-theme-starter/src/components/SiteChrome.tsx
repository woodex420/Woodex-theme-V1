import { useEffect, useState, useRef } from "react";
import { IconMenu, IconClose, IconArrowRight, IconWhatsapp, IconChevronDown } from "./Icons";
import { Logo } from "./Logo";
import { cn } from "../utils/cn";
import { serviceList } from "../data/seo";

export type Page =
  | "home"
  | "about"
  | "services"
  | "studio"
  | "portfolio"
  | "blog"
  | "contact"
  | "files"
  | "consultation"
  | "service"
  | "post"
  | "project";

export function Header({
  current,
  onNavigate,
}: {
  current: string;
  onNavigate: (p: string, slug?: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    setServicesOpen(false);
    setOpen(false);
  }, [current]);

  const links: { label: string; page: string }[] = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "3D Studio", page: "studio" },
    { label: "Portfolio", page: "portfolio" },
    { label: "Journal", page: "blog" },
  ];

  const isActive = (page: string) =>
    current === page ||
    (page === "services" && current === "service") ||
    (page === "blog" && current === "post");

  const onServicesEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  };
  const onServicesLeave = () => {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 200);
  };

  // Logo variant based on scroll state
  const logoVariant = scrolled ? "default" : "light";
  // Nav text color — clean, no drop shadow. When scrolled: dark on cream. When transparent: white.
  const navTextClass = scrolled
    ? "text-espresso hover:text-gold"
    : "text-white hover:text-gold";
  const navActiveClass = "text-gold";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
          scrolled
            ? "bg-cream-50/97 backdrop-blur-md shadow-sm border-b border-gold/10"
            : "bg-black/40 backdrop-blur-md"
        )}
        onMouseLeave={onServicesLeave}
      >
        <div className="container-x flex items-center justify-between h-20 relative">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="group relative z-10"
            aria-label="WP Interior home"
          >
            <Logo variant={logoVariant} size="lg" />
          </button>

          {/* Desktop Nav — centered between logo and CTA */}
          <nav className="hidden lg:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
            {links.map((l) =>
              l.page === "services" ? (
                <div
                  key={l.page}
                  className="relative"
                  onMouseEnter={onServicesEnter}
                >
                  <button
                    onClick={() => onNavigate("services")}
                    className={cn(
                      "px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors flex items-center gap-1.5",
                      isActive(l.page) ? navActiveClass : navTextClass
                    )}
                  >
                    {l.label}
                    <IconChevronDown
                      className={cn(
                        "w-3 h-3 transition-transform duration-300",
                        servicesOpen && "rotate-180"
                      )}
                    />
                  </button>
                </div>
              ) : (
                <button
                  key={l.page}
                  onClick={() => onNavigate(l.page)}
                  className={cn(
                    "px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors",
                    isActive(l.page) ? navActiveClass : navTextClass
                  )}
                >
                  {l.label}
                </button>
              )
            )}
            <button
              onClick={() => onNavigate("contact")}
              className={cn(
                "px-3.5 py-2 text-[13px] font-medium tracking-wide rounded-full transition-colors",
                isActive("contact") ? navActiveClass : navTextClass
              )}
            >
              Contact
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 relative z-10">
            <button
              onClick={() => onNavigate("consultation")}
              className={cn(
                "btn !py-2 !px-4 !text-[10px] tracking-[0.15em] font-semibold",
                scrolled ? "btn-gold" : "bg-white/95 text-espresso hover:bg-gold hover:text-espresso backdrop-blur-md"
              )}
            >
              FREE CONSULTATION
              <IconArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className={cn(
              "lg:hidden w-10 h-10 flex items-center justify-center relative z-10",
              scrolled ? "text-espresso" : "text-white"
            )}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu className="w-6 h-6" />
          </button>
        </div>

        {/* Services mega-menu — right-aligned panel */}
        {servicesOpen && (
          <div
            className="hidden lg:block absolute top-full left-0 right-0 pt-3 z-50"
            onMouseEnter={onServicesEnter}
            onMouseLeave={onServicesLeave}
          >
            <div className="container-x">
              <div className="ml-auto mr-0 max-w-3xl bg-white rounded-card shadow-elevated border border-gold/10 overflow-hidden animate-fade-up">
                <div className="grid grid-cols-12">
                  {/* Service list - left 8 cols */}
                  <div className="col-span-8 p-6 grid grid-cols-2 gap-x-6 gap-y-1">
                    <div className="col-span-2 mb-2 px-3">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-1">All Services</p>
                      <h3 className="font-serif text-xl text-heading leading-tight">Interior Design & 3D Studio</h3>
                    </div>
                    {serviceList.map((s) => (
                      <button
                        key={s.slug}
                        onClick={() => onNavigate("service", s.slug)}
                        className="group flex items-start gap-3 p-3 rounded-lg hover:bg-cream-50 transition-colors text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center flex-shrink-0 transition-colors">
                          <span className="font-serif text-gold text-xs font-semibold">
                            {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-sm text-heading group-hover:text-gold transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[10px] text-text-gray mt-0.5 line-clamp-1 leading-snug">
                            {s.intro.split(". ")[0]}.
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Featured promo - right side (3D Studio) */}
                  <div className="col-span-4 bg-espresso text-white p-6 relative overflow-hidden">
                    <div className="absolute inset-0">
                      <img src="/images/hero-3d.jpg" alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/85 to-espresso/60" />
                    </div>
                    <div className="relative">
                      <span className="inline-flex items-center gap-2 bg-gold/25 border border-gold/40 px-2.5 py-1 rounded-full mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.25em] text-gold font-bold">Featured · 3D Studio</span>
                      </span>
                      <h3 className="font-serif text-2xl text-white mb-2 leading-tight">
                        See it <em className="text-gold not-italic font-medium">before</em> it's built
                      </h3>
                      <p className="text-white/90 text-xs leading-relaxed mb-4">
                        Photorealistic renders, animations and VR walkthroughs from our in-house 3D Studio.
                      </p>
                      <button
                        onClick={() => onNavigate("service", "3d-visualization-interior-design-pakistan")}
                        className="btn btn-gold !py-2 !px-4 !text-[10px] w-full justify-center"
                      >
                        EXPLORE 3D STUDIO
                        <IconArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile menu */}
      {open && (
        <div className="fixed inset-0 bg-cream-50 z-50 lg:hidden overflow-y-auto">
          <div className="container-x h-20 flex items-center justify-between sticky top-0 bg-cream-50 border-b border-border">
            <Logo variant="default" size="md" />
            <button
              className="w-10 h-10 flex items-center justify-center"
              onClick={() => setOpen(false)}
            >
              <IconClose className="w-6 h-6" />
            </button>
          </div>
          <nav className="container-x flex flex-col gap-2 mt-4 pb-10">
            {links.map((l) => (
              <button
                key={l.page}
                onClick={() => {
                  onNavigate(l.page);
                  setOpen(false);
                }}
                className={cn(
                  "text-left py-3 text-2xl font-serif border-b border-border",
                  isActive(l.page) ? "text-gold" : "text-heading"
                )}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                onNavigate("contact");
                setOpen(false);
              }}
              className={cn(
                "text-left py-3 text-2xl font-serif border-b border-border",
                isActive("contact") ? "text-gold" : "text-heading"
              )}
            >
              Contact
            </button>

            {/* Services sub-list */}
            <div className="mt-4 mb-2">
              <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">All Services</p>
              <div className="grid grid-cols-1 gap-1">
                {serviceList.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      onNavigate("service", s.slug);
                      setOpen(false);
                    }}
                    className="text-left py-2.5 text-base text-text-gray hover:text-gold"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate("consultation");
                setOpen(false);
              }}
              className="btn btn-gold mt-6 w-full"
            >
              Free Consultation
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </nav>
        </div>
      )}
    </>
  );
}

export function Footer({ onNavigate }: { onNavigate: (p: string, slug?: string) => void }) {
  return (
    <footer className="bg-espresso text-cream-100 relative overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="container-x py-7">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-1.5">The Journal · Monthly</p>
              <h3 className="font-serif text-xl lg:text-2xl text-white leading-tight">
                Design notes, delivered <em className="text-gold not-italic font-medium">monthly</em>
              </h3>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/60 focus:border-gold focus:outline-none focus:bg-white/15 transition-colors"
              />
              <button type="submit" className="btn btn-gold !py-2.5 !px-5 !text-[11px] flex-shrink-0">
                SUBSCRIBE
                <IconArrowRight className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-x py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo variant="light" size="lg" />
            <p className="text-sm text-white/80 leading-relaxed mt-5 mb-5 max-w-xs">
              Pakistan's award-winning interior design company. Crafting timeless spaces where vision meets craftsmanship.
            </p>
            <div className="flex gap-2">
              {[
                { label: "Instagram", path: "M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.22.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.22.07 1.25.07 1.65.07 4.85s0 3.6-.07 4.85c-.05 1.17-.25 1.8-.41 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.22.41-1.25.07-1.65.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.22-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.22C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.85c.05-1.17.25-1.8.41-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.22-.41C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.15 0-3.5 0-4.74.07-1.07.05-1.65.23-2.04.38-.51.2-.88.44-1.27.83-.39.39-.63.76-.83 1.27-.15.39-.33.97-.38 2.04C2.7 9.5 2.7 9.85 2.7 13s0 3.5.04 4.74c.05 1.07.23 1.65.38 2.04.2.51.44.88.83 1.27.39.39.76.63 1.27.83.39.15.97.33 2.04.38 1.24.07 1.59.07 4.74.07s3.5 0 4.74-.07c1.07-.05 1.65-.23 2.04-.38.51-.2.88-.44 1.27-.83.39-.39.63-.76.83-1.27.15-.39.33-.97.38-2.04.07-1.24.07-1.59.07-4.74s0-3.5-.07-4.74c-.05-1.07-.23-1.65-.38-2.04-.2-.51-.44-.88-.83-1.27-.39-.39-.76-.63-1.27-.83-.39-.15-.97-.33-2.04-.38C15.5 4 15.15 4 12 4zM12 7.4a4.6 4.6 0 110 9.2 4.6 4.6 0 010-9.2zm0 1.8a2.8 2.8 0 100 5.6 2.8 2.8 0 000-5.6zm5.65-2a1.1 1.1 0 110 2.2 1.1 1.1 0 010-2.2z" },
                { label: "LinkedIn", path: "M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.78C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.43c.99 0 1.79-.77 1.79-1.72V1.72C24 .77 23.2 0 22.22 0z" },
                { label: "Pinterest", path: "M12 0C5.4 0 0 5.4 0 12c0 5 3 9.3 7.4 11.1-.1-.9-.2-2.4 0-3.4.2-.9 1.4-5.7 1.4-5.7s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.2 0 3.8-2.3 3.8-5.6 0-2.9-2.1-5-5.1-5-3.5 0-5.5 2.6-5.5 5.3 0 1 .4 2.2.9 2.8.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2 4.1 0 7.3 2.9 7.3 6.9 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1 2.4-1.5 3.2 1.2.4 2.4.5 3.6.5 6.6 0 12-5.4 12-12S18.6 0 12 0z" },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-cream-100/70 hover:bg-gold hover:text-espresso hover:border-gold transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Services column */}
          <div className="lg:col-span-3">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.25em] mb-5 font-bold">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {serviceList.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <button
                    onClick={() => onNavigate("service", s.slug)}
                    className="text-white/85 hover:text-gold transition-colors"
                  >
                    {s.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio column */}
          <div className="lg:col-span-2">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.25em] mb-5 font-bold">Studio</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "About", page: "about" },
                { label: "3D Studio", page: "studio" },
                { label: "Portfolio", page: "portfolio" },
                { label: "Journal", page: "blog" },
                { label: "Free Consultation", page: "consultation" },
                { label: "Contact", page: "contact" },
                { label: "For Developers", page: "files" },
                { label: "Admin Dashboard", page: "admin" as const },
              ].map((l) => (
                <li key={l.page}>
                  {l.page === "admin" ? (
                    <a
                      href="#/admin"
                      className="text-white/85 hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                      {l.label}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-gold/20 text-gold">PRO</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onNavigate(l.page)}
                      className="text-white/85 hover:text-gold transition-colors"
                    >
                      {l.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="lg:col-span-3">
            <h4 className="text-gold text-[10px] uppercase tracking-[0.25em] mb-5 font-bold">Visit · Lahore HQ</h4>
            <address className="not-italic text-sm text-white/85 leading-relaxed space-y-2">
              <p>124-G, MM Alam Road<br />Gulberg III, Lahore 54000<br />Pakistan</p>
              <p>
                <a href="tel:+923001234567" className="hover:text-gold transition-colors text-white">+92 300 1234567</a><br />
                <a href="mailto:hello@wpinterior.com" className="hover:text-gold transition-colors text-white">hello@wpinterior.com</a>
              </p>
              <p className="text-[10px] text-white/65 mt-2">Mon–Sat · 9:00 – 19:00 PKT</p>
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 pt-5 text-xs text-white/55">
          <p>© 2025 WP Interior Studio. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Cookies</a>
            <a href="#" className="hover:text-gold">Sitemap</a>
            <a
              href="#/admin"
              className="hover:text-gold uppercase tracking-widest text-[10px] font-semibold border-l border-white/15 pl-5"
              title="WP Interior Admin"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function WhatsappWidget() {
  return (
    <a
      href="https://wa.me/923001234567?text=Hello!%20I'd%20like%20to%20inquire%20about%20your%20interior%20design%20services."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-[60px] h-[60px] rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping-slow"></span>
      <IconWhatsapp className="relative w-7 h-7" />
      <span className="absolute right-full mr-3 bg-white text-espresso px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us!
        <span className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-white rotate-45"></span>
      </span>
    </a>
  );
}
