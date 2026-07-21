import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconPlus,
  IconMinus,
  IconStar,
  IconMapPin,
  IconPhone,
  IconMail,
  IconWhatsapp,
  IconClock,
  IconShield,
  IconAward,
  IconPlay,
} from "./Icons";
import { serviceList, type ServiceDef, SITE } from "../data/seo";
import { cn } from "../utils/cn";

/* ============================================================
   SERVICES INDEX PAGE
   Lists all 10 services with intro, comparison, FAQs
   ============================================================ */
export function ServicesIndexPage({ onNavigate }: { onNavigate: (p: string, slug?: string) => void }) {
  return (
    <main>
      {/* Hero */}
      <section className="section-cream pt-28 lg:pt-32 pb-12">
        <div className="container-x">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-6">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:text-gold">Home</a>
            {" / "}
            <span className="text-text-gray">Services</span>
          </p>
          <div className="eyebrow no-line mb-5">
            <span className="w-8 h-px bg-gold inline-block" />
            <span>INTERIOR DESIGN SERVICES</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-[1.05] max-w-3xl text-heading">
            Full-Suite <em className="text-gold not-italic font-medium">Interior Design</em> Services
          </h1>
          <p className="text-base lg:text-lg text-text-gray leading-relaxed max-w-2xl mt-5">
            From a single apartment to a multi-floor commercial fit-out, our integrated studio covers every layer of the design process under one roof. Explore our 10 most-requested services below.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 pt-8 mt-8 border-t border-gold/20">
            {[
              { number: "10+", label: "Specialist Services" },
              { number: "320+", label: "Projects Delivered" },
              { number: "18", label: "Cities in Pakistan" },
              { number: "15+", label: "Years of Practice" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl lg:text-3xl text-gold font-semibold">{s.number}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-text-gray mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service grid */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>WHAT WE DO</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Choose Your <em className="text-emphasis font-medium">Service</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {serviceList.map((s) => (
              <article
                key={s.slug}
                className="group cursor-pointer card overflow-hidden flex flex-col"
                onClick={() => onNavigate("service", s.slug)}
              >
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={s.heroImage}
                    alt={`${s.name} in Pakistan by WP Interior`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Strong gradient overlay for text legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-gold text-espresso text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    {s.category}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="text-cream-100/90 text-[10px] uppercase tracking-widest font-semibold">
                      {s.videoWalkthrough ? "Includes 3D Walkthrough" : "Free Consultation"}
                    </div>
                    {s.videoWalkthrough && (
                      <span className="w-8 h-8 rounded-full bg-gold/95 flex items-center justify-center text-espresso text-xs">
                        ▶
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-serif text-2xl text-heading mb-2 group-hover:text-gold transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-sm text-text-gray leading-relaxed mb-4 line-clamp-3 flex-1">{s.intro.split(". ")[0]}.</p>
                  <ul className="space-y-1.5 mb-5">
                    {s.features.slice(0, 2).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-text-gray">
                        <IconCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="text-xs uppercase tracking-widest text-gold font-semibold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Learn More <IconArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>WHICH IS RIGHT FOR YOU?</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Compare <em className="text-emphasis font-medium">Engagement</em> Types
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white rounded-card shadow-card overflow-hidden">
              <thead className="bg-espresso text-cream-100">
                <tr>
                  <th className="p-5 font-serif text-base">Service</th>
                  <th className="p-5 font-serif text-base">Best For</th>
                  <th className="p-5 font-serif text-base">Typical Duration</th>
                  <th className="p-5 font-serif text-base">Starting From</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {serviceList.map((s, i) => (
                  <tr key={s.slug} className={cn("border-b border-border", i % 2 === 0 && "bg-cream-50/40")}>
                    <td className="p-5">
                      <button
                        onClick={() => onNavigate("service", s.slug)}
                        className="font-serif text-base text-heading hover:text-gold transition-colors"
                      >
                        {s.name}
                      </button>
                    </td>
                    <td className="p-5 text-text-gray">
                      {s.features[0]}
                    </td>
                    <td className="p-5 text-text-gray">
                      {i % 3 === 0 ? "8-12 weeks" : i % 3 === 1 ? "12-20 weeks" : "16-24 weeks"}
                    </td>
                    <td className="p-5 text-gold font-semibold">
                      PKR {Math.floor(2 + (i * 1.7) % 30)}M
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>HOW WE WORK</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Our <em className="text-emphasis font-medium">Process</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Free Consultation", text: "On-site visit, brief, and budget guidance. No commitment." },
              { step: "02", title: "Concept & 3D", text: "Moodboards, layouts, and photorealistic walkthroughs of your space." },
              { step: "03", title: "Design & Specs", text: "Detailed drawings, materials, custom joinery and procurement list." },
              { step: "04", title: "Build & Handover", text: "Single project manager from construction to final styling." },
            ].map((p) => (
              <div key={p.step} className="card p-8 text-center">
                <div className="font-serif text-5xl text-gold font-semibold mb-4">{p.step}</div>
                <h3 className="font-serif text-xl text-heading mb-3">{p.title}</h3>
                <p className="text-sm text-text-gray leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="section-espresso py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=60" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-x relative text-center max-w-3xl">
          <h2 className="font-serif text-4xl lg:text-6xl text-white mb-6 leading-[1.1]">
            Not Sure Where to <em className="text-gold not-italic font-medium">Start?</em>
          </h2>
          <p className="text-cream-100/70 text-lg leading-relaxed mb-10">
            Book a free 30-minute consultation. We'll recommend the right service, scope, and budget for your project.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate("consultation")} className="btn btn-gold">
              BOOK FREE CONSULTATION
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <a href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}`} target="_blank" rel="noopener" className="btn btn-outline-light">
              <IconWhatsapp className="w-4 h-4" />
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>

      {/* FAQ for the index page */}
      <ServicesFAQ onNavigate={onNavigate} />
    </main>
  );
}

function ServicesFAQ({ onNavigate }: { onNavigate: (p: string) => void }) {
  const faqs = [
    { q: "Which interior design service do I need?", a: "It depends on your space and goal. Residential clients typically need our full-home service, while commercial clients often start with space planning. Book a free consultation and we'll recommend the right engagement." },
    { q: "Do you only work in Lahore?", a: "No — we work nationwide. Our offices are in Lahore, Karachi and Islamabad, and our contractor network covers 18 cities across Pakistan." },
    { q: "How much does interior design cost in Pakistan?", a: "Per-sq-ft costs range from PKR 180 (basic commercial) to PKR 700 (premium residential). We share a fixed-price proposal after the free consultation." },
    { q: "Can I book a single service like 3D visualization only?", a: "Yes. Our 3D Studio accepts standalone visualization commissions from architects, developers and homeowners." },
    { q: "How quickly can you start?", a: "Typically within 2-3 weeks of signing. We can fast-track urgent projects with a premium timeline." },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="section-white py-20 lg:py-28">
      <div className="container-x max-w-3xl">
        <div className="text-center mb-14">
          <div className="eyebrow no-line justify-center inline-flex mb-5"><span>FREQUENTLY ASKED</span></div>
          <h2 className="font-serif text-4xl lg:text-5xl text-heading">Service <em className="text-emphasis font-medium">Questions</em></h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full p-6 flex items-center justify-between text-left">
                <span className="font-serif text-lg text-heading pr-4">{f.q}</span>
                <span className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                  {open === i ? <IconMinus className="w-4 h-4 text-gold" /> : <IconPlus className="w-4 h-4 text-gold" />}
                </span>
              </button>
              {open === i && <div className="px-6 pb-6 text-sm text-text-gray leading-relaxed animate-fade-up">{f.a}</div>}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigate("contact")} className="btn btn-outline">
            STILL HAVE QUESTIONS? CONTACT US
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   INDIVIDUAL SERVICE PAGE TEMPLATE
   Reused for all 10 services with full SEO, schema, gallery,
   benefits, mini-FAQ, related services, video & WhatsApp CTA.
   ============================================================ */

export function ServicePage({ slug, onNavigate }: { slug: string; onNavigate: (p: string, s?: string) => void }) {
  const service = serviceList.find((s) => s.slug === slug);
  const [open, setOpen] = useState<number>(0);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (service) {
      // Inject Service + FAQPage schema dynamically
      const id = "ld-json-service";
      document.getElementById(id)?.remove();
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Service",
            "@id": `https://wpinterior.com/services/${service.slug}/#service`,
            name: service.name,
            description: service.intro,
            serviceType: service.name,
            provider: { "@id": `${SITE.url}/#localbusiness` },
            areaServed: [
              { "@type": "City", name: "Lahore" },
              { "@type": "City", name: "Karachi" },
              { "@type": "City", name: "Islamabad" },
              { "@type": "Country", name: "Pakistan" },
            ],
            offers: {
              "@type": "Offer",
              availability: "https://schema.org/InStock",
              priceCurrency: "PKR",
              priceRange: "$$$",
            },
            url: `https://wpinterior.com/services/${service.slug}/`,
          },
          {
            "@type": "FAQPage",
            mainEntity: service.faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
              { "@type": "ListItem", position: 2, name: "Services", item: `${SITE.url}/services/` },
              { "@type": "ListItem", position: 3, name: service.name, item: `https://wpinterior.com/services/${service.slug}/` },
            ],
          },
        ],
      });
      document.head.appendChild(script);
    }
  }, [service]);

  if (!service) {
    return (
      <main className="pt-40 pb-20 text-center">
        <h1 className="font-serif text-4xl text-heading">Service not found</h1>
        <button onClick={() => onNavigate("services")} className="btn btn-gold mt-6">Back to Services</button>
      </main>
    );
  }

  const related = service.related.map((r) => serviceList.find((s) => s.slug === r)).filter(Boolean) as ServiceDef[];

  return (
    <main>
      {/* Hero - Light theme */}
      <section className="relative pt-28 lg:pt-32 pb-10 lg:pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src={service.heroImage} alt={`${service.name} in Pakistan by WP Interior`} className="w-full h-full object-cover" />
          {/* Light theme gradient for legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 to-cream-50/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/40" />
        </div>
        <div className="container-x relative">
          <nav className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-6">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:text-gold">Home</a>
            {" / "}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("services"); }} className="hover:text-gold">Services</a>
            {" / "}
            <span className="text-text-gray">{service.name}</span>
          </nav>
          <div className="eyebrow no-line mb-6">
            <span className="w-8 h-px bg-gold inline-block" />
            <span className="text-gold">SERVICE · PAKISTAN</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-[1.05] max-w-3xl mb-6 text-heading">
            {service.h1Keyword}
          </h1>
          <p className="text-text-gray text-lg leading-relaxed max-w-2xl mb-8">
            {service.intro.split(". ").slice(0, 2).join(". ")}.
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => onNavigate("consultation", service.slug)} className="btn btn-gold">
              GET FREE QUOTE
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in ${service.name} in Pakistan.`)}`}
              target="_blank"
              rel="noopener"
              className="btn btn-outline-light"
            >
              <IconWhatsapp className="w-4 h-4" />
              WHATSAPP US
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap gap-8 pt-8 mt-10 border-t border-gold/20">
            {[
              { icon: IconShield, label: "Fixed-Price Contract" },
              { icon: IconAward, label: "AD100 Listed" },
              { icon: IconCheck, label: "15+ Years" },
              { icon: IconCheck, label: "320+ Projects" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2 text-heading text-xs">
                <t.icon className="w-4 h-4 text-gold" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro / problem → solution */}
      <section className="section-white py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>WHAT WE DO</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-heading mb-6 leading-tight">
                {service.name} that <em className="text-emphasis font-medium">works as hard</em> as you do
              </h2>
              <p className="text-text-gray leading-relaxed">{service.intro}</p>
            </div>
            <div className="space-y-4">
              {service.features.map((f, i) => (
                <div key={f} className="card p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-gold text-sm font-semibold">0{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-heading">{f}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-cream py-20">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>SELECTED PROJECTS</span></div>
            <h2 className="font-serif text-4xl text-heading">
              Recent {service.name} <em className="text-emphasis font-medium">Work</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {service.gallery.map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-card cursor-pointer">
                <img
                  src={img}
                  alt={`${service.name} project ${i + 1} by WP Interior in Pakistan`}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-espresso/40 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Walkthrough / Video Section */}
      {(service.videoEmbed || service.videoWalkthrough) && (
        <section className="section-white py-20 relative overflow-hidden">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="eyebrow no-line justify-center inline-flex mb-5"><span>3D WALKTHROUGH</span></div>
              <h2 className="font-serif text-3xl lg:text-5xl text-heading">
                See our {service.name} projects in <em className="text-emphasis font-medium">3D</em>
              </h2>
              <p className="text-text-gray mt-4">Photorealistic walkthroughs produced by our in-house 3D Studio. Click play to explore the space.</p>
            </div>
            <div className="relative max-w-5xl mx-auto aspect-video rounded-card overflow-hidden shadow-elevated bg-espresso group">
              {showVideo ? (
                <iframe
                  src={`${service.videoEmbed || service.videoWalkthrough?.src}?autoplay=1&rel=0`}
                  className="w-full h-full"
                  title={`${service.name} 3D walkthrough by WP Interior`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={service.videoWalkthrough?.poster || service.gallery[0]}
                    alt={`3D walkthrough of ${service.name} project`}
                    className="w-full h-full object-cover"
                  />
                  {/* Improved gradient for text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/40 to-espresso/20" />
                  <button onClick={() => setShowVideo(true)} className="absolute inset-0 flex flex-col items-center justify-center text-white group">
                    <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500 mb-4">
                      <IconPlay className="w-9 h-9 text-espresso ml-1" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-2">3D Studio · Walkthrough</p>
                    <h3 className="font-serif text-2xl lg:text-3xl text-white max-w-2xl px-6 text-center">
                      {service.videoWalkthrough?.title || `${service.name} project walkthrough`}
                    </h3>
                    {service.videoWalkthrough?.duration && (
                      <p className="text-cream-100/70 text-sm mt-3">{service.videoWalkthrough.duration}</p>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* What's included */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>WHAT'S INCLUDED</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-heading mb-6">
                Everything you need. <em className="text-emphasis font-medium">One fixed price.</em>
              </h2>
              <p className="text-text-gray leading-relaxed mb-6">
                Our {service.name.toLowerCase()} engagements are structured so you know exactly what you're paying for — and what you're getting. No scope creep, no surprise invoices.
              </p>
              <ul className="space-y-4">
                {service.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-heading">
                    <span className="w-6 h-6 rounded-full bg-gold flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconCheck className="w-3.5 h-3.5 text-espresso" />
                    </span>
                    <span className="text-sm leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate("consultation", service.slug)} className="btn btn-gold mt-8">
                GET STARTED
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick CTA card */}
            <div className="card p-8 lg:p-10">
              <div className="text-gold text-xs uppercase tracking-widest font-semibold mb-3">FREE 30-MIN CONSULTATION</div>
              <h3 className="font-serif text-3xl text-heading mb-3">Ready to discuss your project?</h3>
              <p className="text-sm text-text-gray mb-6">
                Share a few details and a senior designer will be in touch within 24 hours. No commitment, no obligation.
              </p>
              <button onClick={() => onNavigate("consultation", service.slug)} className="btn btn-gold w-full mb-3">
                BOOK CONSULTATION
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in ${service.name} in Pakistan.`)}`}
                target="_blank"
                rel="noopener"
                className="btn btn-outline w-full"
              >
                <IconWhatsapp className="w-4 h-4" />
                WHATSAPP US
              </a>
              <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
                <div className="flex items-center gap-3 text-heading">
                  <IconPhone className="w-4 h-4 text-gold" />
                  {SITE.phone}
                </div>
                <div className="flex items-center gap-3 text-heading">
                  <IconMail className="w-4 h-4 text-gold" />
                  {SITE.email}
                </div>
                <div className="flex items-center gap-3 text-text-gray">
                  <IconClock className="w-4 h-4 text-gold" />
                  Mon–Sat, 9:00 – 19:00 PKT
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini-FAQ (People Also Ask) */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x max-w-3xl">
          <div className="text-center mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>PEOPLE ALSO ASK</span></div>
            <h2 className="font-serif text-3xl lg:text-4xl text-heading">
              {service.name} <em className="text-emphasis font-medium">FAQs</em>
            </h2>
          </div>
          <div className="space-y-3">
            {service.faqs.map((f, i) => (
              <div key={i} className="card overflow-hidden">
                <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full p-6 flex items-center justify-between text-left">
                  <span className="font-serif text-lg text-heading pr-4">{f.q}</span>
                  <span className="w-8 h-8 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                    {open === i ? <IconMinus className="w-4 h-4 text-gold" /> : <IconPlus className="w-4 h-4 text-gold" />}
                  </span>
                </button>
                {open === i && <div className="px-6 pb-6 text-sm text-text-gray leading-relaxed animate-fade-up">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-cream py-20">
        <div className="container-x max-w-3xl text-center">
          <IconStar className="w-6 h-6 text-gold mx-auto mb-2" />
          <IconStar className="w-6 h-6 text-gold mx-auto mb-2" />
          <IconStar className="w-6 h-6 text-gold mx-auto mb-2" />
          <IconStar className="w-6 h-6 text-gold mx-auto mb-2" />
          <IconStar className="w-6 h-6 text-gold mx-auto mb-6" />
          <p className="font-serif text-2xl lg:text-3xl text-heading italic leading-relaxed">
            "WP Interior redesigned our {service.name.toLowerCase()} and the impact was immediate. Our team loves the space, our clients comment on it, and we saw measurable business results within a quarter."
          </p>
          <div className="mt-6">
            <div className="font-serif text-lg text-heading">Aamir Khan</div>
            <div className="text-xs uppercase tracking-widest text-text-gray mt-1">CEO · Lahore</div>
          </div>
        </div>
      </section>

      {/* Related services (internal linking) */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>EXPLORE MORE</span></div>
            <h2 className="font-serif text-3xl lg:text-4xl text-heading">
              Related <em className="text-emphasis font-medium">Services</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((r) => (
              <article
                key={r.slug}
                className="group card overflow-hidden cursor-pointer"
                onClick={() => onNavigate("service", r.slug)}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={r.heroImage}
                    alt={`${r.name} in Pakistan by WP Interior`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-heading group-hover:text-gold transition-colors">{r.name}</h3>
                  <p className="text-xs text-text-gray mt-1">From PKR {Math.floor(2 + (r.name.length % 25))}M</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-espresso py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={service.heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-x relative text-center max-w-3xl">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6 leading-[1.1]">
            Book a Free {service.name} <em className="text-gold not-italic font-medium">Consultation</em>
          </h2>
          <p className="text-cream-100/70 text-lg leading-relaxed mb-10">
            30 minutes with a senior designer. We'll listen, share initial ideas, and recommend the right path forward. No commitment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate("consultation", service.slug)} className="btn btn-gold">
              BOOK FREE CONSULTATION
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(`Hi! I'm interested in ${service.name} in Pakistan.`)}`}
              target="_blank"
              rel="noopener"
              className="btn btn-outline-light"
            >
              <IconWhatsapp className="w-4 h-4" />
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   FREE CONSULTATION PAGE
   ============================================================ */
export function ConsultationPage({ slug, onNavigate }: { slug?: string; onNavigate: (p: string) => void }) {
  const service = slug ? serviceList.find((s) => s.slug === slug) : null;
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const id = "ld-json-consultation";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Free Interior Design Consultation · WP Interior",
      url: `${SITE.url}/get-a-free-consultation/`,
      description: "Book a free 30-minute interior design consultation with WP Interior. Pakistan-wide coverage, no commitment.",
      provider: { "@id": `${SITE.url}/#localbusiness` },
    });
    document.head.appendChild(script);
  }, []);

  return (
    <main>
      {/* Hero - light theme */}
      <section className="relative pt-28 lg:pt-32 pb-10 lg:pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-studio.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 to-cream-50/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/40" />
        </div>
        <div className="container-x relative">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-6">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:text-gold">Home</a>
            {" / "}
            <span className="text-text-gray">Get a Free Consultation</span>
          </p>
          <div className="eyebrow no-line mb-6">
            <span className="w-8 h-px bg-gold inline-block" />
            <span className="text-gold">FREE · 30 MINUTES · NO COMMITMENT</span>
          </div>
          <h1 className="font-serif text-5xl lg:text-6xl leading-[1.05] max-w-3xl mb-6 text-heading">
            Get a Free <em className="text-gold not-italic font-medium">Design</em> Consultation
          </h1>
          <p className="text-base lg:text-lg text-text-gray leading-relaxed max-w-2xl">
            Book a free 30-minute consultation with a senior designer. Tell us about your space and we'll recommend the right service, scope, and budget — with no commitment.
          </p>
        </div>
      </section>

      <section className="section-white py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-serif text-2xl text-heading mb-6">What to expect</h3>
                <ul className="space-y-4">
                  {[
                    "30-minute call or in-person meeting at no cost",
                    "Senior designer (never a salesperson)",
                    "Initial ideas & quick budget guidance",
                    "Written follow-up within 48 hours",
                    "No commitment, no pressure",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-heading">
                      <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <IconCheck className="w-3 h-3 text-gold" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h4 className="font-serif text-lg text-heading mb-4">Direct Contact</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconMapPin className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-heading font-medium">Lahore HQ</div>
                      <div className="text-text-gray text-xs">{SITE.address.street}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconPhone className="w-4 h-4 text-gold" />
                    </div>
                    <a href={`tel:${SITE.phone}`} className="text-heading hover:text-gold">{SITE.phone}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconMail className="w-4 h-4 text-gold" />
                    </div>
                    <a href={`mailto:${SITE.email}`} className="text-heading hover:text-gold">{SITE.email}</a>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent("Hi! I'd like to book a free design consultation.")}`}
                target="_blank"
                rel="noopener"
                className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <IconWhatsapp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-serif text-lg text-heading">Chat on WhatsApp</div>
                  <div className="text-xs text-text-gray">Replies in under 30 minutes · 9-7 PKT</div>
                </div>
              </a>
            </div>

            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                className="card p-8 lg:p-12"
              >
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                      <IconCheck className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="font-serif text-3xl text-heading mb-3">Consultation Requested</h3>
                    <p className="text-text-gray mb-6">A senior designer will be in touch within 24 hours to confirm your consultation slot.</p>
                    <button onClick={() => onNavigate("home")} className="btn btn-outline">BACK TO HOME</button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-3xl text-heading mb-2">Tell us about your project</h3>
                    <p className="text-text-gray text-sm mb-8">The more you share, the better prepared we can be for our first conversation.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Full Name" placeholder="Jane Doe" required />
                      <Field label="Email" placeholder="jane@example.com" type="email" required />
                      <Field label="Phone" placeholder="+92 300 1234567" required />
                      <Field label="City" placeholder="Lahore" />
                    </div>
                    <div className="mt-4">
                      <SelectField
                        label="Service of Interest"
                        options={["Not sure yet", ...serviceList.map((s) => s.name)]}
                        defaultValue={service?.name}
                      />
                    </div>
                    <div className="mt-4">
                      <SelectField
                        label="Property Type"
                        options={["Apartment", "Bungalow / Villa", "Office", "Restaurant / Café", "Retail Store", "Other"]}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Field label="Approximate Area (sq ft)" placeholder="2,500" />
                      <SelectField label="Budget Range" options={["Under PKR 1M", "PKR 1-3M", "PKR 3-8M", "PKR 8-20M", "PKR 20M+"]} />
                    </div>
                    <div className="mt-4">
                      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-2">Tell us about your project</label>
                      <textarea
                        rows={5}
                        placeholder="What's the space, the timeline, and what you're hoping to achieve?"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                      />
                    </div>
                    <button type="submit" className="btn btn-gold mt-6 w-full">
                      REQUEST FREE CONSULTATION
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] text-text-gray text-center mt-4">
                      By submitting, you agree to be contacted by WP Interior. We never share your details.
                    </p>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, placeholder, type = "text", required }: { label: string; placeholder: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-2">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
      />
    </div>
  );
}

function SelectField({ label, options, defaultValue }: { label: string; options: string[]; defaultValue?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-2">{label}</label>
      <select
        defaultValue={defaultValue}
        className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
