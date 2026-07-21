import { Link } from 'react-router';
import { ArrowRight, Clock } from 'lucide-react';
import PageHero from '@/components/PageHero';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { ARTICLES } from '@/data/articles';
import { useApiData } from '@/lib/useApiData';
import EditableElement from '@/components/builder/EditableElement';

export default function Insights() {
  const { data: articles } = useApiData('/articles', ARTICLES);
  const [first, ...rest] = articles;
  return (
    <>
      <PageHero
        pageName="insights"
        eyebrow="Woodex Insights"
        title={<>Interior Planning <span className="text-gold-grad font-semibold not-italic">Guides &amp; Ideas</span></>}
        subtitle="Practical, people-first guides on interior costs, office planning, retail design and custom furniture — written from real project experience in Lahore."
        image="/images/service-3d.jpg"
        watermark="Insights"
      />

      <EditableElement path="insights.section.articles" asSection sectionLabel="Articles">
      <section className="py-20 lg:py-28">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          {/* Featured article */}
          <Reveal className="mb-16">
            <Link to={`/insights/${first.slug}`} className="card-lux group grid lg:grid-cols-2 overflow-hidden">
              <div className="overflow-hidden aspect-[16/10] lg:aspect-auto">
                <EditableElement path={"insights.featured.image"} contentSrc={first.image}><img src={first.image} alt={first.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" /></EditableElement>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-[0.6rem] tracking-[0.25em] uppercase text-black font-semibold px-3 py-1.5" style={{ background: 'var(--grad-gold-h)' }}>Featured</span>
                  <span className="text-[0.62rem] tracking-[0.2em] uppercase text-[#8A8073]"><EditableElement path={"insights.featured.category"} contentText={first.category}>{first.category}</EditableElement></span>
                </div>
                <h2 className="font-display text-3xl lg:text-4xl text-white leading-snug mb-5 group-hover:text-[#E2C97E] transition-colors"><EditableElement path={"insights.featured.title"} contentText={first.title}>{first.title}</EditableElement></h2>
                <p className="text-[#8A8073] font-light leading-relaxed mb-7"><EditableElement path={"insights.featured.excerpt"} contentText={first.excerpt}>{first.excerpt}</EditableElement></p>
                <span className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.22em] uppercase text-[#C9A84C]">
                  Read Guide <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/insights/${a.slug}`} className="card-lux group block h-full">
                  <div className="overflow-hidden aspect-video">
                    <EditableElement path={"insights.cards." + a.slug + ".image"} contentSrc={a.image}><img src={a.image} alt={a.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" /></EditableElement>
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[0.6rem] tracking-[0.25em] uppercase text-[#C9A84C]"><EditableElement path={"insights.cards." + a.slug + ".category"} contentText={a.category}>{a.category}</EditableElement></span>
                      <span className="flex items-center gap-1.5 text-[0.62rem] text-[#8A8073]">
                        <Clock size={11} /> {a.readTime}
                      </span>
                    </div>
                    <h3 className="font-display text-[1.4rem] text-white leading-snug mb-4 group-hover:text-[#E2C97E] transition-colors"><EditableElement path={"insights.cards." + a.slug + ".title"} contentText={a.title}>{a.title}</EditableElement></h3>
                    <p className="text-sm font-light text-[#8A8073] leading-relaxed line-clamp-2"><EditableElement path={"insights.cards." + a.slug + ".excerpt"} contentText={a.excerpt}>{a.excerpt}</EditableElement></p>
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
