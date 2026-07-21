import { Link } from 'react-router';
import { Check, ArrowRight } from 'lucide-react';
import EditableElement from '@/components/builder/EditableElement';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';

const WHAT_WE_DESIGN = [
  'Residential interiors',
  'Office and workplace interiors',
  'Retail stores',
  'Commercial spaces',
  'Customized office furniture',
  'Customized home furniture',
  'Space planning and visual concepts',
];

export default function About() {
  return (
    <>
      <PageHero
        pageName="about"
        eyebrow="About Woodex Interior"
        title={<>An Interior Design Firm <span className="text-gold-grad font-semibold not-italic">Based in Lahore</span></>}
        subtitle="Creating residential and commercial spaces supported by customized furniture solutions — from home interiors and office environments to retail spaces and purpose-built furniture."
        image="/images/about.jpg"
        watermark="About"
      />

      {/* Approach */}
      <EditableElement path="about.section.approach" asSection sectionLabel="Our Approach">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <div>
            <SectionHeading
              pageKey="about" sectionKey="approach"
              eyebrow="Our Approach"
              title={<>Appearance, Purpose <strong>&amp; Practical Use</strong></>}
            />
            <Reveal delay={2}>
              <EditableElement path="about.approach.text1" contentText="We believe interior design should bring together appearance, purpose and practical use. A visually impressive environment is only successful when it also supports comfort, movement, storage and everyday activities.">
                <p className="text-[#D4C5A9] font-light leading-relaxed mt-2 mb-5">
                  We believe interior design should bring together appearance, purpose and practical use. A visually impressive environment is only successful when it also supports comfort, movement, storage and everyday activities.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={3}>
              <EditableElement path="about.approach.text2" contentText="Our process begins with understanding the client's priorities. We then develop the layout, visual direction, materials and furniture requirements around the space — so every decision is anchored in how the space will actually be used.">
                <p className="text-[#8A8073] font-light leading-relaxed mb-8">
                  Our process begins with understanding the client's priorities. We then develop the layout, visual direction, materials and furniture requirements around the space — so every decision is anchored in how the space will actually be used.
                </p>
              </EditableElement>
            </Reveal>
            <Reveal delay={4}>
              <Link to="/contact" className="btn-lux btn-gold text-[0.68rem]">Discuss Your Space</Link>
            </Reveal>
          </div>
          <Reveal variant="right">
            <div className="ornament-corners p-4">
              <div className="oc-inner relative overflow-hidden">
                <img src="/images/hero.jpg" alt="Interior designed by Woodex" className="w-full h-[420px] lg:h-[500px] object-cover img-lux" loading="lazy" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      </EditableElement>

      {/* What we design */}
      <EditableElement path="about.section.scope" asSection sectionLabel="Scope of Work">
      <section className="py-24 lg:py-28 bg-[#111110] border-y border-[rgba(201,168,76,0.15)] relative overflow-hidden">
        <span className="bg-watermark -top-4 right-0">Scope</span>
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeading
            pageKey="about" sectionKey="scope"
            align="center"
            eyebrow="What We Design"
            title={<>One Coordinated <strong>Scope of Work</strong></>}
            className="mb-14"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHAT_WE_DESIGN.map((w, i) => (
              <Reveal key={w} delay={(i % 3) as 0 | 1 | 2}>
                <div className="card-lux card-service p-7 flex items-center gap-4 h-full">
                  <Check size={17} className="text-[#C9A84C] shrink-0" />
                  <span className="text-sm font-light text-[#D4C5A9]"><EditableElement path={"about.scope.items." + i} contentText={w}>{w}</EditableElement></span>
                </div>
              </Reveal>
            ))}
            <Reveal delay={2}>
              <Link to="/services" className="card-lux p-7 flex items-center justify-center gap-3 h-full border !border-[rgba(201,168,76,0.5)] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-black transition-all duration-300 group">
                <span className="text-[0.68rem] tracking-[0.22em] uppercase font-semibold">Explore Services</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      </EditableElement>

      {/* Location */}
      <EditableElement path="about.section.location" asSection sectionLabel="Location">
      <section className="py-24 lg:py-32">
        <div className="max-w-[900px] mx-auto px-6 lg:px-12 text-center">
          <SectionHeading
            pageKey="about" sectionKey="location"
            align="center"
            eyebrow="Visit Us"
            title={<>Zainab Tower, <strong>Model Town Link Road</strong></>}
            subtitle="Woodex Interior is located at Zainab Tower, Model Town Link Road, Lahore — call or WhatsApp to arrange a consultation or a site review anywhere in Lahore."
          />
        </div>
      </section>
      </EditableElement>

      <CTASection
        title={<>Have a Project <strong>in Mind?</strong></>}
        text="Discuss your space with Woodex Interior — your requirements, preferred design direction and project scope."
        image="/images/project-living.jpg"
      />
    </>
  );
}
