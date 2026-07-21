import EditableElement from '@/components/builder/EditableElement';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { NAV_LINKS, SITE } from '@/data/site';
import { SERVICES } from '@/data/services';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-[rgba(201,168,76,0.3)] shadow-[0_4px_40px_rgba(0,0,0,0.6)] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-[#C9A84C] flex items-center justify-center rotate-45 group-hover:bg-[#C9A84C] transition-colors duration-300">
              <EditableElement path="navbar.logo" contentText="W">
                <span className="font-display text-[#C9A84C] text-xl font-semibold -rotate-45 group-hover:text-black transition-colors duration-300">W</span>
              </EditableElement>
            </div>
            <div className="leading-tight">
              <EditableElement path="navbar.brand" contentText="WOODEX INTERIOR">
                <div className="font-display text-xl tracking-wide text-white">
                  WOODEX <span className="text-gold-grad font-semibold">INTERIOR</span>
                </div>
              </EditableElement>
              <div className="text-[0.55rem] tracking-[0.35em] uppercase text-[#C9A84C]">
                Design · Furniture · Lahore
              </div>
            </div>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden xl:flex items-center gap-9">
            {NAV_LINKS.map((l) =>
              l.label === 'Services' ? (
                <div key={l.to} className="relative group">
                  <NavLink to={l.to} className={({ isActive }) => `nav-link-lux flex items-center gap-1 ${isActive ? 'active' : ''}`}>
                    <EditableElement path={`navbar.nav.${l.to === '/' ? 'home' : l.to.replace('/', '')}`} contentText={l.label}>{l.label}</EditableElement> <ChevronDown size={12} className="text-[#C9A84C] group-hover:rotate-180 transition-transform duration-300" />
                  </NavLink>
                  {/* Dropdown */}
                  <div className="absolute top-[calc(100%+1.2rem)] left-1/2 -translate-x-1/2 translate-y-2 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 transition-all duration-300 bg-[rgba(10,10,10,0.98)] backdrop-blur-2xl border border-[rgba(201,168,76,0.3)] border-t-2 border-t-[#C9A84C] min-w-[300px] max-h-[70vh] overflow-y-auto py-3 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="block px-6 py-2.5 text-[0.66rem] tracking-[0.18em] uppercase text-[#D4C5A9] hover:text-[#C9A84C] hover:pl-7 hover:bg-[rgba(201,168,76,0.05)] border-l-2 border-transparent hover:border-[#C9A84C] transition-all duration-200"
                      >
                        {s.shortTitle}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => `nav-link-lux ${isActive ? 'active' : ''}`}>
                  <EditableElement path={`navbar.nav.${l.to === '/' ? 'home' : l.to.replace('/', '')}`} contentText={l.label}>{l.label}</EditableElement>
                </NavLink>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="hidden xl:flex items-center gap-6">
            <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-2 text-sm text-[#C9A84C] font-semibold tracking-wider hover:text-[#E2C97E] transition-colors">
              <Phone size={15} /> <EditableElement path="navbar.phone" contentText={SITE.phone}>{SITE.phone}</EditableElement>
            </a>
            <Link to="/contact" className="btn-lux btn-gold !py-3 !px-6 text-[0.65rem]">
              <EditableElement path="navbar.cta" contentText="Discuss Your Project">Discuss Your Project</EditableElement>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="xl:hidden w-11 h-11 flex items-center justify-center border border-[rgba(201,168,76,0.4)] text-[#C9A84C]"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[1100] bg-[rgba(8,8,8,0.98)] backdrop-blur-2xl transition-all duration-500 xl:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full px-8 py-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-10">
            <EditableElement path="navbar.brand" contentText="WOODEX INTERIOR">
              <div className="font-display text-xl text-white">
                WOODEX <span className="text-gold-grad font-semibold">INTERIOR</span>
              </div>
            </EditableElement>
            <button
              className="w-11 h-11 flex items-center justify-center border border-[rgba(201,168,76,0.4)] text-[#C9A84C]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l, i) =>
              l.label === 'Services' ? (
                <div key={l.to}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between py-3 font-display text-2xl text-white border-b border-[rgba(201,168,76,0.15)]"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    <EditableElement path={`navbar.nav.${l.to === '/' ? 'home' : l.to.replace('/', '')}`} contentText={l.label}>{l.label}</EditableElement>
                    <ChevronDown size={18} className={`text-[#C9A84C] transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ${servicesOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
                    <div className="py-3 pl-4 flex flex-col gap-2">
                      <Link to="/services" className="text-[0.7rem] tracking-[0.2em] uppercase text-[#C9A84C] py-1.5">
                        All Services →
                      </Link>
                      {SERVICES.map((s) => (
                        <Link key={s.slug} to={`/services/${s.slug}`} className="text-[0.7rem] tracking-[0.18em] uppercase text-[#D4C5A9] py-1.5 hover:text-[#C9A84C]">
                          {s.shortTitle}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `py-3 font-display text-2xl border-b border-[rgba(201,168,76,0.15)] ${isActive ? 'text-[#C9A84C]' : 'text-white'}`
                  }
                >
                  <EditableElement path={`navbar.nav.${l.to === '/' ? 'home' : l.to.replace('/', '')}`} contentText={l.label}>{l.label}</EditableElement>
                </NavLink>
              )
            )}
          </nav>

          <div className="mt-auto pt-10 flex flex-col gap-4">
            <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-3 text-[#C9A84C] font-semibold">
              <Phone size={16} /> <EditableElement path="navbar.phone" contentText={SITE.phone}>{SITE.phone}</EditableElement>
            </a>
            <Link to="/contact" className="btn-lux btn-gold justify-center">
              <EditableElement path="navbar.cta" contentText="Discuss Your Project">Discuss Your Project</EditableElement>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
