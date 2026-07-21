import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, MapPin, Ruler, Calendar, Tag } from 'lucide-react';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { PROJECTS, getProject } from '@/data/projects';
import { useApiItem } from '@/lib/useApiData';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { item: apiProject } = useApiItem('/projects', slug, PROJECTS);
  const project = apiProject ?? (slug ? getProject(slug) : undefined);
  if (!project) return <Navigate to="/projects" replace />;

  const idx = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(idx + 1) % PROJECTS.length];
  const related = PROJECTS.filter((p) => p.slug !== project.slug && p.category === project.category).slice(0, 2);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover img-lux" />
          <div className="absolute inset-0" style={{ background: 'var(--grad-hero)' }} />
        </div>
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-12 pb-16 pt-44">
          <Reveal>
            <Link to="/projects" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.25em] uppercase text-[#C9A84C] mb-8 hover:text-[#E2C97E] transition-colors">
              <ArrowLeft size={14} /> All Projects
            </Link>
          </Reveal>
          <Reveal delay={1}>
            <span className="eyebrow">{project.category} Interior</span>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="font-display font-light text-white text-[clamp(2.4rem,5.5vw,4.8rem)] leading-[1.06] mt-5">{project.title}</h1>
          </Reveal>
        </div>
      </section>

      {/* Meta bar */}
      <section className="bg-[#111110] border-y border-[rgba(201,168,76,0.25)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-2 lg:grid-cols-4">
          {[
            { icon: MapPin, label: 'Location', value: project.location },
            { icon: Tag, label: 'Project Type', value: project.category },
            { icon: Ruler, label: 'Area', value: project.area },
            { icon: Calendar, label: 'Completed', value: project.year },
          ].map((m, i) => (
            <div key={m.label} className={`flex items-center gap-4 py-7 px-2 lg:px-8 ${i < 3 ? 'lg:border-r border-[rgba(201,168,76,0.2)]' : ''}`}>
              <m.icon size={20} className="text-[#C9A84C] shrink-0" strokeWidth={1.5} />
              <div>
                <div className="text-[0.58rem] tracking-[0.25em] uppercase text-[#8A8073]">{m.label}</div>
                <div className="text-sm text-white font-medium mt-1 capitalize">{m.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Case study */}
      <section className="py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <Reveal>
                <h2 className="font-display text-3xl text-white mb-6">Client <span className="text-gold-grad font-semibold">Brief</span></h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="text-[#8A8073] font-light leading-[1.85]">{project.brief}</p>
              </Reveal>
            </div>
            <div>
              <Reveal>
                <h2 className="font-display text-3xl text-white mb-6">The <span className="text-gold-grad font-semibold">Challenge</span></h2>
              </Reveal>
              <Reveal delay={1}>
                <p className="text-[#8A8073] font-light leading-[1.85]">{project.challenge}</p>
              </Reveal>
            </div>
          </div>

          <Reveal className="mt-16">
            <div className="bg-[#161613] border border-[rgba(201,168,76,0.3)] p-8 lg:p-12">
              <h2 className="font-display text-3xl text-white mb-6">Woodex <span className="text-gold-grad font-semibold">Solution</span></h2>
              <p className="text-[#D4C5A9] font-light leading-[1.85]">{project.solution}</p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-12 mt-16">
            <Reveal>
              <h3 className="text-[0.7rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">Materials &amp; Finishes</h3>
              <ul className="space-y-3">
                {project.materials.map((m) => (
                  <li key={m} className="flex items-center gap-3 border-b border-[rgba(201,168,76,0.15)] pb-3">
                    <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: 'var(--grad-gold-h)' }} />
                    <span className="text-sm font-light text-[#D4C5A9]">{m}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={1}>
              <h3 className="text-[0.7rem] font-semibold tracking-[0.28em] uppercase text-[#C9A84C] mb-6">Services Delivered</h3>
              <ul className="space-y-3">
                {project.services.map((s) => (
                  <li key={s} className="flex items-center gap-3 border-b border-[rgba(201,168,76,0.15)] pb-3">
                    <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: 'var(--grad-gold-h)' }} />
                    <span className="text-sm font-light text-[#D4C5A9]">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Related + next */}
      <section className="py-16 bg-[#111110] border-t border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <h2 className="font-display text-3xl text-white">Related <span className="text-gold-grad font-semibold">Projects</span></h2>
            <Link to={`/projects/${next.slug}`} className="btn-link-gold">Next Project <ArrowRight size={14} /></Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) as 0 | 1}>
                <Link to={`/projects/${p.slug}`} className="group block relative overflow-hidden aspect-[16/9] card-lux">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" />
                  <div className="absolute inset-0" style={{ background: 'var(--grad-card)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-2">{p.location}</div>
                    <h3 className="font-display text-2xl text-white">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title={<>Want a Result <strong>Like This?</strong></>}
        text="Share your space, requirements and timeline — Woodex will plan the design and furniture around them."
      />
    </>
  );
}
