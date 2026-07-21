import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import ServiceIcon from '@/components/ServiceIcon';
import { SERVICES } from '@/data/services';
import { useApiData } from '@/lib/useApiData';
import EditableElement from '@/components/builder/EditableElement';

export default function Services() {
  const { data: services } = useApiData('/services', SERVICES);

  return (
    <>
      <PageHero
        pageName="services"
        eyebrow="Our Services"
        title={<>Interior Design &amp; Furniture <span className="text-gold-grad font-semibold not-italic">Services in Lahore</span></>}
        subtitle="Twelve coordinated service lines covering residential, office, retail and commercial interiors — plus custom furniture design and manufacturing."
        image="/images/project-office.jpg"
        watermark="Services"
      />

      <EditableElement path="services.section.grid" asSection sectionLabel="Services Grid">
      <section className="py-24 lg:py-32">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/services/${s.slug}`} className="card-lux card-service group block h-full">
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <EditableElement path={"services.cards." + s.slug + ".image"} contentSrc={s.image}><img src={s.image} alt={s.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" /></EditableElement>
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(22,22,19,0.95) 100%)' }} />
                    <div className="absolute bottom-4 left-6 text-[#C9A84C]">
                      <ServiceIcon name={s.icon} />
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="font-display text-[1.45rem] text-white leading-snug mb-3 group-hover:text-[#E2C97E] transition-colors"><EditableElement path={"services.cards." + s.slug + ".title"} contentText={s.title}>{s.title}</EditableElement></h3>
                    <p className="text-sm font-light text-[#8A8073] leading-relaxed mb-6"><EditableElement path={"services.cards." + s.slug + ".excerpt"} contentText={s.excerpt}>{s.excerpt}</EditableElement></p>
                    <span className="inline-flex items-center gap-2 text-[0.63rem] tracking-[0.22em] uppercase text-[#C9A84C] group-hover:gap-3.5 transition-all duration-300">
                      View Service <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      </EditableElement>

      <CTASection />
    </>
  );
}
