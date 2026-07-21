import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { PROJECTS } from '@/data/projects';
import { useApiData } from '@/lib/useApiData';
import EditableElement from '@/components/builder/EditableElement';

const FILTERS = [
  { key: 'all', label: 'All Projects' },
  { key: 'residential', label: 'Residential' },
  { key: 'office', label: 'Office' },
  { key: 'retail', label: 'Retail' },
  { key: 'commercial', label: 'Commercial' },
];

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const { data: allProjects } = useApiData('/projects', PROJECTS);
  const list = filter === 'all' ? allProjects : allProjects.filter((p) => p.category === filter);

  return (
    <>
      <PageHero
        pageName="projects"
        eyebrow="Woodex Portfolio"
        title={<>Interior Design <span className="text-gold-grad font-semibold not-italic">Projects in Lahore</span></>}
        subtitle="Selected residential, office, retail and commercial projects — each one a case study in layout planning, material selection, custom furniture and visual detailing."
        image="/images/project-living.jpg"
        watermark="Projects"
      />

      <EditableElement path="projects.section.grid" asSection sectionLabel="Projects Grid">
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Filters */}
          <Reveal className="flex flex-wrap gap-3 mb-12">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 text-[0.65rem] tracking-[0.22em] uppercase font-medium transition-all duration-300 border ${
                  filter === f.key
                    ? 'text-black border-transparent'
                    : 'text-[#D4C5A9] border-[rgba(201,168,76,0.3)] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
                style={filter === f.key ? { background: 'var(--grad-gold-h)' } : {}}
              >
                {<EditableElement path={"projects.filters." + f.key} contentText={f.label}>{f.label}</EditableElement>}
              </button>
            ))}
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/projects/${p.slug}`} className="group block relative overflow-hidden aspect-[3/4] card-lux">
                  <EditableElement path={"projects.cards." + p.slug + ".image"} contentSrc={p.image}><img src={p.image} alt={p.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" /></EditableElement>
                  <div className="absolute inset-0" style={{ background: 'var(--grad-card)' }} />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="text-[0.58rem] tracking-[0.22em] uppercase text-[#0A0A0A] font-semibold px-3 py-1.5" style={{ background: 'var(--grad-gold-h)' }}>
                      <EditableElement path={"projects.cards." + p.slug + ".category"} contentText={p.category}>{p.category}</EditableElement>
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <div className="text-[0.6rem] tracking-[0.22em] uppercase text-[#C9A84C] mb-2">
                      <EditableElement path={"projects.cards." + p.slug + ".location"} contentText={p.location}>{p.location}</EditableElement> · {p.year}
                    </div>
                    <h3 className="font-display text-2xl text-white leading-snug mb-3"><EditableElement path={"projects.cards." + p.slug + ".title"} contentText={p.title}>{p.title}</EditableElement></h3>
                    <p className="text-[0.8rem] font-light text-[#D4C5A9] leading-relaxed mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {p.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.2em] uppercase text-[#C9A84C]">
                      View Case Study <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          {list.length === 0 && (
            <p className="text-center text-[#8A8073] font-light py-20">No projects in this category yet.</p>
          )}
        </div>
      </section>
      </EditableElement>

      <CTASection
        title={<>Your Project <strong>Could Be Next</strong></>}
        text="Speak with Woodex Interior about your requirements, preferred design direction and project scope."
      />
    </>
  );
}
