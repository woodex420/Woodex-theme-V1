import EditableElement from '@/components/builder/EditableElement';
import { Link } from 'react-router';
import { Phone, MapPin, Mail, Clock } from 'lucide-react';
import { SITE } from '@/data/site';
import { SERVICES } from '@/data/services';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#080808] border-t border-[rgba(201,168,76,0.25)]">
      {/* gold line */}
      <div className="h-[2px] w-full" style={{ background: 'var(--grad-gold-h)' }} />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 border border-[#C9A84C] flex items-center justify-center rotate-45">
                <span className="font-display text-[#C9A84C] text-2xl font-semibold -rotate-45">W</span>
              </div>
              <div className="font-display text-2xl text-white">
                WOODEX <span className="text-gold-grad font-semibold">INTERIOR</span>
              </div>
            </div>
            <EditableElement path="footer.brand" contentText="A Lahore-based interior design and custom furniture company creating functional residential, office, retail and commercial spaces — design and practical planning under one coordinated service.">
              <p className="text-[#8A8073] text-sm font-light leading-relaxed mb-6 max-w-xs">
                A Lahore-based interior design and custom furniture company creating functional residential, office, retail and commercial spaces — design and practical planning under one coordinated service.
              </p>
            </EditableElement>
            <div className="divider-gold max-w-[200px] mb-6">
              <span className="text-[#C9A84C] text-lg">✦</span>
            </div>
            <div className="text-[0.6rem] tracking-[0.3em] uppercase text-[#8A8073]">
              Interior Design · Custom Furniture · Space Planning
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-3">
            <EditableElement path="footer.heading.services" contentText="Services">
              <h4 className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">Services</h4>
            </EditableElement>
            <ul className="space-y-2.5">
              {SERVICES.slice(0, 8).map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-sm font-light text-[#D4C5A9] hover:text-[#C9A84C] transition-colors">
                    <EditableElement path={`footer.link.${s.slug}`} contentText={s.shortTitle}>{s.shortTitle}</EditableElement>
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-sm text-[#C9A84C] font-medium"><EditableElement path="footer.link.all-services" contentText="View all services →">View all services →</EditableElement></Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <EditableElement path="footer.heading.company" contentText="Company">
              <h4 className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">Company</h4>
            </EditableElement>
            <ul className="space-y-2.5">
              <li><Link to="/about" className="text-sm font-light text-[#D4C5A9] hover:text-[#C9A84C] transition-colors"><EditableElement path="footer.link.about" contentText="About Woodex">About Woodex</EditableElement></Link></li>
              <li><Link to="/projects" className="text-sm font-light text-[#D4C5A9] hover:text-[#C9A84C] transition-colors"><EditableElement path="footer.link.projects" contentText="Projects">Projects</EditableElement></Link></li>
              <li><Link to="/insights" className="text-sm font-light text-[#D4C5A9] hover:text-[#C9A84C] transition-colors"><EditableElement path="footer.link.insights" contentText="Insights">Insights</EditableElement></Link></li>
              <li><Link to="/contact" className="text-sm font-light text-[#D4C5A9] hover:text-[#C9A84C] transition-colors"><EditableElement path="footer.link.contact" contentText="Contact">Contact</EditableElement></Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <EditableElement path="footer.heading.contact" contentText="Contact">
              <h4 className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">Contact</h4>
            </EditableElement>
            <ul className="space-y-4 text-sm font-light text-[#D4C5A9]">
              <li className="flex gap-3">
                <MapPin size={16} className="text-[#C9A84C] shrink-0 mt-0.5" />
                <EditableElement path="footer.address" contentText={SITE.address}><span>{SITE.address}</span></EditableElement>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-[#C9A84C] shrink-0" />
                <a href={`tel:${SITE.phoneIntl}`} className="hover:text-[#C9A84C] transition-colors">
                  <EditableElement path="footer.phone" contentText={`${SITE.phone} · ${SITE.landline}`}>{SITE.phone} · {SITE.landline}</EditableElement>
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-[#C9A84C] shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-[#C9A84C] transition-colors"><EditableElement path="footer.email" contentText={SITE.email}>{SITE.email}</EditableElement></a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock size={16} className="text-[#C9A84C] shrink-0" />
                <span>Mon – Sat · By appointment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <EditableElement path="footer.copyright" contentText={`© ${year} Woodex Interior — Lahore, Pakistan. All rights reserved.`}>
            <p className="text-[0.7rem] text-[#8A8073] tracking-wider">
              © {year} Woodex Interior — Lahore, Pakistan. All rights reserved.
            </p>
          </EditableElement>
          <div className="flex gap-6 text-[0.7rem] text-[#8A8073]">
            <Link to="/privacy-policy" className="hover:text-[#C9A84C] transition-colors tracking-wider"><EditableElement path="footer.link.privacy" contentText="Privacy Policy">Privacy Policy</EditableElement></Link>
            <Link to="/terms" className="hover:text-[#C9A84C] transition-colors tracking-wider"><EditableElement path="footer.link.terms" contentText="Terms">Terms</EditableElement></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
