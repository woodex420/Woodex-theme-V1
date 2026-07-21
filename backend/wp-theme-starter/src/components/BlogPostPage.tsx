import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconWhatsapp,
  IconMail,
  IconClock,
  IconLinkedin,
} from "./Icons";
import { blogPosts, SITE } from "../data/seo";
import { FAQ } from "./FAQ";

// Map of social icons (using simple letters wrapped in styled boxes)
const IconX = (p: { className?: string }) => (
  <svg className={p.className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function BlogPostPage({ slug, onNavigate }: { slug: string; onNavigate: (p: string, s?: string) => void }) {
  const post = blogPosts.find((p) => p.slug === slug);
  const [open, setOpen] = useState(0);
  const [tocItems, setTocItems] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    if (!post) return;
    setTocItems(
      post.content
        .filter((b) => b.type === "h2")
        .map((b, i) => ({
          id: `h2-${i}`,
          text: b.text || "",
        }))
    );
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const id = "ld-json-post";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "@id": `https://wpinterior.com/journal/${post.slug}/#article`,
          headline: post.title,
          description: post.metaDescription,
          image: post.image,
          datePublished: "2025-03-18",
          dateModified: "2025-03-18",
          author: {
            "@type": "Person",
            name: post.author,
            jobTitle: post.authorRole,
            worksFor: { "@id": `${SITE.url}/#localbusiness` },
          },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            logo: { "@type": "ImageObject", url: SITE.logo },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://wpinterior.com/journal/${post.slug}/`,
          },
          articleSection: post.category,
          keywords: post.title,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
            { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE.url}/journal/` },
            { "@type": "ListItem", position: 3, name: post.title, item: `https://wpinterior.com/journal/${post.slug}/` },
          ],
        },
      ],
    });
    document.head.appendChild(script);
  }, [post]);

  if (!post) {
    return (
      <main className="pt-40 pb-20 text-center">
        <h1 className="font-serif text-4xl text-heading">Article not found</h1>
        <button onClick={() => onNavigate("blog")} className="btn btn-gold mt-6">Back to Journal</button>
      </main>
    );
  }

  const related = post.related
    .map((r) => blogPosts.find((p) => p.slug === r))
    .filter(Boolean) as typeof blogPosts;

  return (
    <main>
      {/* Hero - Light theme, image-led with text overlay, reduced height */}
      <section className="relative pt-24 lg:pt-28 pb-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          {/* Light theme gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 to-cream-50/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/40" />
        </div>
        <div className="container-x max-w-4xl relative">
          <nav className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-5">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("home"); }} className="hover:text-gold">Home</a>
            {" / "}
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate("blog"); }} className="hover:text-gold">Journal</a>
            {" / "}
            <span className="text-text-gray">{post.category}</span>
          </nav>
          <div className="eyebrow no-line mb-5">
            <span className="w-8 h-px bg-gold inline-block" />
            <span className="text-gold">{post.category.toUpperCase()}</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl leading-[1.1] mb-5 max-w-3xl text-heading">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-gold/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center font-serif text-gold font-semibold text-sm">
                {post.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-serif text-sm text-heading">{post.author}</div>
                <div className="text-[10px] text-text-gray uppercase tracking-widest">{post.authorRole}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-text-gray">
              <span className="flex items-center gap-1.5">
                <IconClock className="w-3 h-3" /> {post.readTime} read
              </span>
              <span>·</span>
              <span>{post.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article body with sticky TOC sidebar */}
      <section className="section-cream py-16">
        <div className="container-x max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sticky TOC sidebar (desktop) */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-32">
                <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-4">ON THIS PAGE</p>
                <ul className="space-y-2 text-sm">
                  {tocItems.map((t, i) => (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className="block text-text-gray hover:text-gold py-1 border-l-2 border-transparent hover:border-gold pl-3 transition-colors"
                      >
                        {String(i + 1).padStart(2, "0")}. {t.text}
                      </a>
                    </li>
                  ))}
                </ul>

                {/* Share */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-4">SHARE</p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(post.title + " - https://wpinterior.com/journal/" + post.slug + "/")}`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-text-gray hover:text-[#25D366] py-1"
                    >
                      <IconWhatsapp className="w-4 h-4" /> WhatsApp
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=https://wpinterior.com/journal/${post.slug}/`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-text-gray hover:text-[#0a66c2] py-1"
                    >
                      <IconLinkedin className="w-4 h-4" /> LinkedIn
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=https://wpinterior.com/journal/${post.slug}/`}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center gap-3 text-sm text-text-gray hover:text-espresso py-1"
                    >
                      <IconX className="w-4 h-4" /> X / Twitter
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(post.title)}&body=Read this: https://wpinterior.com/journal/${post.slug}/`}
                      className="flex items-center gap-3 text-sm text-text-gray hover:text-gold py-1"
                    >
                      <IconMail className="w-4 h-4" /> Email
                    </a>
                  </div>
                </div>
              </div>
            </aside>

            {/* Article content */}
            <article className="lg:col-span-9 max-w-3xl">
              <div className="prose prose-lg max-w-none">
                {post.content.map((block, i) => {
                  if (block.type === "h2") {
                    const id = `h2-${post.content.slice(0, i).filter((b) => b.type === "h2").length}`;
                    return (
                      <h2 key={i} id={id} className="font-serif text-3xl text-heading mt-12 mb-4 scroll-mt-32">
                        {block.text}
                      </h2>
                    );
                  }
                  if (block.type === "h3") {
                    return (
                      <h3 key={i} className="font-serif text-2xl text-heading mt-8 mb-3">
                        {block.text}
                      </h3>
                    );
                  }
                  if (block.type === "p") {
                    return (
                      <p key={i} className="text-text-gray leading-[1.8] mb-5 text-base">
                        {block.text}
                      </p>
                    );
                  }
                  if (block.type === "list") {
                    return (
                      <ul key={i} className="space-y-3 mb-6 my-6">
                        {block.items?.map((item, j) => (
                          <li key={j} className="flex items-start gap-3 text-text-gray leading-relaxed">
                            <span className="w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <IconCheck className="w-3 h-3 text-gold" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (block.type === "quote") {
                    return (
                      <blockquote key={i} className="my-10 pl-6 border-l-4 border-gold">
                        <p className="font-serif text-2xl text-heading italic leading-relaxed">"{block.text}"</p>
                      </blockquote>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Mobile share bar */}
              <div className="lg:hidden mt-12 pt-8 border-t border-border">
                <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-4">SHARE THIS ARTICLE</p>
                <div className="flex gap-2">
                  <a href={`https://wa.me/?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-text-gray hover:bg-[#25D366] hover:text-white transition-colors">
                    <IconWhatsapp className="w-4 h-4" />
                  </a>
                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://wpinterior.com/journal/${post.slug}/`} target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-text-gray hover:bg-[#0a66c2] hover:text-white transition-colors">
                    <IconLinkedin className="w-4 h-4" />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener" className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-text-gray hover:bg-espresso hover:text-white transition-colors">
                    <IconX className="w-4 h-4" />
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(post.title)}`} className="w-10 h-10 rounded-full bg-cream-50 flex items-center justify-center text-text-gray hover:bg-gold hover:text-white transition-colors">
                    <IconMail className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Author bio */}
              <div className="mt-12 card p-8">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center font-serif text-2xl text-gold font-semibold flex-shrink-0">
                    {post.author.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1">Written by</p>
                    <h3 className="font-serif text-xl text-heading mb-1">{post.author}</h3>
                    <p className="text-xs uppercase tracking-widest text-text-gray mb-3">{post.authorRole}</p>
                    <p className="text-sm text-text-gray leading-relaxed">{post.authorBio}</p>
                  </div>
                </div>
              </div>

              {/* Inline CTA */}
              <div className="mt-12 bg-espresso text-white rounded-card p-8 lg:p-10">
                <h3 className="font-serif text-2xl lg:text-3xl text-white mb-3">
                  Ready to Start Your <em className="text-gold not-italic font-medium">Project?</em>
                </h3>
                <p className="text-cream-100/70 mb-6">
                  Book a free 30-minute consultation with a senior designer. We'll listen and recommend the right path forward.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => onNavigate("consultation")} className="btn btn-gold">
                    BOOK FREE CONSULTATION
                    <IconArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=Hi! I read your article about ${encodeURIComponent(post.title)}.`}
                    target="_blank"
                    rel="noopener"
                    className="btn btn-outline-light"
                  >
                    <IconWhatsapp className="w-4 h-4" />
                    WHATSAPP US
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="section-white py-20">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>KEEP READING</span></div>
            <h2 className="font-serif text-3xl lg:text-4xl text-heading">
              Related <em className="text-emphasis font-medium">Articles</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((p) => (
              <article key={p.slug} className="group cursor-pointer" onClick={() => onNavigate("post", p.slug)}>
                <div className="overflow-hidden rounded-card mb-4 aspect-[4/3]">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest mb-2">
                  <span className="text-gold font-semibold">{p.category}</span>
                  <span className="w-1 h-1 rounded-full bg-text-gray/40" />
                  <span className="text-text-gray">{p.readTime} read</span>
                </div>
                <h3 className="font-serif text-xl text-heading mb-2 group-hover:text-gold transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-text-gray line-clamp-2">{p.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section specific to this article (for "People Also Ask") */}
      <ArticleFAQ category={post.category} open={open} setOpen={setOpen} />
    </main>
  );
}

function ArticleFAQ({ category }: { category: string; open: number; setOpen: (n: number) => void }) {
  // Common PAA-style questions for an interior design article
  const faqs = [
    {
      q: `How much does ${category.toLowerCase()} cost in Pakistan?`,
      a: "Costs vary widely based on scope, finishes and location. As a rule of thumb, residential interiors in Pakistan range from PKR 280-700 per sq ft. Book a free consultation for an accurate figure for your project.",
    },
    {
      q: "How long does an interior design project take?",
      a: "A typical residential or small commercial project takes 8-16 weeks from concept to handover. Larger or multi-phase projects run 16-32 weeks. We share a detailed Gantt chart before you commit.",
    },
    {
      q: "Should I hire an interior designer or do it myself?",
      a: "For anything beyond a single-room refresh, a senior designer pays for themselves through better decisions, vendor relationships, and project management. We share before/after cost comparisons during the consultation.",
    },
    {
      q: "How do I choose the right interior design firm?",
      a: "Look at three things: relevant portfolio in your sector, named senior designers who'll actually lead your project, and fixed-price contracts with clear deliverables. WP Interior scores well on all three.",
    },
  ];

  return (
    <FAQ
      items={faqs}
      eyebrow="PEOPLE ALSO ASK"
      title="Frequently Asked"
      italic="Questions"
      bg="cream"
    />
  );
}
