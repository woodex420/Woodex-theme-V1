import { useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconLeaf,
  IconUsers,
  IconHeart,
  IconMapPin,
  IconPhone,
  IconMail,
  IconClock,
  IconResidential,
  IconCommercial,
  IconFurniture,
  IconLighting,
  IconColor,
  IconSpace,
  IconCube,
  IconLayers,
  IconBox,
  IconShield,
  IconPlay,
} from "./Icons";
import { FAQ } from "./FAQ";
import { portfolio, services, team, processSteps, stats } from "../data/pages";
import { blogPosts as seoBlogPosts } from "../data/seo";
import { faqs10 as faqs } from "../data/faqs";
// (Page type moved to data/seo for SEO-aware routing)
import { cn } from "../utils/cn";

/* ============================================================
   PAGE HERO
   ============================================================ */
export function PageHero({
  eyebrow,
  title,
  italic,
  description,
  breadcrumb,
  background,
  height = "default",
  theme = "dark",
}: {
  eyebrow: string;
  title: string;
  italic?: string;
  description: string;
  breadcrumb: string;
  background?: string;
  height?: "default" | "tall";
  theme?: "light" | "dark";
}) {
  const isDark = theme === "dark" && background;
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        height === "tall" ? "pt-28 lg:pt-32 pb-12 lg:pb-16" : "pt-28 lg:pt-32 pb-10 lg:pb-14"
      )}
    >
      {background ? (
        <div className="absolute inset-0">
          <img src={background} alt="" className="w-full h-full object-cover" />
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/85 to-espresso/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/20 to-espresso/40" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 to-cream-50/70" />
              <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/40" />
            </>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 bg-cream-100" />
      )}
      <div className="container-x relative">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-6 font-semibold">{breadcrumb}</p>
        <div className="eyebrow no-line mb-6">
          <span className="w-8 h-px bg-gold inline-block" />
          <span className="text-gold">{eyebrow}</span>
        </div>
        <h1
          className={cn(
            "font-serif text-5xl lg:text-6xl leading-[1.05] max-w-3xl",
            isDark ? "text-white" : "text-heading"
          )}
        >
          {title}
          {italic && (
            <>
              {" "}
              <em className="text-gold not-italic font-medium">{italic}</em>
            </>
          )}
        </h1>
        <p
          className={cn(
            "text-base lg:text-lg leading-relaxed max-w-2xl mt-6",
            isDark ? "text-cream-100/90" : "text-text-gray"
          )}
        >
          {description}
        </p>
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT PAGE
   ============================================================ */
export function AboutPage({ onNavigate }: { onNavigate: (p: string, s?: string) => void }) {
  const milestones = [
    { year: "2010", title: "Studio Founded", text: "Elena Marchetti opens a four-person studio in SoHo, New York." },
    { year: "2014", title: "First International Commission", text: "Parisian townhouse project establishes our European practice." },
    { year: "2018", title: "3D Studio Launched", text: "In-house visualization team introduced to elevate the design process." },
    { year: "2021", title: "AD100 Recognition", text: "Named to Architectural Digest's AD100 list of leading designers." },
    { year: "2024", title: "Hospitality Division", text: "Dedicated hospitality studio opens in Vienna." },
  ];

  return (
    <main>
      <PageHero
        eyebrow="OUR STORY"
        title="Where Vision"
        italic="Meets Craftsmanship"
        description="For fifteen years we have been designing interiors that feel inevitable — spaces where every detail has been considered and nothing is left to chance."
        breadcrumb="Home / About"
        background="/images/hero-studio.jpg"
        theme="light"
      />

      {/* Story */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>FOUNDED IN NEW YORK · 2010</span>
              </div>
              <h2 className="font-serif text-4xl lg:text-5xl text-heading mb-6">
                A Studio Built on <em className="text-emphasis font-medium">Considered</em> Choices
              </h2>
              <div className="space-y-4 text-text-gray leading-relaxed">
                <p>
                  What began as a small residential practice in 2010 has grown into an internationally recognised studio with a permanent presence in three cities. Yet our approach has never changed: every project is led personally by a senior designer, every detail is considered, and every commission is treated as if it were our own home.
                </p>
                <p>
                  We work in the space between architecture and emotion — drawing from art, travel, and the everyday rituals of living to shape rooms that feel timeless. Our team includes architects, interior designers, master joiners, lighting designers, and a dedicated 3D visualization studio.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80" className="w-full h-72 object-cover rounded-card" alt="" />
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80" className="w-full h-72 object-cover rounded-card mt-12" alt="" />
              <img src="https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=600&q=80" className="w-full h-72 object-cover rounded-card -mt-4" alt="" />
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80" className="w-full h-72 object-cover rounded-card mt-8" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5">
              <span>MISSION & VALUES</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              What Guides Our <em className="text-emphasis font-medium">Work</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: IconLeaf, title: "Considered Craft", text: "We design slowly, on purpose. Every decision — from material to millimetre — earns its place." },
              { icon: IconHeart, title: "Honest Materials", text: "We work with materials that age beautifully: stone, oak, brass, linen, leather. Nothing is synthetic for the sake of trend." },
              { icon: IconUsers, title: "Human Scale", text: "We design for how people actually live. Comfort, ritual, and quiet moments guide every choice." },
            ].map((v) => (
              <div key={v.title} className="card p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-cream-100 flex items-center justify-center mx-auto mb-6">
                  <v.icon className="w-7 h-7 text-gold" />
                </div>
                <h3 className="font-serif text-2xl text-heading mb-3">{v.title}</h3>
                <p className="text-sm text-text-gray leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5">
              <span>THE PEOPLE</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              The Hands Behind the <em className="text-emphasis font-medium">Work</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <article key={m.name} className="group">
                <div className="relative overflow-hidden rounded-card mb-4 aspect-[3/4]">
                  <img src={m.image} alt={m.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="font-serif text-xl text-heading">{m.name}</h3>
                <p className="text-xs uppercase tracking-widest text-gold font-semibold mt-1 mb-2">{m.role}</p>
                <p className="text-sm text-text-gray leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5">
              <span>MILESTONES</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Fifteen Years of <em className="text-emphasis font-medium">Practice</em>
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-8 items-start group">
                <div className="font-serif text-5xl text-gold font-semibold w-32 flex-shrink-0">{m.year}</div>
                <div className="flex-1 pt-2 border-t border-gold/20">
                  <h3 className="font-serif text-2xl text-heading mb-2">{m.title}</h3>
                  <p className="text-text-gray leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-espresso py-20">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-5xl text-gold font-semibold">{s.number}</div>
                <div className="text-xs uppercase tracking-widest text-cream-100/70 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-cream py-20">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-serif text-4xl lg:text-5xl text-heading mb-6">
            Come Work <em className="text-emphasis font-medium">With Us</em>
          </h2>
          <p className="text-text-gray mb-8">We're always looking for exceptional designers, makers, and dreamers to join the studio.</p>
          <button onClick={() => onNavigate("contact")} className="btn btn-gold">
            GET IN TOUCH
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   SERVICES PAGE
   ============================================================ */
const SERVICE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  residential: IconResidential,
  commercial: IconCommercial,
  furniture: IconFurniture,
  lighting: IconLighting,
  color: IconColor,
  space: IconSpace,
};

export function ServicesPage({ onNavigate }: { onNavigate: (p: string, s?: string) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="WHAT WE DO"
        title="Comprehensive"
        italic="Design Services"
        description="From a single room refresh to a complete estate, our integrated studio covers every layer of the design process under one roof. 10 specialist services, one senior-led studio."
        breadcrumb="Home / Services"
        background="/images/services/office.jpg"
        theme="light"
      />

      {/* Services list */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          {services.map((s, i) => {
            const Icon = SERVICE_ICONS[s.icon];
            const reverse = i % 2 === 1;
            return (
              <div
                key={s.title}
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-16 border-b border-border last:border-0",
                  reverse && "lg:[&>div:first-child]:order-2"
                )}
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-gold" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
                      SERVICE 0{i + 1}
                    </span>
                  </div>
                  <h2 className="font-serif text-4xl text-heading">
                    {s.title.split(" ")[0]} <em className="text-emphasis font-medium">{s.title.split(" ").slice(1).join(" ")}</em>
                  </h2>
                  <p className="text-text-gray leading-relaxed">{s.description}</p>
                  <ul className="grid grid-cols-2 gap-3">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-heading">
                        <IconCheck className="w-4 h-4 text-gold" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => onNavigate("contact")} className="btn btn-outline mt-2">
                    ENQUIRE NOW
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="relative">
                  <img
                    src={[
                      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
                      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
                      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=80",
                      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=900&q=80",
                      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=900&q=80",
                      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
                    ][i]}
                    className="w-full h-96 lg:h-[480px] object-cover rounded-card shadow-card"
                    alt=""
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Process */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>HOW WE WORK</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Our <em className="text-emphasis font-medium">Process</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.step} className="card p-8">
                <div className="font-serif text-5xl text-gold font-semibold mb-4">{step.step}</div>
                <h3 className="font-serif text-xl text-heading mb-3">{step.title}</h3>
                <p className="text-sm text-text-gray leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQBlock />
    </main>
  );
}

/* ============================================================
   3D STUDIO PAGE
   ============================================================ */
export function StudioPage({ onNavigate }: { onNavigate: (p: string, s?: string) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="3D STUDIO"
        title="See Your Space"
        italic="Before It's Built"
        description="Our in-house 3D Studio creates photorealistic walkthroughs that let you experience your project before construction begins — and refine it without compromise."
        breadcrumb="Home / 3D Studio"
        background="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&q=80"
        theme="light"
      />

      {/* Intro */}
      <section className="section-white py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80"
              className="w-full h-[480px] object-cover rounded-card shadow-card"
              alt=""
            />
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>VIRTUAL DESIGN</span>
              </div>
              <h2 className="font-serif text-4xl text-heading mb-6">
                Walk Through Your <em className="text-emphasis font-medium">Future</em> Home
              </h2>
              <p className="text-text-gray leading-relaxed mb-6">
                Our visualization team has rendered over 800 projects for clients, architects, and developers worldwide. Using a combination of CAD, real-time engines, and hand-detailed post-production, we create images indistinguishable from photography.
              </p>
              <ul className="space-y-3">
                {[
                  "Photorealistic stills for every key view",
                  "Interactive VR walkthroughs on Meta Quest",
                  "Animation & fly-throughs for client presentations",
                  "Material & lighting studies for refinement",
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
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>TECHNOLOGY</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              The Tools Behind the <em className="text-emphasis font-medium">Magic</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "3ds Max", icon: IconCube },
              { name: "Corona", icon: IconLayers },
              { name: "V-Ray", icon: IconBox },
              { name: "Unreal", icon: IconShield },
              { name: "AutoCAD", icon: IconLayers },
              { name: "Revit", icon: IconCube },
            ].map((t) => (
              <div key={t.name} className="card p-6 text-center group cursor-pointer">
                <t.icon className="w-10 h-10 text-gold mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="font-serif text-lg text-heading">{t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3D Walkthrough Gallery */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>3D WALKTHROUGHS</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Featured <em className="text-emphasis font-medium">3D Walkthroughs</em>
            </h2>
            <p className="text-text-gray mt-4">Click play to experience our projects in 3D before they were built.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Office Interior Walkthrough", poster: "/images/services/office.jpg", duration: "1:34" },
              { title: "Restaurant Interior Walkthrough", poster: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80", duration: "1:52" },
              { title: "Cafe Interior Walkthrough", poster: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80", duration: "1:18" },
              { title: "3D Studio Reel", poster: "/images/hero-3d.jpg", duration: "2:48" },
            ].map((v) => (
              <div key={v.title} className="relative aspect-video rounded-card overflow-hidden shadow-card group cursor-pointer">
                <img src={v.poster} alt={v.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/40 to-espresso/20" />
                <button className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-3">
                    <IconPlay className="w-6 h-6 text-espresso ml-0.5" />
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-1.5">3D Walkthrough</p>
                  <h3 className="font-serif text-xl text-white">{v.title}</h3>
                  <p className="text-cream-100/60 text-xs mt-1">{v.duration}</p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase */}
      <section className="section-white py-20">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>SHOWCASE</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              Selected <em className="text-emphasis font-medium">Renders</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {portfolio.slice(0, 8).map((p) => (
              <div key={p.id} className="relative overflow-hidden rounded-card group cursor-pointer">
                <img src={p.image} alt={`${p.title} – ${p.category} interior design project in ${p.location}`} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-[10px] uppercase tracking-widest text-gold">{p.category}</div>
                  <div className="font-serif text-lg">{p.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-espresso py-20">
        <div className="container-x text-center max-w-2xl">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6">
            Need a <em className="text-gold not-italic font-medium">Visualization?</em>
          </h2>
          <p className="text-cream-100/70 mb-8">We accept standalone 3D commissions from architects, developers, and homeowners.</p>
          <button onClick={() => onNavigate("contact")} className="btn btn-gold">
            START A PROJECT
            <IconArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   PORTFOLIO PAGE
   ============================================================ */
export function PortfolioPage({ onNavigate }: { onNavigate: (p: string, s?: string) => void }) {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? portfolio : portfolio.filter((p) => p.category === active);

  return (
    <main>
      <PageHero
        eyebrow="OUR PORTFOLIO"
        title="Selected"
        italic="Works"
        description="A curated collection of recent projects across residential, commercial, and hospitality sectors. Click any project to see the full case study, 3D walkthrough, and process."
        breadcrumb="Home / Portfolio"
        background="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
        theme="light"
      />

      <section className="section-cream py-16 lg:py-20">
        <div className="container-x">
          {/* Filter tabs with counts */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: "All", label: "All Projects", count: portfolio.length },
              { id: "Residential", label: "Residential", count: portfolio.filter((p) => p.category === "Residential").length },
              { id: "Commercial", label: "Commercial", count: portfolio.filter((p) => p.category === "Commercial").length },
              { id: "Hospitality", label: "Hospitality", count: portfolio.filter((p) => p.category === "Hospitality").length },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all flex items-center gap-2",
                  active === c.id
                    ? "bg-espresso text-cream-100 shadow-md"
                    : "bg-white text-espresso hover:bg-espresso/5 border border-border"
                )}
              >
                {c.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px]",
                  active === c.id ? "bg-gold/20 text-gold" : "bg-cream-100 text-text-gray"
                )}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((p) => (
              <article key={p.id} className="group relative overflow-hidden rounded-card cursor-pointer" onClick={() => onNavigate("project", String(p.id))}>
                <img src={p.image} alt={p.title} className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-7 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">{p.category}</span>
                  <h3 className="font-serif text-2xl text-white mt-2">{p.title}</h3>
                  <p className="text-cream-100/70 text-xs mt-2">{p.client} · {p.location}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="btn btn-outline">
              LOAD MORE
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   BLOG PAGE
   ============================================================ */
export function BlogListPage({ onNavigate }: { onNavigate: (p: string, s?: string) => void }) {
  return (
    <main>
      <PageHero
        eyebrow="THE JOURNAL"
        title="Notes on"
        italic="Design"
        description="Long-form writing from our designers, makers, and visiting contributors on the craft of interior design. Updated monthly."
        breadcrumb="Home / Journal"
        background="/images/services/furniture.jpg"
        theme="light"
      />

      <section className="section-cream py-20">
        <div className="container-x">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Posts */}
            <div className="lg:col-span-2 space-y-10">
              {seoBlogPosts.map((post) => (
                <article key={post.slug} className="card overflow-hidden cursor-pointer group" onClick={() => onNavigate("post", post.slug)}>
                  <div className="overflow-hidden aspect-[16/9]">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest mb-3">
                      <span className="text-gold font-semibold">{post.category}</span>
                      <span className="w-1 h-1 rounded-full bg-text-gray/40" />
                      <span className="text-text-gray">{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-text-gray/40" />
                      <span className="text-text-gray">{post.readTime} read</span>
                    </div>
                    <h3 className="font-serif text-3xl text-heading mb-4 group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-text-gray leading-relaxed mb-5">{post.excerpt}</p>
                    <span className="text-gold text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2">
                      Read Article <IconArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </article>
              ))}

              {/* Pagination */}
              <div className="flex justify-center gap-2 pt-6">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    className={cn(
                      "w-10 h-10 rounded-full text-sm font-semibold transition-colors",
                      p === 1 ? "bg-espresso text-cream-100" : "bg-white text-espresso hover:bg-espresso/5"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-8">
              <div className="card p-6">
                <h4 className="font-serif text-xl text-heading mb-4">Search</h4>
                <div className="flex items-center gap-2 bg-cream-50 rounded-full px-4 py-2">
                  <input type="text" placeholder="Search articles…" className="bg-transparent flex-1 text-sm outline-none" />
                  <IconArrowRight className="w-4 h-4 text-gold" />
                </div>
              </div>

              <div className="card p-6">
                <h4 className="font-serif text-xl text-heading mb-4">Categories</h4>
                <ul className="space-y-2 text-sm">
                  {["Materials", "Lighting", "3D Studio", "Process", "Hospitality", "Behind the Studio"].map((c) => (
                    <li key={c} className="flex items-center justify-between py-1.5 text-text-gray hover:text-gold cursor-pointer">
                      <span>{c}</span>
                      <span className="text-xs text-gold">0{["Materials", "Lighting", "3D Studio", "Process", "Hospitality", "Behind the Studio"].indexOf(c) + 3}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-6">
                <h4 className="font-serif text-xl text-heading mb-4">Recent Posts</h4>
                <ul className="space-y-4">
                  {seoBlogPosts.slice(0, 3).map((p) => (
                    <li key={p.slug} className="flex gap-3 cursor-pointer group" onClick={() => onNavigate("post", p.slug)}>
                      <img src={p.image} className="w-16 h-16 rounded object-cover flex-shrink-0" alt={p.title} />
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1">{p.category}</div>
                        <div className="text-sm text-heading group-hover:text-gold leading-snug">{p.title}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   CONTACT PAGE
   ============================================================ */
export function ContactPage({ onNavigate: _ }: { onNavigate?: (p: string, s?: string) => void } = {}) {
  const [sent, setSent] = useState(false);
  return (
    <main>
      <PageHero
        eyebrow="GET IN TOUCH"
        title="Let's Create"
        italic="Together"
        description="Tell us about your project. We respond to every enquiry within one business day — guaranteed."
        breadcrumb="Home / Contact"
        background="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80"
        theme="light"
      />

      <section className="section-cream py-20">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="font-serif text-2xl text-heading mb-6">Studio</h3>
                <div className="space-y-5 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconMapPin className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-heading font-medium">New York Studio</div>
                      <div className="text-text-gray">124 Greene Street, SoHo, NY 10012</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconPhone className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-heading font-medium">Phone</div>
                      <div className="text-text-gray">+1 (212) 555-0199</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconMail className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-heading font-medium">Email</div>
                      <div className="text-text-gray">hello@wpinterior.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
                      <IconClock className="w-4 h-4 text-gold" />
                    </div>
                    <div>
                      <div className="text-heading font-medium">Studio Hours</div>
                      <div className="text-text-gray">Mon – Fri, 9:00 – 18:00 EST</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card p-6 bg-white">
                <h4 className="font-serif text-lg text-heading mb-3">Other Locations</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-heading font-medium">London</div>
                    <div className="text-text-gray text-xs">12 Hay Hill, Mayfair W1J 8NR</div>
                  </div>
                  <div>
                    <div className="text-heading font-medium">Vienna</div>
                    <div className="text-text-gray text-xs">Spiegelgasse 17, 1010 Wien</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="card p-8 lg:p-12"
              >
                {sent ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-6">
                      <IconCheck className="w-10 h-10 text-gold" />
                    </div>
                    <h3 className="font-serif text-3xl text-heading mb-3">Message Received</h3>
                    <p className="text-text-gray">A senior designer will be in touch within one business day.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="font-serif text-3xl text-heading mb-2">Tell us about your project</h3>
                    <p className="text-text-gray text-sm mb-8">The more you share, the better prepared we can be for our first conversation.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Field label="Full Name" placeholder="Jane Doe" required />
                      <Field label="Email Address" placeholder="jane@example.com" type="email" required />
                      <Field label="Phone" placeholder="+1 (555) 123-4567" />
                      <SelectField label="Service" options={["Residential Design", "Commercial Spaces", "Bespoke Furniture", "3D Visualization", "Consultation"]} />
                    </div>
                    <div className="mt-4">
                      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-2">Tell us about your project</label>
                      <textarea
                        rows={5}
                        placeholder="A brief description of your space, your timeline, and what you're hoping to achieve…"
                        className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors"
                      />
                    </div>
                    <button type="submit" className="btn btn-gold mt-6 w-full">
                      SEND MESSAGE
                      <IconArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 relative">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-74.0059%2C40.7228%2C-74.0009%2C40.7268&amp;layer=mapnik&amp;marker=40.7248%2C-74.0034"
          className="w-full h-full grayscale"
          title="Studio location"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream-50 to-transparent pointer-events-none" />
      </section>

      <FAQBlock />
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

function SelectField({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-widest text-text-gray font-semibold block mb-2">{label}</label>
      <select className="w-full px-4 py-3 rounded-lg border border-border bg-cream-50/50 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 transition-colors">
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function FAQBlock() {
  return <FAQ items={faqs} title="Common" italic="Questions" bg="white" />;
}
