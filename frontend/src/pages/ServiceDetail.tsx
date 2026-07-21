import { Link, Navigate, useParams } from 'react-router';
import { ArrowRight, Check, Phone } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { SERVICES, getService } from '@/data/services';
import { SITE } from '@/data/site';
import { useApiItem } from '@/lib/useApiData';
import { useEffect } from 'react';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { item: apiService } = useApiItem('/services', slug, SERVICES);
  const service = apiService ?? (slug ? getService(slug) : undefined);

  useEffect(() => {
    if (service) {
      document.title = ('metaTitle' in service ? service.metaTitle : service.title + ' | Woodex Interior');
      const meta = document.querySelector('meta[name="description"]');
      if (meta && 'metaDesc' in service) meta.setAttribute('content', service.metaDesc);
    }
    return () => {
      document.title = 'Woodex Interior — Interior Design Company in Lahore';
    };
  }, [service]);

  if (!service) return <Navigate to="/services" replace />;

  const related = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[68vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover img-lux" />
          <div className="absolute inset-0" style={{ background: 'var(--grad-hero)' }} />
          <div className="absolute inset-0 bg-[rgba(10,10,10,0.3)]" />
        </div>
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 pt-44">
          <Reveal>
            <div className="flex items-center gap-3 text-[0.62rem] tracking-[0.25em] uppercase text-[#8A8073] mb-6">
              <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
              <span className="text-[#C9A84C]">/</span>
              <Link to="/services" className="hover:text-[#C9A84C] transition-colors">Services</Link>
              <span className="text-[#C9A84C]">/</span>
              <span className="text-[#C9A84C]">{service.shortTitle}</span>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="font-display font-light text-white text-[clamp(2.2rem,5vw,4.4rem)] leading-[1.08] max-w-4xl">
              {service.h1}
            </h1>
          </Reveal>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px z-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)' }} />
      </section>

      {/* Content */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-14">
          {/* Main */}
          <div className="lg:col-span-8">
            <Reveal>
              <span className="eyebrow">{service.shortTitle}</span>
            </Reveal>
            {service.intro.map((p, i) => (
              <Reveal key={i} delay={i as 0 | 1}>
                <p className={`font-light leading-[1.85] mt-6 ${i === 0 ? 'text-lg text-[#D4C5A9]' : 'text-base text-[#8A8073]'}`}>{p}</p>
              </Reveal>
            ))}

            {service.sections.map((sec, si) => (
              <div key={sec.heading} className="mt-14">
                <Reveal>
                  <h2 className="font-display text-3xl text-white mb-7">
                    <span className="text-gold-grad font-semibold">{String(si + 1).padStart(2, '0')}</span>
                    <span className="mx-3 text-[#C9A84C] font-light">—</span>
                    {sec.heading}
                  </h2>
                </Reveal>
                {sec.items && (
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                    {sec.items.map((item, ii) => (
                      <Reveal key={item} delay={Math.min(ii, 3) as 0 | 1 | 2 | 3}>
                        <div className="flex items-start gap-3 border-b border-[rgba(201,168,76,0.15)] pb-3.5">
                          <Check size={15} className="text-[#C9A84C] mt-1 shrink-0" />
                          <span className="text-sm font-light text-[#D4C5A9]">{item}</span>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                )}
                {sec.body && (
                  <Reveal delay={1}>
                    <p className="text-[#8A8073] font-light leading-[1.85]">{sec.body}</p>
                  </Reveal>
                )}
              </div>
            ))}

            {/* CTA box */}
            <Reveal className="mt-16">
              <div className="ornament-corners p-1.5">
                <div className="oc-inner bg-[#161613] border border-[rgba(201,168,76,0.3)] p-8 lg:p-10 text-center">
                  <p className="font-display italic text-2xl text-white mb-6 max-w-xl mx-auto leading-snug">{service.cta}</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/contact" className="btn-lux btn-gold text-[0.66rem]">Request a Consultation</Link>
                    <a href={SITE.whatsappText} target="_blank" rel="noopener noreferrer" className="btn-lux btn-outline text-[0.66rem]">WhatsApp {SITE.phone}</a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-8">
              <Reveal variant="right">
                <div className="bg-[#111110] border border-[rgba(201,168,76,0.25)] p-7">
                  <h3 className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-5">All Services</h3>
                  <ul className="space-y-1">
                    {SERVICES.map((s) => (
                      <li key={s.slug}>
                        <Link
                          to={`/services/${s.slug}`}
                          className={`flex items-center justify-between py-2.5 text-sm font-light border-b border-[rgba(255,255,255,0.05)] transition-colors ${
                            s.slug === service.slug ? 'text-[#C9A84C]' : 'text-[#D4C5A9] hover:text-[#C9A84C]'
                          }`}
                        >
                          {s.shortTitle}
                          <ArrowRight size={13} className={s.slug === service.slug ? 'opacity-100' : 'opacity-0'} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal variant="right" delay={1}>
                <div className="bg-[#111110] border border-[rgba(201,168,76,0.25)] p-7">
                  <h3 className="text-[0.68rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-4">Talk to Woodex</h3>
                  <p className="text-sm font-light text-[#8A8073] leading-relaxed mb-5">
                    Share your floor plan, measurements or site location to begin.
                  </p>
                  <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-3 text-[#C9A84C] font-semibold mb-2">
                    <Phone size={16} /> {SITE.phone}
                  </a>
                  <p className="text-xs font-light text-[#8A8073]">{SITE.shortAddress}</p>
                </div>
              </Reveal>
            </div>
          </aside>
        </div>
      </section>

      {/* Related */}
      <section className="py-20 bg-[#111110] border-t border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <Reveal>
            <h2 className="font-display text-3xl text-white mb-10">Related <span className="text-gold-grad font-semibold">Services</span></h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/services/${s.slug}`} className="card-lux group block">
                  <div className="overflow-hidden aspect-[16/9]">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-white group-hover:text-[#E2C97E] transition-colors">{s.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
