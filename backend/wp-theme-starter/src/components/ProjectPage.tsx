import { useEffect, useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconWhatsapp,
  IconPlay,
  IconShare,
  IconArrowLeft,
} from "./Icons";
import { portfolio } from "../data/pages";
import { SITE } from "../data/seo";
import { cn } from "../utils/cn";

export function ProjectPage({ id, onNavigate }: { id: string; onNavigate: (p: string, slug?: string) => void }) {
  const project = portfolio.find((p) => p.id === Number(id));
  const [activeTab, setActiveTab] = useState<"all" | "commercial" | "residential" | "hospitality" | "3d">("all");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Commercial filter
  const allProjects = portfolio;
  const filteredProjects = activeTab === "all" ? allProjects : allProjects.filter((p) => p.categorySlug === activeTab);

  useEffect(() => {
    if (!project) return;
    const schemaId = "ld-json-project";
    document.getElementById(schemaId)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = schemaId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: project.title,
      description: `${project.category} interior design project in ${project.location} completed by WP Interior in ${project.year}.`,
      image: project.image,
      locationCreated: { "@type": "Place", name: project.location },
      dateCreated: project.year,
      creator: { "@id": `${SITE.url}/#localbusiness` },
      provider: { "@id": `${SITE.url}/#localbusiness` },
      keywords: `${project.category}, interior design Pakistan, ${project.location}, ${project.year}`,
    });
    document.head.appendChild(script);
  }, [project]);

  if (!project) {
    return (
      <main className="pt-40 pb-20 text-center">
        <h1 className="font-serif text-4xl text-heading">Project not found</h1>
        <button onClick={() => onNavigate("portfolio")} className="btn btn-gold mt-6">Back to Portfolio</button>
      </main>
    );
  }

  // Build a richer project gallery using real generated image paths + curated Unsplash
  const galleryImages = [
    project.image,
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=1400&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1400&q=80",
  ];

  const projectDetails = [
    { label: "Client", value: project.client },
    { label: "Location", value: project.location },
    { label: "Year", value: project.year },
    { label: "Category", value: project.category },
    { label: "Status", value: "Completed" },
    { label: "Studio", value: "WP Interior, Lahore" },
  ];

  const features = [
    "Full concept & space planning",
    "Bespoke joinery and millwork",
    "Custom lighting design",
    "Acoustic treatment",
    "Branded FF&E selection",
    "White-glove installation",
  ];

  // Find related projects (same category, exclude self)
  const related = portfolio.filter((p) => p.categorySlug === project.categorySlug && p.id !== project.id).slice(0, 3);

  return (
    <main>
      {/* HERO - Light theme */}
      <section className="relative pt-24 lg:pt-28 pb-10 lg:pb-14 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={`${project.title} - ${project.category} interior design project by WP Interior`}
            className="w-full h-full object-cover"
          />
          {/* Light theme gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cream-100/95 via-cream-100/85 to-cream-50/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-cream-100/60 via-transparent to-cream-50/40" />
        </div>
        <div className="container-x relative">
          <button
            onClick={() => onNavigate("portfolio")}
            className="text-text-gray hover:text-gold text-xs uppercase tracking-widest font-semibold inline-flex items-center gap-2 mb-7 transition-colors"
          >
            <IconArrowLeft className="w-3.5 h-3.5" />
            Back to Portfolio
          </button>
          <div className="eyebrow no-line mb-5">
            <span className="w-8 h-px bg-gold inline-block" />
            <span className="text-gold">{project.category.toUpperCase()}</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl leading-[1.05] max-w-3xl mb-5 text-heading">
            {project.title}
          </h1>
          <p className="text-text-gray text-lg max-w-2xl leading-relaxed mb-8">
            A considered {project.category.toLowerCase()} project delivered for {project.client.toLowerCase()} in {project.location}. Every detail was prototyped in our 3D Studio before construction began.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(`Hi! I'd like to discuss a project similar to ${project.title}.`)}`}
              target="_blank"
              rel="noopener"
              className="btn btn-gold"
            >
              <IconWhatsapp className="w-4 h-4" />
              DISCUSS A SIMILAR PROJECT
            </a>
            <button onClick={() => onNavigate("consultation")} className="btn btn-outline-light">
              BOOK FREE CONSULTATION
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* PROJECT META BAR */}
      <section className="bg-white border-b border-border py-8">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {projectDetails.map((d) => (
              <div key={d.label}>
                <div className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-1.5">{d.label}</div>
                <div className="font-serif text-base text-heading">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY with lightbox + video */}
      <section className="section-cream py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>Project Gallery</span></div>
            <h2 className="font-serif text-4xl lg:text-5xl text-heading">
              The <em className="text-emphasis font-medium">Space</em>
            </h2>
            <p className="text-text-gray mt-4">Click any image to view in fullscreen. Includes a 3D walkthrough of the finished project.</p>
          </div>

          {/* Main image + 3D video tile */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setLightbox(galleryImages[0])}
              className="relative aspect-[4/3] overflow-hidden rounded-card group cursor-pointer"
            >
              <img src={galleryImages[0]} alt={`${project.title} - main view`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* 3D Walkthrough tile */}
            <div className="relative aspect-[4/3] rounded-card overflow-hidden shadow-card group">
              {showVideo ? (
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  className="w-full h-full"
                  title={`${project.title} 3D walkthrough`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img src={galleryImages[1]} alt={`${project.title} 3D walkthrough preview`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/40 to-espresso/20" />
                  <button onClick={() => setShowVideo(true)} className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform mb-4">
                      <IconPlay className="w-7 h-7 text-espresso ml-1" />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold mb-2">3D Walkthrough</p>
                    <h3 className="font-serif text-2xl text-white max-w-md text-center px-6">
                      Explore {project.title} in 3D
                    </h3>
                    <p className="text-cream-100/60 text-xs mt-2">2:14 · Photorealistic</p>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Thumbnail grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(2, 6).map((img, i) => (
              <button
                key={i}
                onClick={() => setLightbox(img)}
                className="relative aspect-[4/3] overflow-hidden rounded-card group cursor-pointer"
              >
                <img src={img} alt={`${project.title} - view ${i + 3}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-xs uppercase tracking-widest font-semibold">View</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-espresso/95 z-50 flex items-center justify-center p-6 cursor-zoom-out animate-fade-up"
          >
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-gold text-white hover:text-espresso flex items-center justify-center transition-colors text-2xl"
            >
              ×
            </button>
            <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-card" />
          </div>
        )}
      </section>

      {/* CHALLENGE → SOLUTION narrative */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>The Challenge</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-4xl text-heading mb-6 leading-tight">
                {project.client} needed a {project.category.toLowerCase()} space that worked as hard as the team behind it
              </h2>
              <p className="text-text-gray leading-relaxed">
                The existing space was a generic shell — under-utilised, acoustically poor, and visually disconnected from the brand. The brief was simple: create a {project.category.toLowerCase()} environment that supports the daily work of the team, impresses visiting clients, and can flex as the business grows over the next five years.
              </p>
            </div>
            <div>
              <div className="eyebrow no-line mb-5">
                <span className="w-8 h-px bg-gold inline-block" />
                <span>Our Solution</span>
              </div>
              <p className="text-text-gray leading-relaxed mb-6">
                We designed a layered scheme that prioritises natural light, considered materials and acoustic comfort. Every fixture, finish and fitting was prototyped in our 3D Studio before procurement, which reduced on-site revisions to near zero and delivered the project one week ahead of schedule.
              </p>
              <ul className="space-y-3">
                {features.map((f) => (
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

      {/* STATS BAND */}
      <section className="section-espresso py-16 relative overflow-hidden">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "12", label: "Weeks Duration" },
              { number: "4,200", label: "Square Feet" },
              { number: "0", label: "Mid-Build Changes" },
              { number: "1 wk", label: "Delivered Early" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-serif text-4xl lg:text-5xl text-gold font-semibold">{s.number}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-cream-100/70 mt-2">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHARE & BOOKMARK */}
      <section className="section-cream py-12">
        <div className="container-x flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gold font-semibold mb-2">Share This Project</p>
            <h3 className="font-serif text-2xl text-heading">Inspire someone with this work</h3>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${project.title} - https://wpinterior.com/portfolio/${project.id}/`)}`}
              target="_blank"
              rel="noopener"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-text-gray hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <IconWhatsapp className="w-4 h-4" />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=https://wpinterior.com/portfolio/${project.id}/`}
              target="_blank"
              rel="noopener"
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-text-gray hover:bg-[#0a66c2] hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.37V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.78C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.78 24h20.43c.99 0 1.79-.77 1.79-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent(project.title)}`}
              className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-text-gray hover:bg-gold hover:text-white transition-colors"
            >
              <IconShare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* COMMERCIAL GALLERY WITH FILTER */}
      <section className="section-white py-20 lg:py-28">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="eyebrow no-line justify-center inline-flex mb-5"><span>Commercial Gallery</span></div>
            <h2 className="font-serif text-3xl lg:text-4xl text-heading">
              More <em className="text-emphasis font-medium">Projects</em>
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {[
              { id: "all", label: "All Projects", count: portfolio.length },
              { id: "residential", label: "Residential", count: portfolio.filter((p) => p.categorySlug === "residential").length },
              { id: "commercial", label: "Commercial", count: portfolio.filter((p) => p.categorySlug === "commercial").length },
              { id: "hospitality", label: "Hospitality", count: portfolio.filter((p) => p.categorySlug === "hospitality").length },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab(c.id as never)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-widest transition-all",
                  activeTab === c.id
                    ? "bg-espresso text-cream-100 shadow-md"
                    : "bg-cream-50 text-espresso/70 hover:bg-espresso/5 border border-border"
                )}
              >
                {c.label}
                <span className="ml-2 text-[10px] opacity-70">({c.count})</span>
              </button>
            ))}
          </div>

          {/* Filtered grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.filter((p) => p.id !== project.id).map((p) => (
              <article
                key={p.id}
                className="group relative overflow-hidden rounded-card cursor-pointer"
                onClick={() => onNavigate("project", String(p.id))}
              >
                <img
                  src={p.image}
                  alt={`${p.title} – ${p.category} interior design project in ${p.location}`}
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/95 via-espresso/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-gold text-[10px] uppercase tracking-[0.25em] font-semibold">{p.category}</span>
                  <h3 className="font-serif text-2xl text-white mt-2">{p.title}</h3>
                  <p className="text-cream-100/70 text-xs mt-2">{p.location} · {p.year}</p>
                </div>
                <div className="absolute top-4 right-4 bg-gold text-espresso text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  View Project
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="section-cream py-20 lg:py-28">
          <div className="container-x">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="eyebrow no-line justify-center inline-flex mb-5"><span>Related Projects</span></div>
              <h2 className="font-serif text-3xl text-heading">
                More {project.category} <em className="text-emphasis font-medium">Work</em>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <article
                  key={p.id}
                  className="group cursor-pointer"
                  onClick={() => onNavigate("project", String(p.id))}
                >
                  <div className="overflow-hidden rounded-card mb-4 aspect-[4/3]">
                    <img
                      src={p.image}
                      alt={`${p.title} – ${p.category} interior design project in ${p.location}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest mb-2">
                    <span className="text-gold font-semibold">{p.category}</span>
                    <span className="w-1 h-1 rounded-full bg-text-gray/40" />
                    <span className="text-text-gray">{p.location}</span>
                  </div>
                  <h3 className="font-serif text-xl text-heading group-hover:text-gold transition-colors">{p.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="section-espresso py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={project.image} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container-x relative text-center max-w-3xl">
          <h2 className="font-serif text-4xl lg:text-5xl text-white mb-6 leading-[1.1]">
            Start your <em className="text-gold not-italic font-medium">own</em> project
          </h2>
          <p className="text-cream-100/70 text-lg leading-relaxed mb-10">
            Book a free consultation with a senior designer. We'll listen, share initial ideas, and recommend the right path forward.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate("consultation")} className="btn btn-gold">
              BOOK FREE CONSULTATION
              <IconArrowRight className="w-3.5 h-3.5" />
            </button>
            <a
              href={`https://wa.me/${SITE.phone.replace(/[^0-9+]/g, "")}?text=Hi! I'd like to discuss a project.`}
              target="_blank"
              rel="noopener"
              className="btn btn-outline-light"
            >
              <IconWhatsapp className="w-4 h-4" />
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
