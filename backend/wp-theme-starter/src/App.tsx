import { useEffect, useState } from "react";
import { Header, Footer } from "./components/SiteChrome";
import { HomePage } from "./components/HomePage";
import { AboutPage, StudioPage, PortfolioPage, BlogListPage, ContactPage } from "./components/Pages";
import { ThemeFilesPage } from "./components/ThemeFilesPage";
import { ServicesIndexPage, ServicePage, ConsultationPage } from "./components/ServiceComponents";
import { BlogPostPage } from "./components/BlogPostPage";
import { ProjectPage } from "./components/ProjectPage";
import { SEO } from "./components/SEO";
import { pageSEO } from "./data/seo";
import { serviceList } from "./data/seo";
import { LivePageBuilder as BuilderWrapper } from "./components/LivePageBuilder";
import { BuilderProvider } from "./lib/builderStore.tsx";

// Lazy import AdminApp to avoid loading it on every page
import { lazy, Suspense } from "react";
const AdminApp = lazy(() =>
  import("./components/admin/AdminApp").then((m) => ({ default: m.AdminApp }))
);
// Top-level error boundary imported
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LiveChatWidget } from "./components/LiveChatWidget";

export type Route = { name: string; slug?: string };

function readHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash) return { name: "home" };
  const [name, ...rest] = hash.split("/");
  const slug = rest.join("/") || undefined;
  return { name, slug };
}



function writeHash(r: Route) {
  const h = r.slug ? `#/${r.name}/${r.slug}` : `#/${r.name}`;
  if (window.location.hash !== h) {
    window.history.pushState(null, "", h);
  }
}

function AdminLoading() {
  return (
    <div className="min-h-screen bg-espresso flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center mx-auto mb-4 shadow-2xl">
          <span className="text-espresso font-serif text-2xl font-semibold">W</span>
        </div>
        <div className="text-cream-100/70 text-sm">Loading admin dashboard...</div>
      </div>
    </div>
  );
}

export default function App() {
  // Initialize route synchronously from the current hash
  const [route, setRoute] = useState<Route>(() => {
    try {
      return readHash();
    } catch {
      return { name: "home" };
    }
  });

  useEffect(() => {
    const update = () => setRoute(readHash());
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [route]);

  // Admin route — render AdminApp separately
  // Use startsWith to catch "admin" and "admin/<subpage>"
  if (route.name === "admin" || route.name?.startsWith?.("admin")) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<AdminLoading />}>
          <AdminApp />
        </Suspense>
      </ErrorBoundary>
    );
  }

  const navigate = (name: string, slug?: string) => {
    const r = { name, slug };
    writeHash(r);
    setRoute(r);
  };

  // Determine the SEO payload for the current route
  const seo = getSEO(route);

  const renderPage = () => {
    switch (route.name) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "about":
        return <AboutPage onNavigate={navigate} />;
      case "services":
        return <ServicesIndexPage onNavigate={navigate} />;
      case "service":
        if (route.slug) return <ServicePage slug={route.slug} onNavigate={navigate} />;
        return <ServicesIndexPage onNavigate={navigate} />;
      case "consultation":
        return <ConsultationPage slug={route.slug} onNavigate={navigate} />;
      case "studio":
        return <StudioPage onNavigate={navigate} />;
      case "portfolio":
        return <PortfolioPage onNavigate={navigate} />;
      case "project":
        if (route.slug) return <ProjectPage id={route.slug} onNavigate={navigate} />;
        return <PortfolioPage onNavigate={navigate} />;
      case "blog":
        return <BlogListPage onNavigate={navigate} />;
      case "post":
        if (route.slug) return <BlogPostPage slug={route.slug} onNavigate={navigate} />;
        return <BlogListPage onNavigate={navigate} />;
      case "contact":
        return <ContactPage />;
      case "files":
        return <ThemeFilesPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <BuilderProvider>
      <BuilderWrapper autoActivate={route.name !== "admin"}>
        <div className="min-h-screen bg-cream-50">
          <SEO page={seo} />
          <Header current={route.name as never} onNavigate={(n) => navigate(n)} />
          {renderPage()}
          <Footer onNavigate={navigate} />
          <LiveChatWidget />
        </div>
      </BuilderWrapper>
    </BuilderProvider>
  );
}

function getSEO(route: Route) {
  // service slug
  if (route.name === "service" && route.slug) {
    const s = serviceList.find((x) => x.slug === route.slug);
    if (s) {
      return {
        title: s.metaTitle,
        description: s.metaDescription,
        canonical: `https://wpinterior.com/services/${s.slug}/`,
        keywords: [s.name, s.h1Keyword, "interior design Pakistan"],
        ogImage: s.heroImage,
        schema: "Service" as const,
      };
    }
  }

  // blog post slug
  if (route.name === "post" && route.slug) {
    const { blogPosts } = require("./data/seo");
    const p = blogPosts.find((x: { slug: string }) => x.slug === route.slug);
    if (p) {
      return {
        title: p.metaTitle,
        description: p.metaDescription,
        canonical: `https://wpinterior.com/journal/${p.slug}/`,
        keywords: [p.category, p.title, "interior design blog Pakistan"],
        ogImage: p.image,
        schema: "Article" as const,
      };
    }
  }

  return pageSEO[route.name] || pageSEO.home;
}
