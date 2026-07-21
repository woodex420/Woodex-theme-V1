import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconPlay,
  IconCheck,
  IconStar,
  IconQuote,
  IconAward,
  IconLeaf,
  IconHeart,
  IconUsers,
} from "./Icons";
import { portfolio, services, team, testimonials, processSteps, stats, blogPosts } from "../data/pages";
import { serviceList } from "../data/seo";
import { faqs10 as faqs } from "../data/faqs";
// (Page type moved to data/seo for SEO-aware routing)
import { FAQ } from "./FAQ";
import { EditableElement } from "./EditableElement";
import { cn } from "../utils/cn";

const heroSlides = [
  {
    eyebrow: "WHERE VISION MEETS DESIGN",
    heading: "Crafting Timeless <em>Interior</em> Spaces",
    description:
      "Transform your living spaces into timeless works of art where every detail tells a story of elegance and refined taste.",
    image: "/images/hero-main.jpg",
  },
  {
    eyebrow: "AWARD-WINNING STUDIO · EST. 2010",
    heading: "Where Every <em>Detail</em> Tells a Story",
    description:
      "From concept to final reveal — fifteen years of considered design for those who appreciate the difference.",
    image: "/images/hero-studio.jpg",
  },
  {
    eyebrow: "3D VISUALIZATION · VIRTUAL DESIGN",
    heading: "See It Before It's <em>Built</em>",
    description:
      "Our 3D Studio brings every project to life with photorealistic walkthroughs — no surprises, only delight.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80",
  },
];

const clients = [
  "MAISON LUMIÈRE",
  "ATELIER 9",
  "CASA VERDE",
  "THE ASTOR",
  "OAKRIDGE",
  "STUDIO CIEL",
];

export function HomePage({ onNavigate }: { onNavigate: (p: string, slug?: string) => void }) {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const current = heroSlides[slide];

  return (
    <main>
      {/* ============== HERO SLIDER ============== */}
      <section className="relative pt-24 lg:pt-28 pb-12 lg:pb-14 overflow-hidden">
        {/* Background image with sophisticated multi-layer gradient overlay */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-main.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cream-100/95 via-cream-100/85 to-cream-50/75" />
          <div className="absolute inset-0 bg-gradient-to-tr from-espresso/15 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-gold/5 via-transparent to-transparent" />
        </div>
        <div className="container-x relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center min-h-[360px]">
            <div className="space-y-7 animate-fade-up">
              <div className="eyebrow no-line text-gold">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>{current.eyebrow}</span>
              </div>
              <h1
                className="font-serif text-5xl lg:text-7xl leading-[1.05] text-heading"
                dangerouslySetInnerHTML={{
                  __html: current.heading.replace(
                    /<em>(.*?)<\/em>/,
                    '<em class="text-emphasis not-italic font-medium">$1</em>'
                  ),
                }}
              />
              <p className="text-base lg:text-lg text-text-gray leading-relaxed max-w-md">
                {current.description}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <button onClick={() => onNavigate("portfolio")} className="btn btn-gold">
                  VIEW OUR WORK
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="btn btn-outline">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">
                    <IconPlay className="w-2.5 h-2.5" />
                  </span>
                  WATCH SHOWREEL
                </button>
              </div>

              <div className="flex flex-wrap gap-10 pt-8 border-t border-gold/20 mt-4">
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <div className="font-serif text-3xl lg:text-4xl text-gold font-semibold">{s.number}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-text-gray mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-card overflow-hidden shadow-elevated">
                {heroSlides.map((s, i) => (
                  <img
                    key={i}
                    src={s.image}
                    alt="Award-winning interior design by WP Interior Studio in Pakistan"
                    className={cn(
                      "w-full h-[280px] lg:h-[360px] object-cover transition-opacity duration-1000 absolute inset-0",
                      i === slide ? "opacity-100" : "opacity-0"
                    )}
                  />
                ))}
                <div className="relative h-[280px] lg:h-[360px]" />
              </div>
              <div className="absolute top-6 right-6 bg-espresso text-white px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow-lg">
                <IconAward className="w-4 h-4 text-gold" />
                Award Winning
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-card shadow-elevated p-4 max-w-[200px] hidden lg:block">
                <div className="flex gap-1 text-gold mb-1">
                  {[...Array(5)].map((_, i) => (
                    <IconStar key={i} className="w-3.5 h-3.5" />
                  ))}
                </div>
                <p className="text-xs text-heading font-medium">4.9 from 200+ clients</p>
                <p className="text-[10px] text-text-gray mt-0.5">Featured in Architectural Digest</p>
              </div>
            </div>
          </div>

          {/* Slider dots */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === slide ? "w-10 bg-gold" : "w-1.5 bg-espresso/20"
                )}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============== CLIENT LOGOS ============== */}
      <section className="py-12 border-y border-border bg-white">
        <div className="container-x">
          <p className="text-center text-[10px] uppercase tracking-[0.3em] text-text-gray mb-8">
            Trusted by leading brands & private collectors
          </p>
          <div className="overflow-hidden">
            <div className="flex items-center gap-16 animate-marquee whitespace-nowrap">
              {[...clients, ...clients].map((c, i) => (
                <span
                  key={i}
                  className="text-sm lg:text-base font-serif text-text-light tracking-widest uppercase opacity-60"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== ABOUT INTRO ============== */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=900&q=80"
                alt="Interior design studio workspace with curated material samples"
                className="w-full h-[480px] object-cover rounded-card shadow-card"
              />
              <div className="absolute -bottom-8 -right-8 bg-espresso text-white p-6 rounded-card max-w-[200px] shadow-elevated hidden lg:block">
                <div className="font-serif text-4xl text-gold font-semibold">15+</div>
                <div className="text-xs uppercase tracking-widest mt-1 opacity-80">Years of practice</div>
              </div>
            </div>

            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>ABOUT THE STUDIO</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-heading mb-6 leading-[1.1]">
                Where Vision Meets <em className="text-emphasis font-medium">Craftsmanship</em>
              </h2>
              <p className="text-text-gray text-base leading-relaxed mb-6">
                For fifteen years, WP Interior has shaped spaces for discerning clients across eighteen countries. We
                believe a home should feel inevitable — every finish, every light, every quiet corner considered.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Bespoke design with no two projects alike",
                  "In-house 3D Studio for immersive walkthroughs",
                  "End-to-end project management & styling",
                  "Network of master craftspeople worldwide",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-heading">
                    <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <IconCheck className="w-3 h-3 text-gold" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => onNavigate("about")} className="btn btn-outline">
                DISCOVER THE STUDIO
                <IconArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== 3D STUDIO FEATURE BANNER ============== */}
      <section className="relative py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-3d.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/80 to-espresso/60" />
        </div>
        <div className="container-x relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 px-3 py-1.5 rounded-full mb-5">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">3D Studio · In-House</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-white leading-[1.05] mb-5">
                See your space <em className="text-gold not-italic font-medium">before</em> it's built
              </h2>
              <p className="text-cream-100/90 text-base leading-relaxed mb-7 max-w-xl">
                Our in-house 3D Studio produces photorealistic renders, fly-through animations and VR walkthroughs. Cut mid-construction changes by 70% and win client sign-off in days, not weeks.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => onNavigate("service", "3d-visualization-interior-design-pakistan")} className="btn btn-gold">
                  EXPLORE 3D STUDIO
                  <IconArrowRight className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onNavigate("studio")} className="btn btn-outline-light">
                  VIEW REEL
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { number: "800+", label: "Renders Produced" },
                { number: "70%", label: "Fewer Mid-Build Changes" },
                { number: "5-7", label: "Day Turnaround" },
                { number: "18", label: "Countries Served" },
              ].map((s) => (
                <div key={s.label} className="bg-espresso/40 backdrop-blur-sm border border-white/20 rounded-card p-5">
                  <div className="font-serif text-3xl lg:text-4xl text-gold font-semibold">{s.number}</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-cream-100/85 mt-2">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== SERVICES GRID ============== */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center mb-5 inline-flex">
              <span>OUR SERVICES</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading mb-5">
              Comprehensive <em className="text-emphasis font-medium">Design</em> Services
            </h2>
            <p className="text-text-gray leading-relaxed">
              From a single room to a complete estate, our integrated studio covers every layer of the design process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = SERVICE_ICONS[s.icon];
              return (
                <article
                  key={s.title}
                  className="card p-8 group cursor-pointer"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-14 h-14 rounded-full bg-cream-100 group-hover:bg-gold/20 flex items-center justify-center mb-6 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <h3 className="font-serif text-2xl text-heading mb-3">{s.title}</h3>
                  <p className="text-sm text-text-gray leading-relaxed mb-5">{s.description}</p>
                  <ul className="space-y-1.5 mb-6">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-text-gray">
                        <IconCheck className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onNavigate("services")}
                    className="text-xs uppercase tracking-widest text-gold font-semibold group-hover:gap-3 flex items-center gap-2 transition-all"
                  >
                    Learn More <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== STATS BAND ============== */}
      <section className="section-espresso py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="container-x relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-5xl lg:text-6xl text-gold font-semibold leading-none">{s.number}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-cream-100/70 mt-3">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PORTFOLIO ============== */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div>
              <div className="eyebrow no-line mb-4">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>SELECTED WORKS</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-heading max-w-2xl">
                A Portfolio of <em className="text-emphasis font-medium">Considered</em> Spaces
              </h2>
            </div>
            <button onClick={() => onNavigate("portfolio")} className="btn btn-outline">
              VIEW ALL PROJECTS
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.slice(0, 6).map((p) => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-card cursor-pointer"
                onClick={() => onNavigate("project", String(p.id))}
              >
                <img
                  src={p.image}
                  alt={`${p.title} – ${p.category} interior design project in ${p.location}`}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">
                    {p.category}
                  </span>
                  <h3 className="font-serif text-2xl text-white mt-2">{p.title}</h3>
                  <p className="text-cream-100/70 text-xs mt-2">{p.location} · {p.year}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PROCESS ============== */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5">
              <span>OUR PROCESS</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Four Steps to a <em className="text-emphasis font-medium">Finished</em> Home
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            {processSteps.map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-24 h-24 rounded-full bg-white shadow-card flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="font-serif text-3xl text-gold font-semibold">{step.step}</span>
                </div>
                <h3 className="font-serif text-2xl text-heading mb-3">{step.title}</h3>
                <p className="text-sm text-text-gray leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== LIVE BUILDER DEMO ============== */}
      <section className="section-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="container-x relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">No-Code Page Builder</span>
            </div>
            <EditableElement
              path="home.builder-demo.heading"
              contentText="Drag, drop, edit — no code required"
              asSection
              sectionLabel="LIVE EDIT"
            >
              <h2 className="font-serif text-4xl lg:text-5xl text-heading mb-5">
                Drag, drop, edit — <em className="text-gold not-italic font-medium">no code required</em>
              </h2>
            </EditableElement>
            <EditableElement
              path="home.builder-demo.description"
              contentText="Click the gold cube in the bottom-left corner to enter builder mode. Then click any element on the page to edit it inline, change colors, fonts, spacing, and more — all without writing a single line of code."
            >
              <p className="text-text-gray text-lg leading-relaxed max-w-2xl mx-auto">
                Click the gold cube in the bottom-left corner to enter builder mode. Then click any element on the page to edit it inline, change colors, fonts, spacing, and more — all without writing a single line of code.
              </p>
            </EditableElement>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "✏️", title: "Inline Editing", text: "Double-click any text to edit it directly. Changes save automatically to your browser." },
              { icon: "🎨", title: "Design System", text: "Change fonts, sizes, colors, padding, borders, and shadows from a clean side panel." },
              { icon: "🖼️", title: "Image Replacement", text: "Click any image to replace it with a new URL. Great for keeping your portfolio fresh." },
              { icon: "↕️", title: "Drag Sections", text: "Reorder entire sections by dragging. Hide what you don't need with one click." },
              { icon: "💾", title: "Auto-Save", text: "Every change saves instantly to localStorage. No save button to forget." },
              { icon: "📦", title: "Export Anywhere", text: "Export your design as JSON. Import on any device or browser to keep building." },
            ].map((f, i) => (
              <EditableElement
                key={i}
                path={`home.builder-demo.feature-${i}`}
                asSection
                sectionLabel={`Feature ${i + 1}`}
              >
                <article className="card p-6 h-full">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <EditableElement path={`home.builder-demo.feature-${i}.title`} contentText={f.title}>
                    <h3 className="font-serif text-xl text-heading mb-2">{f.title}</h3>
                  </EditableElement>
                  <EditableElement path={`home.builder-demo.feature-${i}.text`} contentText={f.text}>
                    <p className="text-sm text-text-gray leading-relaxed">{f.text}</p>
                  </EditableElement>
                </article>
              </EditableElement>
            ))}
          </div>

          <div className="mt-10 text-center">
            <EditableElement
              path="home.builder-demo.cta"
              contentText="Click the gold cube below-left to start editing this very page."
            >
              <p className="text-sm text-text-gray">
                <span className="font-semibold text-heading">Try it now:</span> Click the gold cube below-left to start editing this very page.
              </p>
            </EditableElement>
          </div>
        </div>
      </section>

      {/* ============== 3D WALKTHROUGH SHOWCASE ============== */}
      <WalkthroughShowcase onNavigate={onNavigate} />

      {/* ============== TESTIMONIALS ============== */}
      <TestimonialSlider />

      {/* ============== TEAM ============== */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5">
              <span>THE TEAM</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Designers, Makers, <em className="text-emphasis font-medium">Dreamers</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <article key={m.name} className="group">
                <div className="relative overflow-hidden rounded-card mb-4 aspect-[3/4]">
                  <img
                    src={m.image}
                    alt={`${m.name}, ${m.role} at WP Interior`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="font-serif text-xl text-heading">{m.name}</h3>
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mt-1 mb-2">{m.role}</p>
                <p className="text-sm text-text-gray leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <FAQ
        items={faqs}
        title="Everything you"
        italic="need to know"
        bg="cream"
        onContactClick={() => onNavigate("contact")}
      />

      {/* ============== BLOG ============== */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div>
              <div className="eyebrow no-line mb-4">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>FROM THE JOURNAL</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-heading max-w-xl">
                Notes on <em className="text-emphasis font-medium">Design</em>
              </h2>
            </div>
            <button onClick={() => onNavigate("blog")} className="btn btn-outline">
              ALL ARTICLES
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <article key={post.id} className="group cursor-pointer" onClick={() => onNavigate("blog")}>
                <div className="overflow-hidden rounded-card mb-4 aspect-[4/3]">
                  <img
                    src={post.image}
                    alt={`Cover image for the article: ${post.title}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest mb-3">
                  <span className="text-gold font-semibold">{post.category}</span>
                  <span className="w-1 h-1 rounded-full bg-text-gray/40" />
                  <span className="text-text-gray">{post.date}</span>
                </div>
                <h3 className="font-serif text-2xl text-heading mb-3 group-hover:text-gold transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-text-gray leading-relaxed">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA BANNER ============== */}
      <section className="section-espresso py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600&q=60"
            alt="Decorative background image of an interior design project"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container-x relative text-center max-w-3xl">
          <div className="eyebrow no-line justify-center inline-flex mb-6 text-gold">
            <span>LET'S CREATE TOGETHER</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-6xl text-white mb-6 leading-[1.1]">
            Have a Space in <em className="text-gold not-italic font-medium">Mind?</em>
          </h2>
          <p className="text-cream-100/70 text-lg leading-relaxed mb-10">
            Tell us about your project. We'll schedule a private consultation to explore the possibilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate("contact")} className="btn btn-gold">
              START A PROJECT
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <a href="tel:+12125550199" className="btn btn-outline-light">
              CALL THE STUDIO
            </a>
          </div>
        </div>
      </section>

      {/* ============== VALUES STRIP ============== */}
      <section className="section-cream py-16">
        <div className="container-x">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: IconLeaf, title: "Considered Material", text: "Responsibly sourced, built to last generations." },
              { icon: IconHeart, title: "Crafted With Care", text: "Every detail shaped by master makers." },
              { icon: IconUsers, title: "People First", text: "Spaces designed around how you actually live." },
            ].map((v) => (
              <div key={v.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <v.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-heading mb-1">{v.title}</h4>
                  <p className="text-sm text-text-gray leading-relaxed">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// ============== SHARED SECTIONS ==============

import { IconResidential, IconCommercial, IconFurniture, IconLighting, IconColor, IconSpace } from "./Icons";

const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  residential: IconResidential,
  commercial: IconCommercial,
  furniture: IconFurniture,
  lighting: IconLighting,
  color: IconColor,
  space: IconSpace,
};

function TestimonialSlider() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 7000);
    return () => clearInterval(t);
  }, []);
  const t = testimonials[idx];
  return (
    <section className="section-cream py-20 lg:py-28">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="eyebrow no-line justify-center inline-flex mb-5">
            <span>CLIENT STORIES</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-heading">
            What Our <em className="text-emphasis font-medium">Clients</em> Say
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="card p-10 lg:p-14 text-center">
            <IconQuote className="w-12 h-12 text-gold mx-auto mb-2 opacity-50" />
            <p className="font-serif text-2xl lg:text-3xl text-heading italic leading-relaxed my-4">
              "{t.quote}"
            </p>
            <div className="flex justify-center gap-1 my-6">
              {[...Array(t.rating)].map((_, i) => (
                <IconStar key={i} className="w-4 h-4 text-gold" />
              ))}
            </div>
            <div className="pt-6 border-t border-gold/20">
              <div className="font-serif text-lg text-heading">{t.name}</div>
              <div className="text-xs uppercase tracking-widest text-text-gray mt-1">{t.role}</div>
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === idx ? "w-10 bg-gold" : "w-1.5 bg-espresso/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WalkthroughShowcase({ onNavigate }: { onNavigate: (p: string, slug?: string) => void }) {
  const [active, setActive] = useState(0);
  const walkthroughs = serviceList
    .filter((s) => s.videoWalkthrough)
    .slice(0, 4);
  const current = walkthroughs[active];

  return (
    <section className="section-espresso py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img src="/images/hero-3d.jpg" alt="" className="w-full h-full object-cover" />
      </div>
      <div className="container-x relative">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 px-3 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">3D Walkthroughs</span>
          </div>
          <h2 className="font-serif text-4xl lg:text-5xl text-white">
            Experience our projects in <em className="text-gold not-italic font-medium">3D</em>
          </h2>
          <p className="text-cream-100/70 mt-4">
            Walk through real, delivered projects from our portfolio. Produced by our in-house 3D Studio using Corona, V-Ray & Unreal Engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
          {/* Main player */}
          <div className="lg:col-span-8">
            <div className="relative aspect-video rounded-card overflow-hidden shadow-elevated bg-black">
              {current ? (
                <img
                  src={current.videoWalkthrough?.poster || current.gallery[0]}
                  alt={`${current.name} 3D walkthrough by WP Interior`}
                  className="w-full h-full object-cover"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-espresso/20" />
              <button
                onClick={() => current && onNavigate("service", current.slug)}
                className="absolute inset-0 flex flex-col items-center justify-center text-white group"
              >
                <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-3">
                  <IconPlay className="w-7 h-7 text-espresso ml-1" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-2">3D Studio · Walkthrough</p>
                <h3 className="font-serif text-xl lg:text-2xl text-white px-6 text-center max-w-2xl">
                  {current?.videoWalkthrough?.title || current?.name}
                </h3>
              </button>
            </div>
          </div>

          {/* Playlist */}
          <div className="lg:col-span-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-3">Featured Walkthroughs</p>
            {walkthroughs.map((w, i) => (
              <button
                key={w.slug}
                onClick={() => setActive(i)}
                className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${
                  i === active
                    ? "bg-gold/15 border border-gold/30"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                  <img src={w.videoWalkthrough?.poster || w.gallery[0]} alt={w.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-espresso/40 flex items-center justify-center">
                    <IconPlay className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] uppercase tracking-widest font-semibold mb-0.5 ${i === active ? "text-gold" : "text-cream-100/50"}`}>
                    {w.category}
                  </div>
                  <div className="font-serif text-sm text-white line-clamp-1">{w.name}</div>
                  <div className="text-[10px] text-cream-100/50 mt-0.5">{w.videoWalkthrough?.duration}</div>
                </div>
              </button>
            ))}
            <button
              onClick={() => onNavigate("studio")}
              className="w-full mt-3 btn btn-gold !py-2.5 !text-[10px]"
            >
              VIEW ALL 3D WALKTHROUGHS
              <IconArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}



