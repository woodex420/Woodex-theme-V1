import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';

/* ── Builder ── */
import { BuilderProvider } from '@/lib/builderStore';
import LivePageBuilder from '@/components/builder/LivePageBuilder';

/* ── Public site pages ── */
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetail = lazy(() => import('@/pages/ServiceDetail'));
const Projects = lazy(() => import('@/pages/Projects'));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail'));
const Insights = lazy(() => import('@/pages/Insights'));
const ArticleDetail = lazy(() => import('@/pages/ArticleDetail'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const PrivacyPolicy = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.PrivacyPolicy })));
const Terms = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Terms })));

/* ── Auth ── */
const Login = lazy(() => import('@/pages/Login'));

/* ── Dashboard layout + pages ── */
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DashboardOverview = lazy(() => import('@/pages/dashboard/DashboardOverview'));
const DashboardServices = lazy(() => import('@/pages/dashboard/DashboardServices'));
const DashboardProjects = lazy(() => import('@/pages/dashboard/DashboardProjects'));
const DashboardBlog = lazy(() => import('@/pages/dashboard/DashboardBlog'));
const DashboardLeads = lazy(() => import('@/pages/dashboard/DashboardLeads'));
const DashPlaceholderPages = lazy(() => import('@/pages/dashboard/PlaceholderPages'));
const DashPlaceholderHeaderFooter = lazy(() => import('@/pages/dashboard/PlaceholderHeaderFooter'));
const DashPlaceholderTheme = lazy(() => import('@/pages/dashboard/PlaceholderTheme'));
const DashPlaceholderBuilder = lazy(() => import('@/pages/dashboard/PlaceholderBuilder'));
const DashPlaceholderTestimonials = lazy(() => import('@/pages/dashboard/PlaceholderTestimonials'));
const DashPlaceholderSupport = lazy(() => import('@/pages/dashboard/PlaceholderSupport'));
const DashPlaceholderMedia = lazy(() => import('@/pages/dashboard/PlaceholderMedia'));
const DashPlaceholderUsers = lazy(() => import('@/pages/dashboard/PlaceholderUsers'));
const DashPlaceholderSocial = lazy(() => import('@/pages/dashboard/PlaceholderSocial'));
const DashPlaceholderSettings = lazy(() => import('@/pages/dashboard/PlaceholderSettings'));
const DashPlaceholderQA = lazy(() => import('@/pages/dashboard/PlaceholderQA'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
      <div className="w-12 h-12 border border-[#C9A84C] rotate-45 flex items-center justify-center animate-pulse">
        <span className="font-display text-[#C9A84C] text-xl -rotate-45">W</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BuilderProvider>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public site (Navbar + Footer + Live Builder) ── */}
          <Route
            element={
              <LivePageBuilder>
                <Layout />
              </LivePageBuilder>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/insights/:slug" element={<ArticleDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ── Login (standalone, no site chrome, no builder) ── */}
          <Route path="/login" element={<Login />} />

          {/* ── Dashboard (sidebar layout + nested pages, no builder) ── */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardOverview />} />
            <Route path="pages" element={<DashPlaceholderPages />} />
            <Route path="header-footer" element={<DashPlaceholderHeaderFooter />} />
            <Route path="theme" element={<DashPlaceholderTheme />} />
            <Route path="builder" element={<DashPlaceholderBuilder />} />
            <Route path="projects" element={<DashboardProjects />} />
            <Route path="services" element={<DashboardServices />} />
            <Route path="blog" element={<DashboardBlog />} />
            <Route path="testimonials" element={<DashPlaceholderTestimonials />} />
            <Route path="support" element={<DashPlaceholderSupport />} />
            <Route path="leads" element={<DashboardLeads />} />
            <Route path="media" element={<DashPlaceholderMedia />} />
            <Route path="users" element={<DashPlaceholderUsers />} />
            <Route path="social" element={<DashPlaceholderSocial />} />
            <Route path="settings" element={<DashPlaceholderSettings />} />
            <Route path="qa" element={<DashPlaceholderQA />} />
          </Route>
        </Routes>
      </Suspense>
    </BuilderProvider>
  );
}
