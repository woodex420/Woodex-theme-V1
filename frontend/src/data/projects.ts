export interface Project {
  slug: string;
  title: string;
  category: 'residential' | 'office' | 'retail' | 'commercial';
  location: string;
  area: string;
  year: string;
  image: string;
  excerpt: string;
  brief: string;
  challenge: string;
  solution: string;
  materials: string[];
  services: string[];
  featured?: boolean;
}

export const PROJECTS: Project[] = [
  {
    slug: 'family-residence-model-town',
    title: 'Modern Family Residence',
    category: 'residential',
    location: 'Model Town, Lahore',
    area: 'Approx. 1 Kanal',
    year: '2024',
    image: '/images/project-living.jpg',
    excerpt:
      'A warm, wood-led family interior planned around daily routines, storage and layered lighting.',
    brief:
      'The family wanted a home that felt warm and contemporary rather than formal — with practical storage, durable finishes and spaces that work for both children and guests.',
    challenge:
      'The existing layout produced dark corridors and under-used transitional areas, and standard furniture sizes did not fit the main living wall.',
    solution:
      'Woodex re-planned the living and dining zones around a continuous walnut slat feature wall with integrated storage, layered cove and accent lighting, and custom-sized furniture built to the exact wall dimensions.',
    materials: ['Walnut veneer slats', 'Brushed brass details', 'Linen upholstery', 'Honed marble'],
    services: ['Residential Interior Design', 'Custom Furniture', 'Lighting Planning'],
    featured: true,
  },
  {
    slug: 'corporate-office-gulberg',
    title: 'Corporate Office Floor',
    category: 'office',
    location: 'Gulberg, Lahore',
    area: 'Approx. 6,000 sq ft',
    year: '2024',
    image: '/images/project-office.jpg',
    excerpt:
      'A complete workplace planned around team workflow — workstations, meeting rooms and a custom reception.',
    brief:
      'A growing company needed a full office floor that balanced open collaboration with quiet focus zones, and a reception that presented a professional first impression.',
    challenge:
      'The floor plate had deep areas with limited natural light, and cable management across 40+ workstations required early coordination.',
    solution:
      'Workstations were planned in team clusters near the glazing line, enclosed meeting and manager rooms sit at the core, and all desks were custom-manufactured with integrated cable routing and matching storage.',
    materials: ['Oak-tone laminates', 'Powder-coated frames', 'Acoustic panels', 'Warm LED systems'],
    services: ['Office Interior Design', 'Custom Office Furniture', 'Space Planning'],
    featured: true,
  },
  {
    slug: 'boutique-retail-store',
    title: 'Boutique Retail Store',
    category: 'retail',
    location: 'DHA, Lahore',
    area: 'Approx. 1,200 sq ft',
    year: '2023',
    image: '/images/project-retail.jpg',
    excerpt:
      'A retail interior designed around product discovery — displays, counters and customer flow.',
    brief:
      'The retailer wanted a store that made collections easy to browse, with display capacity that could adapt between seasons and a counter zone that anchored the space.',
    challenge:
      'The narrow shop front limited window display depth, and stock storage had to be absorbed without shrinking the sales floor.',
    solution:
      'A clear circulation loop was planned around perimeter display shelving and central feature tables, with a custom cash counter concealing storage and integrated signage lighting to pull sightlines through the store.',
    materials: ['Blackened steel', 'Oak display units', 'Track spotlighting', 'Polished concrete'],
    services: ['Retail Interior Design', 'Custom Display Units', 'Lighting Concepts'],
    featured: true,
  },
  {
    slug: 'walnut-kitchen-residence',
    title: 'Walnut Kitchen & Dining',
    category: 'residential',
    location: 'Bahria Town, Lahore',
    area: 'Approx. 450 sq ft',
    year: '2024',
    image: '/images/project-kitchen.jpg',
    excerpt:
      'A minimal kitchen in walnut and stone, with custom cabinetry planned around the family’s cooking routine.',
    brief:
      'The clients wanted a clean, handle-less kitchen with generous preparation space, concealed storage and a dining connection for everyday family use.',
    challenge:
      'Services routing for appliances and a structural column interrupted the ideal cabinet run.',
    solution:
      'Cabinetry was custom-manufactured to absorb the column into a tall storage unit, appliances were stacked on a dedicated services wall, and a marble-topped island doubles as preparation and casual dining space.',
    materials: ['Walnut veneer', 'Engineered stone', 'Matte lacquer', 'Brass hardware'],
    services: ['Residential Interior Design', 'Custom Cabinetry', '3D Visualization'],
    featured: true,
  },
  {
    slug: 'executive-boardroom-suite',
    title: 'Executive Boardroom Suite',
    category: 'commercial',
    location: 'M.M. Alam Road, Lahore',
    area: 'Approx. 900 sq ft',
    year: '2023',
    image: '/images/project-dining.jpg',
    excerpt:
      'A hospitality-grade boardroom and lounge with custom conference furniture and warm brass detailing.',
    brief:
      'A services firm needed a boardroom that could host client presentations with the atmosphere of a private lounge rather than a generic meeting room.',
    challenge:
      'The room proportions were long and narrow, and presentation technology needed to disappear when not in use.',
    solution:
      'A custom boat-shaped conference table anchors the room, wall paneling conceals the display and cabling, and a lounge corner with soft seating supports informal discussions before and after meetings.',
    materials: ['Smoked oak', 'Brass inlays', 'Velvet upholstery', 'Fluted glass'],
    services: ['Commercial Interior Design', 'Custom Conference Furniture'],
    featured: false,
  },
  {
    slug: 'craft-furniture-workshop',
    title: 'Custom Furniture Commission',
    category: 'commercial',
    location: 'Ferozepur Road, Lahore',
    area: 'Multiple pieces',
    year: '2024',
    image: '/images/project-workshop.jpg',
    excerpt:
      'A set of purpose-built solid-wood pieces designed and manufactured for a single coordinated interior.',
    brief:
      'The client commissioned a coordinated furniture set — dining table, sideboards and shelving — designed to match the proportions and finishes of their new interior.',
    challenge:
      'Each piece had to align exactly with the room’s datum lines and lighting positions decided during the interior design stage.',
    solution:
      'Woodex manufactured every item in its own workshop to the interior drawings, finishing each surface to the same veneer and hardware specification used across the project.',
    materials: ['Solid ash and walnut', 'Natural oil finishes', 'Brass fittings'],
    services: ['Custom Furniture', 'Carpenter & Woodwork'],
    featured: false,
  },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
