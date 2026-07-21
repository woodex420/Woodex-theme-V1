import { useState, type FormEvent } from 'react';
import { Phone, MapPin, Mail, Clock, Paperclip, CheckCircle2, Loader2 } from 'lucide-react';
import EditableElement from '@/components/builder/EditableElement';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import { SITE } from '@/data/site';
import { SERVICES } from '@/data/services';
import { submitInquiry } from '@/lib/api';

const PROJECT_TYPES = ['Home / Residential', 'Office / Workspace', 'Retail / Shop', 'Commercial Space', 'Custom Furniture Only', 'Renovation', 'Other'];
const BUDGETS = ['Under PKR 5 Lac', 'PKR 5 – 15 Lac', 'PKR 15 – 40 Lac', 'PKR 40 Lac – 1 Crore', 'Above PKR 1 Crore', 'To Be Discussed'];

export default function Contact() {
  const [services, setServices] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [inquiryId, setInquiryId] = useState('');
  const [fileName, setFileName] = useState('');

  const toggleService = (s: string) =>
    setServices((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setStatus('sending');
    try {
      const res = await submitInquiry({
        full_name: String(fd.get('full_name') || ''),
        phone: String(fd.get('phone') || ''),
        email: String(fd.get('email') || ''),
        project_type: String(fd.get('project_type') || ''),
        project_location: String(fd.get('project_location') || ''),
        area: String(fd.get('area') || ''),
        services,
        start_date: String(fd.get('start_date') || ''),
        budget: String(fd.get('budget') || ''),
        message: String(fd.get('message') || ''),
        source_page: window.location.pathname,
      });
      setInquiryId(res.inquiry_id);
      setStatus('success');
      form.reset();
      setServices([]);
      setFileName('');
    } catch {
      setStatus('error');
    }
  };

  const inputCls = 'input-lux';

  return (
    <>
      <PageHero
        pageName="contact"
        eyebrow="Contact Woodex Interior"
        title={<>Discuss Your Project <span className="text-gold-grad font-semibold not-italic">With Woodex Interior</span></>}
        subtitle="Tell us about your home, office, shop, commercial interior or custom furniture requirements."
        image="/images/project-dining.jpg"
        watermark="Contact"
      />

      <EditableElement path="contact.section.main" asSection sectionLabel="Contact Main">
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14">
          {/* Info column */}
          <div className="lg:col-span-4 space-y-8">
            <Reveal variant="left">
              <span className="eyebrow">Get in Touch</span>
              <h2 className="font-display text-3xl text-white mt-5 mb-8">Call, WhatsApp <span className="text-gold-grad font-semibold">or Visit</span></h2>
            </Reveal>

            {[
              { icon: Phone, label: 'Mobile / WhatsApp', value: SITE.phone, href: `tel:${SITE.phoneIntl}`, editablePath: 'contact.info.phone' },
              { icon: Phone, label: 'Landline', value: SITE.landline, href: 'tel:+924235942471', editablePath: 'contact.info.landline' },
              { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, editablePath: 'contact.info.email' },
              { icon: MapPin, label: 'Address', value: SITE.address, editablePath: 'contact.info.address' },
              { icon: Clock, label: 'Hours', value: 'Mon – Sat · By appointment', editablePath: 'contact.info.hours' },
            ].map((c, i) => (
              <Reveal key={c.label} variant="left" delay={Math.min(i + 1, 4) as 1 | 2 | 3 | 4}>
                <div className="flex gap-4 items-start border-b border-[rgba(201,168,76,0.15)] pb-5">
                  <div className="w-11 h-11 border border-[rgba(201,168,76,0.4)] flex items-center justify-center shrink-0">
                    <c.icon size={17} className="text-[#C9A84C]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-[0.58rem] tracking-[0.25em] uppercase text-[#8A8073] mb-1">{c.label}</div>
                    {c.href ? (
                      <EditableElement path={c.editablePath} contentText={c.value}>
                        <a href={c.href} className="text-sm text-[#D4C5A9] font-medium hover:text-[#C9A84C] transition-colors">{c.value}</a>
                      </EditableElement>
                    ) : (
                      <EditableElement path={c.editablePath} contentText={c.value}>
                        <span className="text-sm text-[#D4C5A9] font-light leading-relaxed">{c.value}</span>
                      </EditableElement>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal variant="left" delay={4}>
              <a href={SITE.whatsappText} target="_blank" rel="noopener noreferrer" className="btn-lux w-full justify-center text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-white py-4 rounded-full" style={{ background: '#25D366' }}>
                Chat on WhatsApp
              </a>
            </Reveal>
          </div>

          {/* Form column */}
          <div className="lg:col-span-8">
            <Reveal variant="right">
              <div className="bg-[#111110] border border-[rgba(201,168,76,0.25)] p-8 lg:p-12">
                {status === 'success' ? (
                  <div className="text-center py-16">
                    <CheckCircle2 size={56} className="text-[#C9A84C] mx-auto mb-6" strokeWidth={1.2} />
                    <h3 className="font-display text-3xl text-white mb-4">Inquiry Received</h3>
                    <p className="text-[#8A8073] font-light mb-2">Reference: <span className="text-[#C9A84C] font-semibold">{inquiryId}</span></p>
                    <p className="text-[#D4C5A9] font-light max-w-md mx-auto">
                      Thank you for contacting Woodex Interior. Our team will review your requirements and contact you shortly.
                    </p>
                    <button onClick={() => setStatus('idle')} className="btn-lux btn-outline mt-8 text-[0.65rem]">Send Another Inquiry</button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} noValidate={false}>
                    {/* honeypot */}
                    <input type="text" name="_honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                    <EditableElement path="contact.form.heading" contentText="Request a Consultation">
                      <h3 className="font-display text-2xl text-white mb-8">Request a <span className="text-gold-grad font-semibold">Consultation</span></h3>
                    </EditableElement>

                    <div className="grid md:grid-cols-2 gap-x-6 gap-y-6">
                      <div>
                        <label className="label-lux" htmlFor="full_name">Full Name *</label>
                        <input id="full_name" name="full_name" required minLength={2} className={inputCls} placeholder="Your full name" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="phone">Phone / WhatsApp *</label>
                        <input id="phone" name="phone" type="tel" required className={inputCls} placeholder="03XX XXXXXXX" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="email">Email *</label>
                        <input id="email" name="email" type="email" required className={inputCls} placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="project_type">Project Type *</label>
                        <select id="project_type" name="project_type" required className="select-lux" defaultValue="">
                          <option value="" disabled>Select project type</option>
                          {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="project_location">Project Location</label>
                        <input id="project_location" name="project_location" className={inputCls} placeholder="Area / city" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="area">Approximate Area</label>
                        <input id="area" name="area" className={inputCls} placeholder="e.g. 10 marla, 2,000 sq ft" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="start_date">Expected Start Date</label>
                        <input id="start_date" name="start_date" className={inputCls} placeholder="e.g. Next month" />
                      </div>
                      <div>
                        <label className="label-lux" htmlFor="budget">Budget Range</label>
                        <select id="budget" name="budget" className="select-lux" defaultValue="">
                          <option value="" disabled>Select budget range</option>
                          {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* services checkboxes */}
                    <div className="mt-8">
                      <span className="label-lux">Required Services</span>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                        {SERVICES.slice(0, 9).map((s) => (
                          <label key={s.slug} className={`flex items-center gap-2.5 border px-3.5 py-3 cursor-pointer transition-all duration-200 ${
                            services.includes(s.shortTitle)
                              ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.08)] text-[#E2C97E]'
                              : 'border-[rgba(201,168,76,0.2)] text-[#8A8073] hover:border-[rgba(201,168,76,0.5)]'
                          }`}>
                            <input type="checkbox" className="sr-only" checked={services.includes(s.shortTitle)} onChange={() => toggleService(s.shortTitle)} />
                            <span className={`w-3.5 h-3.5 border flex items-center justify-center shrink-0 ${services.includes(s.shortTitle) ? 'bg-[#C9A84C] border-[#C9A84C]' : 'border-[rgba(201,168,76,0.5)]'}`}>
                              {services.includes(s.shortTitle) && <span className="text-black text-[9px] font-bold">✓</span>}
                            </span>
                            <span className="text-[0.68rem] font-light tracking-wide">{s.shortTitle}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8">
                      <label className="label-lux" htmlFor="message">Message</label>
                      <textarea id="message" name="message" rows={5} className="textarea-lux" placeholder="Tell us about your project — rooms, style preferences, requirements…" />
                    </div>

                    <div className="mt-6">
                      <label htmlFor="attachment" className="flex items-center gap-3 border border-dashed border-[rgba(201,168,76,0.4)] px-5 py-4 cursor-pointer text-[#8A8073] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
                        <Paperclip size={16} />
                        <span className="text-[0.72rem] tracking-[0.15em] uppercase">
                          {fileName || 'Attach floor plan or reference images (optional)'}
                        </span>
                      </label>
                      <input id="attachment" type="file" accept=".pdf,.jpg,.jpeg,.png,.dwg" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')} />
                    </div>

                    {status === 'error' && (
                      <p className="mt-5 text-sm text-[#c96a6a]">Something went wrong. Please try again or contact us directly by phone.</p>
                    )}

                    <button type="submit" disabled={status === 'sending'} className="btn-lux btn-gold btn--full w-full mt-8 disabled:opacity-60 disabled:cursor-not-allowed">
                      {status === 'sending' ? (
                        <>Sending <Loader2 size={15} className="animate-spin" /></>
                      ) : (
                        'Send Inquiry'
                      )}
                    </button>
                    <p className="text-[0.68rem] text-[#8A8073] font-light mt-4 text-center">
                      By submitting, you agree to be contacted by Woodex Interior regarding your inquiry.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      </EditableElement>

      {/* Map strip */}
      <EditableElement path="contact.section.map" asSection sectionLabel="Map">
      <section className="border-t border-[rgba(201,168,76,0.2)]">
        <div className="relative h-[380px]">
          <iframe
            title="Woodex Interior location — Zainab Tower, Model Town Link Road, Lahore"
            src="https://www.google.com/maps?q=Zainab%20Tower%20Model%20Town%20Link%20Road%20Lahore&output=embed"
            className="w-full h-full border-0 grayscale invert-[0.92] contrast-[0.9]"
            loading="lazy"
          />
          <div className="absolute top-6 left-6 bg-[rgba(10,10,10,0.92)] border border-[rgba(201,168,76,0.4)] px-6 py-5 backdrop-blur-md">
            <div className="text-[0.6rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-2">Visit Woodex</div>
            <div className="text-sm text-white font-light">{SITE.shortAddress}</div>
          </div>
        </div>
      </section>
      </EditableElement>
    </>
  );
}
