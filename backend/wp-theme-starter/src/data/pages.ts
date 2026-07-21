// Page content for the WP Interior showcase site
// Mirrors the actual page templates defined in the WordPress theme

export type Service = {
  icon: string;
  title: string;
  description: string;
  features: string[];
  slug: string;
};

export type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  categorySlug: string;
  client: string;
  location: string;
  year: string;
  image: string;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  rating: number;
};

export const services: Service[] = [
  {
    icon: "residential",
    title: "Residential Design",
    description:
      "Transform your home into a sanctuary of refined elegance where every corner tells a story of craftsmanship.",
    features: ["Personalized concepts", "3D visualization", "Bespoke furniture", "Material curation"],
    slug: "residential",
  },
  {
    icon: "commercial",
    title: "Commercial Spaces",
    description:
      "Elevate your brand environment with interiors that inspire productivity, connection, and lasting impressions.",
    features: ["Brand-aligned design", "Workflow optimization", "Acoustic planning", "Wayfinding"],
    slug: "commercial",
  },
  {
    icon: "furniture",
    title: "Bespoke Furniture",
    description:
      "Hand-crafted pieces designed exclusively for your space — built to last generations, made to your exact taste.",
    features: ["Custom joinery", "Premium materials", "Limited editions", "White-glove delivery"],
    slug: "furniture",
  },
  {
    icon: "lighting",
    title: "Lighting Design",
    description:
      "Layered lighting schemes that sculpt space, evoke mood, and reveal the true character of every surface.",
    features: ["Ambient layers", "Smart controls", "Fixture sourcing", "Energy efficiency"],
    slug: "lighting",
  },
  {
    icon: "color",
    title: "Color & Material",
    description:
      "Curated palettes and tactile material boards — the soul of every interior begins with the right finish.",
    features: ["Mood boards", "Sample library", "Trend forecasting", "Texture mapping"],
    slug: "color",
  },
  {
    icon: "space",
    title: "Space Planning",
    description:
      "Considered layouts that unlock the full potential of every square foot — circulation, flow, and balance.",
    features: ["Floor plans", "Furniture layout", "Traffic flow", "Ergonomic analysis"],
    slug: "space",
  },
];

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    title: "Linen & Stone Residence",
    category: "Residential",
    categorySlug: "residential",
    client: "Private Client",
    location: "Manhattan, NY",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
  {
    id: 2,
    title: "Atelier 9 Office",
    category: "Commercial",
    categorySlug: "commercial",
    client: "Atelier 9",
    location: "Dubai, UAE",
    year: "2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    id: 3,
    title: "Coastal Villa Retreat",
    category: "Residential",
    categorySlug: "residential",
    client: "Private Client",
    location: "Mykonos, Greece",
    year: "2023",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  },
  {
    id: 4,
    title: "The Bridal Suite",
    category: "Hospitality",
    categorySlug: "hospitality",
    client: "Maison Lumière",
    location: "Paris, France",
    year: "2024",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    id: 5,
    title: "Oakridge Kitchen",
    category: "Residential",
    categorySlug: "residential",
    client: "Private Client",
    location: "London, UK",
    year: "2023",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
  {
    id: 6,
    title: "Milan Showroom",
    category: "Commercial",
    categorySlug: "commercial",
    client: "Casa Verde",
    location: "Milan, Italy",
    year: "2024",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  },
  {
    id: 7,
    title: "Sunset Penthouse",
    category: "Residential",
    categorySlug: "residential",
    client: "Private Client",
    location: "Los Angeles, USA",
    year: "2024",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  },
  {
    id: 8,
    title: "Heritage Hotel Lobby",
    category: "Hospitality",
    categorySlug: "hospitality",
    client: "The Astor Group",
    location: "Vienna, Austria",
    year: "2023",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: 9,
    title: "Studio Ciel",
    category: "Commercial",
    categorySlug: "commercial",
    client: "Studio Ciel",
    location: "Copenhagen",
    year: "2024",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  },
];

export const team: TeamMember[] = [
  {
    name: "Elena Marchetti",
    role: "Founder & Creative Director",
    bio: "Twenty years shaping spaces for private collectors and global brands across three continents.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
  },
  {
    name: "Hiroshi Tanaka",
    role: "Head of 3D Visualization",
    bio: "Former architectural renderer for Foster + Partners. Brings blueprints to life before a single wall is built.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80",
  },
  {
    name: "Aaliyah Bennett",
    role: "Senior Interior Designer",
    bio: "Specialist in residential commissions. Trained at Central Saint Martins with a passion for tactile materials.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
  },
  {
    name: "Marcus Lindqvist",
    role: "Project Director",
    bio: "Coordinates multi-site rollouts with the calm of a Swedish winter. Twenty hospitality projects delivered.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Working with this team transformed not just our home, but the way we live in it. Every detail, every finish, every light — considered.",
    name: "Sarah Bennett",
    role: "Homeowner · Manhattan",
    rating: 5,
  },
  {
    quote:
      "They translated our brand into a space our team is genuinely proud to work in. Clients notice the moment they walk in.",
    name: "David Lin",
    role: "CEO · Atelier 9",
    rating: 5,
  },
  {
    quote:
      "The 3D walkthroughs let us see our hotel lobby before construction. It saved us six months of revisions.",
    name: "Isabella Rossi",
    role: "Director · Casa Verde",
    rating: 5,
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "Deep dive into your lifestyle, brand, and aspirations through on-site consultation.",
  },
  {
    step: "02",
    title: "Concept",
    description: "Mood boards, material samples, and 3D walkthroughs bring the vision into focus.",
  },
  {
    step: "03",
    title: "Design",
    description: "Detailed drawings, custom specifications, and curated procurement for every element.",
  },
  {
    step: "04",
    title: "Delivery",
    description: "White-glove installation, styling, and final reveal — every detail in place.",
  },
];

export const faqs = [
  {
    q: "How long does a typical residential project take?",
    a: "Most full-home residential commissions run between 8 and 14 months from first consultation to final styling, depending on scope and construction involvement.",
  },
  {
    q: "Do you work internationally?",
    a: "Yes. We have delivered projects across 18 countries. Our 3D Studio and on-site liaison network allow us to manage commissions remotely with the same fidelity as in-person work.",
  },
  {
    q: "What is the investment range for a project?",
    a: "Residential projects typically begin at $250,000 (design fees + furnishings) and scale with scope. Commercial commissions are quoted per brief.",
  },
  {
    q: "Can I engage you for 3D visualization only?",
    a: "Absolutely. Our 3D Studio accepts standalone visualization commissions for architects, developers, and homeowners.",
  },
  {
    q: "Do you handle construction?",
    a: "We collaborate with vetted general contractors and can manage construction on your behalf as part of a full-service engagement.",
  },
];

export const stats = [
  { number: "15+", label: "Years of Practice" },
  { number: "320+", label: "Projects Delivered" },
  { number: "18", label: "Countries Served" },
  { number: "24", label: "Design Awards" },
];

export const blogPosts = [
  {
    id: 1,
    title: "The Quiet Return of Linen",
    excerpt:
      "Why understated natural fabrics are reclaiming the modern interior — and how to layer them with intention.",
    category: "Materials",
    date: "Mar 12, 2025",
    readTime: "6 min",
    image: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
  },
  {
    id: 2,
    title: "Lighting as Architecture",
    excerpt:
      "A guide to layered lighting design that sculpts space and reveals material — beyond fixtures and fittings.",
    category: "Lighting",
    date: "Feb 28, 2025",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80",
  },
  {
    id: 3,
    title: "3D Walkthroughs: The New Blueprint",
    excerpt:
      "How photorealistic visualization is changing the way clients experience design before a wall is built.",
    category: "3D Studio",
    date: "Feb 14, 2025",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  },
];
