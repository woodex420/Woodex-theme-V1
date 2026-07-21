import { Link, Navigate, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Calendar, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import Reveal from '@/components/Reveal';
import CTASection from '@/components/CTASection';
import { ARTICLES, getArticle } from '@/data/articles';
import { getService } from '@/data/services';
import { useApiItem } from '@/lib/useApiData';

export default function ArticleDetail() {
  const { slug } = useParams();
  const { item: apiArticle } = useApiItem('/articles', slug, ARTICLES);
  const article = apiArticle ?? (slug ? getArticle(slug) : undefined);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!article) return <Navigate to="/insights" replace />;

  const service = getService(article.relatedService);
  const others = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const dateStr = new Date(article.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover img-lux" />
          <div className="absolute inset-0" style={{ background: 'var(--grad-hero)' }} />
        </div>
        <div className="relative z-10 w-full max-w-[900px] mx-auto px-6 pb-14 pt-44">
          <Reveal>
            <Link to="/insights" className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.25em] uppercase text-[#C9A84C] mb-8 hover:text-[#E2C97E] transition-colors">
              <ArrowLeft size={14} /> All Insights
            </Link>
          </Reveal>
          <Reveal delay={1}>
            <div className="flex flex-wrap items-center gap-4 text-[0.62rem] tracking-[0.22em] uppercase text-[#8A8073] mb-5">
              <span className="text-[#C9A84C]">{article.category}</span>
              <span className="flex items-center gap-1.5"><Calendar size={11} /> {dateStr}</span>
              <span className="flex items-center gap-1.5"><Clock size={11} /> {article.readTime}</span>
            </div>
          </Reveal>
          <Reveal delay={2}>
            <h1 className="font-display font-light text-white text-[clamp(2rem,4.6vw,3.8rem)] leading-[1.1]">{article.title}</h1>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[800px] mx-auto px-6">
          {/* Direct answer */}
          <Reveal>
            <div className="border-l-2 border-[#C9A84C] bg-[#161613] p-7 mb-12">
              <div className="text-[0.62rem] tracking-[0.28em] uppercase text-[#C9A84C] mb-3">The Short Answer</div>
              <p className="font-display italic text-xl text-[#E2C97E] leading-relaxed">{article.answer}</p>
            </div>
          </Reveal>

          <div className="prose-lux">
            {article.body.map((block, i) => (
              <Reveal key={i}>
                {block.heading && <h2>{block.heading}</h2>}
                {block.text && <p>{block.text}</p>}
                {block.list && (
                  <ul>
                    {block.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </Reveal>
            ))}
          </div>

          {/* Related service CTA */}
          {service && (
            <Reveal className="mt-14">
              <Link to={`/services/${service.slug}`} className="card-lux card-service group flex items-center justify-between gap-6 p-7">
                <div>
                  <div className="text-[0.6rem] tracking-[0.25em] uppercase text-[#C9A84C] mb-2">Related Service</div>
                  <div className="font-display text-2xl text-white group-hover:text-[#E2C97E] transition-colors">{service.title}</div>
                </div>
                <ArrowRight size={20} className="text-[#C9A84C] group-hover:translate-x-2 transition-transform shrink-0" />
              </Link>
            </Reveal>
          )}

          {/* FAQs */}
          <div className="mt-16">
            <Reveal>
              <h2 className="font-display text-3xl text-white mb-8">Frequently Asked <span className="text-gold-grad font-semibold">Questions</span></h2>
            </Reveal>
            {article.faqs.map((f, i) => (
              <Reveal key={f.q} delay={Math.min(i, 2) as 0 | 1 | 2}>
                <div className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                  <button className="w-full flex items-center justify-between gap-6 py-6 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-display text-lg text-white">{f.q}</span>
                    <ChevronDown size={18} className="text-[#C9A84C] shrink-0 transition-transform duration-300" style={{ transform: openFaq === i ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
                  </button>
                  <div className="faq-answer">
                    <div>
                      <p className="text-sm font-light text-[#8A8073] leading-relaxed pb-7 pr-10">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* More articles */}
      <section className="py-16 bg-[#111110] border-t border-[rgba(201,168,76,0.15)]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <h2 className="font-display text-3xl text-white mb-10">More <span className="text-gold-grad font-semibold">Insights</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 3) as 0 | 1 | 2}>
                <Link to={`/insights/${a.slug}`} className="card-lux group block h-full">
                  <div className="overflow-hidden aspect-video">
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover img-lux img-zoom" loading="lazy" />
                  </div>
                  <div className="p-6">
                    <div className="text-[0.6rem] tracking-[0.25em] uppercase text-[#C9A84C] mb-3">{a.category}</div>
                    <h3 className="font-display text-xl text-white leading-snug group-hover:text-[#E2C97E] transition-colors">{a.title}</h3>
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
