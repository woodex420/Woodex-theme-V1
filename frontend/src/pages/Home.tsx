import { Link } from 'react-router';
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-react';
import EditableElement from '@/components/builder/EditableElement';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import CTASection from '@/components/CTASection';
import { SERVICES } from '@/data/services';
import { PROJECTS } from '@/data/projects';
import { ARTICLES } from '@/data/articles';
import { PROCESS_STEPS, WHY_WOODEX, HOME_FAQS } from '@/data/site';
import ServiceIcon from '@/components/ServiceIcon';
import { useApiData } from '@/lib/useApiData';
import { useState } from 'react';

const HOME_SERVICES = [
  'interior-design-lahore',
  'residential-interior-design-lahore',
  'office-interior-design-lahore',
  'retail-shop-interior-design-lahore',
  '3d-interior-design-space-planning-lahore',
  'custom-furniture-lahore',
];

const VALUE_PILLARS = [
  { num: '12', label: 'Interior & Furniture Services' },
  { num: '06', label: 'Step Design Process' },
  { num: '01', label: 'Coordinated Project Team' },
  { num: '100%', label: 'Custom-Made Furniture' },
];

const MARQUEE_ITEMS = [
  'Residential Interiors', 'Office Design', 'Retail Spaces', 'Custom Furniture',
  'Space Planning', '3D Visualization', 'Commercial Interiors', 'Woodwork',
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { data: apiServices } = useApiData('/services', SERVICES);
  const { data: apiProjects } = useApiData('/projects', PROJECTS);
  const { data: apiArticles } = useApiData('/articles', ARTICLES);
  const services = apiServices;
  const featured = apiProjects.filter((p) => p.featured);
  const homeServices = services.filter((s) => HOME_SERVICES.includes(s.slug));

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <EditableElement path="home.section.hero" asSection sectionLabel="Hero">
      <section className="relative min-h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero.jpg" alt="Luxury interior designed by Woodex Interior" className="w-full h-full object-cover img-lux" fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: 'var(--grad-hero)' }} />
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.65) 100%)' }} />
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-28 pt-44">
          <Reveal>
            <EditableElement path="home.hero.eyebrow" contentText="Interior Design Company in Lahore">
              <span className="eyebrow">Interior Design Company in Lahore</span>
            </EditableElement>
          </Reveal>
          <Reveal delay={1}>
            <EditableElement path="home.hero.heading">
              <h1 className="font-display font-light italic text-white text-[clamp(2.6rem,7vw,6.2rem)] leading-[1.04] mt-7 max-w-5xl">
                For Homes, Offices &amp; <span className="not-italic font-semibold text-gold-grad">Retail Spaces</span>
              </h1>
            </EditableElement>
          </Reveal>
          <Reveal delay={2}>
            <EditableElement path="home.hero.description" contentText="Woodex Interior creates thoughtfully planned spaces that look distinctive, function efficiently and support the people who use them — design and practical planning together under one coordinated service.">
              <p className="text-[#D4C5A9] font-light text-base md:text-lg leading-relaxed mt-7 max-w-2xl">
                Woodex Interior creates thoughtfully planned spaces that look distinctive, function efficiently and support the people who use them — design and practical planning together under one coordinated service.
              </p>
            </EditableElement>
          </Reveal>
          <Reveal delay={3}>
            <div className="flex flex-wrap items-center gap-5 mt-10">
              <Link to="/contact" className="btn-lux btn-gold">
                Discuss Your Project <ArrowRight size={15} />
              </Link>
              <Link to="/projects" className="btn-lux btn-outline">View Our Projects</Link>
            </div>
          </Reveal>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2">
          <span className="text-[0.58rem] tracking-[0.35em] uppercase text-[#C9A84C]">Scroll</span>
          <div className="w-px h-10 animate-scroll-line" style={{ background: 'var(--grad-gold-v)' }} />
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ VALUE PILLARS ═══════════ */}
      <EditableElement path="home.section.pillars" asSection sectionLabel="Value Pillars">
      <section className="bg-[#111110] border-y border-[rgba(201,168,76,0.25)]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-4">
          {VALUE_PILLARS.map((s, i) => (
            <Reveal key={s.label} delay={(i % 4) as 0 | 1 | 2 | 3} className={`px-8 py-10 text-center ${i < 3 ? 'lg:border-r' : ''} border-[rgba(201,168,76,0.2)] ${i % 2 === 0 ? 'border-r lg:border-r' : ''}`}>
              <div className="stat-num text-[clamp(2.4rem,5vw,4.2rem)]"><EditableElement path={"home.pillars." + i + ".num"} contentText={s.num}>{s.num}</EditableElement></div>
              <div className="text-[0.62rem] tracking-[0.28em] uppercase text-[#8A8073] mt-3"><EditableElement path={"home.pillars." + i + ".label"} contentText={s.label}>{s.label}</EditableElement></div>
            </Reveal>
          ))}
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ INTRO / EDITORIAL ═══════════ */}
      <EditableElement path="home.section.intro" asSection sectionLabel="Introduction">
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <span className="bg-watermark top-10 -left-10">Woodex</span>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal variant="left">
            <div className="ornament-corners p-4">
              <div className="oc-inner relative overflow-hidden">
                <img src="/images/about.jpg" alt="Woodex design studio — materials and planning" className="w-full h-[420px] lg:h-[520px] object-cover img-lux" loading="lazy" />
                <div className="absolute inset-0 border border-[rgba(201,168,76,0.25)]" />
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeading
              pageKey="home" sectionKey="intro"
              eyebrow="Interior Design Built Around Your Space"
              title={<>Design &amp; Function, <strong>Working Together</strong></>}
            />
            <Reveal delay={2}>
              <EditableElement path="home.intro.text1" contentText="A successful interior should do more than look attractive. It should improve movement, comfort, storage, productivity and the overall experience of the space.">
                <p className="text-[#D4C5A9] font-light leading-relaxed mt-2 mb-5">
                  A successful interior should do more than look attractive. It should improve movement, comfort, storage, productivity and the overall experience of the space.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={3}>
              <EditableElement path="home.intro.text2" contentText="Woodex Interior works with homeowners and businesses in Lahore to develop interior solutions based on their requirements, available area, preferred style and budget. Every project begins with understanding how the space will be used — before decisions are made about layouts, finishes, furniture, lighting and décor.">
                <p className="text-[#8A8073] font-light leading-relaxed mb-8">
                  Woodex Interior works with homeowners and businesses in Lahore to develop interior solutions based on their requirements, available area, preferred style and budget. Every project begins with understanding how the space will be used — before decisions are made about layouts, finishes, furniture, lighting and décor.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={4}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
                {WHY_WOODEX.slice(0, 4).map((w) => (
                  <div key={w} className="flex items-start gap-3">
                    <Check size={15} className="text-[#C9A84C] mt-1 shrink-0" />
                    <span className="text-sm font-light text-[#D4C5A9] leading-snug">{w}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={5}>
              <Link to="/about" className="btn-link-gold">About Woodex Interior <ArrowRight size={14} /></Link>
            </Reveal>
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ MARQUEE ═══════════ */}
      <div className="border-y border-[rgba(201,168,76,0.2)] bg-[#0d0d0c] py-5 overflow-hidden marquee-mask">
        <div className="flex w-max animate-marquee gap-0">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="flex items-center gap-8 px-8 text-[0.7rem] tracking-[0.3em] uppercase text-[#8A8073] whitespace-nowrap">
              <EditableElement path={"home.marquee." + i} contentText={item}>{item}</EditableElement> <span className="text-[#C9A84C]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════ SERVICES ═══════════ */}
      <EditableElement path="home.section.services" asSection sectionLabel="Services">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <SectionHeading
              pageKey="home" sectionKey="services"
              eyebrow="What We Do"
              title={<>Our Interior Design <strong>Services in Lahore</strong></>}
              subtitle="From residential interiors and modern workplaces to retail stores, commercial spaces and custom furniture."
            />
            <Reveal delay={2}>
              <Link to="/services" className="btn-lux btn-ghost text-[0.65rem]">All 12 Services <ArrowRight size={13} /></Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {HOME_SERVICES.map((slug, i) => {
              const s = services.find((x) => x.slug === slug);
              if (!s) return null;
              return (
                <Reveal key={slug} delay={(i % 3) as 0 | 1 | 2}>
                  <Link to={`/services/${s.slug}`} className="card-lux card-service group block p-8 lg:p-10 h-full">
                    <div className="text-[#C9A84C] mb-7 group-hover:scale-110 transition-transform duration-500">
                      <ServiceIcon name={s.icon} />
                    </div>
                    <h3 className="font-display text-2xl lg:text-[1.7rem] text-white leading-snug mb-4"><EditableElement path={"home.services." + slug + ".title"} contentText={s.title}>{s.title}</EditableElement></h3>
                    <p className="text-sm font-light text-[#8A8073] leading-relaxed mb-7"><EditableElement path={"home.services." + slug + ".excerpt"} contentText={s.excerpt}>{s.excerpt}</EditableElement></p>
                    <span className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-[#C9A84C] group-hover:gap-3.5 transition-all duration-300">
                      Explore <ArrowRight size={13} />
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ FEATURED PROJECTS ═══════════ */}
      <EditableElement path="home.section.projects" asSection sectionLabel="Featured Projects">
      <section className="py-24 lg:py-32 bg-[#111110] border-y border-[rgba(201,168,76,0.15)] relative overflow-hidden">
        <span className="bg-watermark -top-6 right-0">Portfolio</span>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <SectionHeading
              pageKey="home" sectionKey="projects"
              eyebrow="Selected Work"
              title={<>Interior Design <strong>Projects</strong></>}
              subtitle="Explore selected residential, office, retail and commercial projects — layout planning, material selection, custom furniture and visual detailing."
            />
            <Reveal delay={2}>
              <Link to="/projects" className="btn-lux btn-ghost text-[0.65rem]">View Portfolio <ArrowRight size={13} /></Link>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) as 0 | 1 | 2 | 3}>
                <Link to={`/projects/${p.slug}`} className="group block relative overflow-hidden aspect-[3/4] card-lux">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'var(--grad-card)' }} />
                  <div className="absolute top-4 left-4">
                    <span className="text-[0.58rem] tracking-[0.25em] uppercase text-[#0A0A0A] font-semibold px-3 py-1.5" style={{ background: 'var(--grad-gold-h)' }}>
                      <EditableElement path={"home.projects." + p.slug + ".category"} contentText={p.category}>{p.category}</EditableElement>
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-2"><EditableElement path={"home.projects." + p.slug + ".location"} contentText={p.location}>{p.location}</EditableElement></div>
                    <h3 className="font-display text-xl text-white leading-snug mb-3"><EditableElement path={"home.projects." + p.slug + ".title"} contentText={p.title}>{p.title}</EditableElement></h3>
                    <span className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.2em] uppercase text-[#D4C5A9] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      Case Study <ArrowUpRight size={13} className="text-[#C9A84C]" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ CUSTOM FURNITURE STRIP ═══════════ */}
      <EditableElement path="home.section.furniture" asSection sectionLabel="Custom Furniture">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <SectionHeading
              pageKey="home" sectionKey="furniture"
              eyebrow="Woodex Furniture Division"
              title={<>Custom Furniture, <strong>Designed for Your Interior</strong></>}
            />
            <Reveal delay={2}>
              <EditableElement path="home.furniture.text1" contentText="Furniture has a major influence on how a space looks and functions. Standard furniture may not provide the correct dimensions, storage capacity or design consistency.">
                <p className="text-[#D4C5A9] font-light leading-relaxed mt-2 mb-5">
                  Furniture has a major influence on how a space looks and functions. Standard furniture may not provide the correct dimensions, storage capacity or design consistency.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={3}>
              <EditableElement path="home.furniture.text2" contentText="Woodex develops customized furniture for residential and commercial environments — office tables, workstations, storage units, reception counters, shelving, wardrobes, cabinets, beds and display units — designed alongside the interior for better proportions and stronger visual consistency.">
                <p className="text-[#8A8073] font-light leading-relaxed mb-8">
                  Woodex develops customized furniture for residential and commercial environments — office tables, workstations, storage units, reception counters, shelving, wardrobes, cabinets, beds and display units — designed alongside the interior for better proportions and stronger visual consistency.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={4}>
              <div className="flex flex-wrap gap-4">
                <Link to="/services/custom-furniture-lahore" className="btn-lux btn-gold text-[0.68rem]">Explore Custom Furniture</Link>
                <Link to="/services/office-furniture-lahore" className="btn-lux btn-outline text-[0.68rem]">Office Furniture</Link>
              </div>
            </Reveal>
          </div>
          <Reveal variant="right" className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-full h-full border border-[rgba(201,168,76,0.35)]" />
              <img src="/images/project-workshop.jpg" alt="Custom furniture manufacturing at Woodex workshop" className="relative w-full h-[400px] lg:h-[500px] object-cover img-lux" loading="lazy" />
              <div className="absolute -bottom-6 -right-4 lg:-right-6 bg-[#161613] border border-[rgba(201,168,76,0.4)] px-7 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <div className="font-display italic text-lg text-[#C9A84C]">Designed &amp; manufactured</div>
                <div className="text-[0.6rem] tracking-[0.25em] uppercase text-[#8A8073] mt-1">in one coordinated process</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ PROCESS ═══════════ */}
      <EditableElement path="home.section.process" asSection sectionLabel="Process">
      <section className="py-24 lg:py-32 bg-[#111110] border-y border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <SectionHeading
            pageKey="home" sectionKey="process"
            align="center"
            eyebrow="How We Work"
            title={<>Our Interior Design <strong>Process</strong></>}
            subtitle="Every project follows a clear, coordinated sequence — from first conversation to final review."
            className="mb-16"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={(i % 6) as 0 | 1 | 2 | 3 | 4 | 5}>
                <div className="process-step relative text-center px-4">
                  <div className="w-[4.2rem] h-[4.2rem] mx-auto border border-[rgba(201,168,76,0.5)] rotate-45 flex items-center justify-center mb-6 bg-[#0A0A0A]">
                    <span className="font-display text-xl text-[#C9A84C] -rotate-45">{step.n}</span>
                  </div>
                  <h3 className="font-display text-lg text-white mb-2.5"><EditableElement path={"home.process." + step.n + ".title"} contentText={step.title}>{step.title}</EditableElement></h3>
                  <p className="text-[0.72rem] font-light text-[#8A8073] leading-relaxed"><EditableElement path={"home.process." + step.n + ".desc"} contentText={step.desc}>{step.desc}</EditableElement></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ WHY WOODEX ═══════════ */}
      <EditableElement path="home.section.why" asSection sectionLabel="Why Woodex">
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <span className="bg-watermark bottom-0 -left-8">Why Us</span>
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeading
            pageKey="home" sectionKey="why"
            align="center"
            eyebrow="The Woodex Difference"
            title={<>Why Work With <strong>Woodex Interior?</strong></>}
            className="mb-14"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_WOODEX.map((w, i) => (
              <Reveal key={w} delay={(i % 3) as 0 | 1 | 2}>
                <div className="card-lux card-service p-7 flex items-start gap-4 h-full">
                  <span className="font-display text-2xl text-gold-grad font-semibold shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-sm font-light text-[#D4C5A9] leading-relaxed"><EditableElement path={"home.why." + i} contentText={w}>{w}</EditableElement></p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ FAQ ═══════════ */}
      <EditableElement path="home.section.faq" asSection sectionLabel="FAQ">
      <section className="py-24 lg:py-32 bg-[#111110] border-y border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[880px] mx-auto px-6 lg:px-12">
          <SectionHeading
            pageKey="home" sectionKey="faq"
            align="center"
            eyebrow="Common Questions"
            title={<>Frequently Asked <strong>Questions</strong></>}
            className="mb-12"
          />
          <div>
            {HOME_FAQS.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i, 3) as 0 | 1 | 2 | 3}>
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-display text-lg md:text-xl text-white"><EditableElement path={"home.faq." + i + ".q"} contentText={f.q}>{f.q}</EditableElement></span>
                    <ChevronDown size={18} className="faq-icon text-[#C9A84C] shrink-0 rotate-[-90deg] [.open_&]:rotate-0" style={{ transform: openFaq === i ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                  </button>
                  <div className="faq-answer">
                    <div>
                      <p className="text-sm font-light text-[#8A8073] leading-relaxed pb-7 pr-10"><EditableElement path={"home.faq." + i + ".a"} contentText={f.a}>{f.a}</EditableElement></p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ INSIGHTS PREVIEW ═══════════ */}
      <EditableElement path="home.section.insights" asSection sectionLabel="Insights">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
            <SectionHeading
              pageKey="home" sectionKey="insights"
              eyebrow="Insights"
              title={<>Planning Guides <strong>&amp; Ideas</strong></>}
              subtitle="Practical guides on interior costs, office planning, retail design and custom furniture in Lahore."
            />
            <Reveal delay={2}>
              <Link to="/insights" className="btn-lux btn-ghost text-[0.65rem]">All Insights <ArrowRight size={13} /></Link>
            </Reveal>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apiArticles.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/insights/${a.slug}`} className="card-lux group block h-full">
                  <div className="overflow-hidden aspect-video">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" />
                  </div>
                  <div className="p-7">
                    <div className="text-[0.6rem] tracking-[0.25em] uppercase text-[#C9A84C] mb-3"><EditableElement path={"home.insights." + a.slug + ".category"} contentText={a.category}>{a.category}</EditableElement></div>
                    <h3 className="font-display text-[1.35rem] text-white leading-snug mb-4 group-hover:text-[#E2C97E] transition-colors"><EditableElement path={"home.insights." + a.slug + ".title"} contentText={a.title}>{a.title}</EditableElement></h3>
                    <p className="text-sm font-light text-[#8A8073] leading-relaxed line-clamp-2">{a.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      {/* ═══════════ CTA ═══════════ */}
      <CTASection />
    </>
  );
}
