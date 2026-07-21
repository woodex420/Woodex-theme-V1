export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  icon: string; // lucide icon name
  image: string;
  excerpt: string;
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string[];
  sections: { heading: string; items?: string[]; body?: string }[];
  cta: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'interior-design-lahore',
    title: 'Interior Design',
    shortTitle: 'Interior Design',
    icon: 'Armchair',
    image: '/images/hero.jpg',
    excerpt:
      'Complete interior design services for homeowners and businesses across Lahore — planned around purpose, area, style and function.',
    metaTitle: 'Interior Designer in Lahore | Woodex Interior',
    metaDesc:
      'Looking for an interior designer in Lahore? Woodex creates residential, office, retail and commercial interiors with custom furniture solutions.',
    h1: 'Interior Designer in Lahore for Functional, Personalized Spaces',
    intro: [
      'Woodex Interior provides interior design services for homeowners and businesses across Lahore. We plan spaces around their purpose, available area, preferred style and functional requirements.',
      'Our design scope can include layout planning, color and material selection, lighting direction, furniture planning, storage solutions, decorative elements and project coordination.',
    ],
    sections: [
      {
        heading: 'Interior Design Services',
        items: [
          'Concept development',
          'Space planning',
          'Furniture layouts',
          'Color and material selection',
          'Lighting planning',
          'Ceiling and feature-wall concepts',
          'Custom furniture design',
          '3D interior visualization',
          'Residential interiors',
          'Commercial interiors',
        ],
      },
      {
        heading: 'What Clients Receive',
        body: 'Deliverables are tailored to each package and can include a site survey, concept or mood board, furniture layout, 2D drawings, 3D views, material schedule, furniture specifications, project estimate and execution supervision — agreed clearly before work begins.',
      },
    ],
    cta: 'Tell us about your space and request an interior design consultation.',
  },
  {
    slug: 'residential-interior-design-lahore',
    title: 'Residential Interior Design',
    shortTitle: 'Residential Interiors',
    icon: 'Home',
    image: '/images/project-living.jpg',
    excerpt:
      'Personalized interior solutions for living rooms, bedrooms, kitchens, dining spaces, home offices and complete residences.',
    metaTitle: 'Home Interior Design in Lahore | Woodex Interior',
    metaDesc:
      'Personalized home interior design in Lahore for living rooms, bedrooms, kitchens and complete residences. Plan your space with Woodex Interior.',
    h1: 'Home and Residential Interior Design in Lahore',
    intro: [
      'Your home should reflect how you live, not simply follow a design template.',
      'Woodex Interior creates personalized residential environments by considering family requirements, room dimensions, circulation, storage, lighting, furniture and preferred visual style.',
    ],
    sections: [
      {
        heading: 'Residential Spaces We Design',
        items: [
          'Living rooms',
          'Drawing rooms',
          'Bedrooms',
          'Dining spaces',
          'Kitchens',
          'Home offices',
          'Children’s rooms',
          'TV lounges',
          'Entrance areas',
          'Complete homes and apartments',
        ],
      },
      {
        heading: 'A More Practical Home',
        body: 'Good home design improves everyday activities. Furniture should fit the available area, storage should be accessible, lighting should support different uses and materials should be suitable for long-term maintenance. Woodex brings these requirements together to create a home that feels comfortable, organized and visually connected.',
      },
    ],
    cta: 'Share your house plan, room photographs or site location to begin your residential interior project.',
  },
  {
    slug: 'office-interior-design-lahore',
    title: 'Office Interior Design',
    shortTitle: 'Office Interiors',
    icon: 'Building2',
    image: '/images/project-office.jpg',
    excerpt:
      'Workspaces planned around team requirements, circulation, privacy, storage, collaboration and brand identity.',
    metaTitle: 'Office Interior Design in Lahore | Woodex Interior',
    metaDesc:
      'Plan a productive workplace with Woodex office interior design in Lahore. Workstations, meeting rooms, receptions and custom office furniture.',
    h1: 'Office Interior Design in Lahore',
    intro: [
      'An office should support productivity, communication and employee comfort while presenting a professional image to clients.',
      'Woodex Interior plans office environments around team size, workflow, privacy, storage, technology requirements and future growth.',
    ],
    sections: [
      {
        heading: 'Office Spaces We Design',
        items: [
          'Reception and waiting areas',
          'Open workstations',
          'Executive offices',
          'Manager rooms',
          'Meeting and conference rooms',
          'Breakout spaces',
          'Storage areas',
          'Training rooms',
          'Collaborative work areas',
          'Home offices',
        ],
      },
      {
        heading: 'Office Furniture Integration',
        body: 'Woodex can coordinate office layouts with customized workstations, executive desks, reception counters, conference tables, storage units and other furniture — so dimensions and design are planned around the actual office rather than selected later as unrelated standard pieces.',
      },
      {
        heading: 'Information Needed for a Proposal',
        items: [
          'Office location',
          'Total covered area',
          'Number of employees',
          'Required rooms',
          'Existing drawings',
          'Furniture requirements',
          'Preferred style',
          'Expected completion date',
        ],
      },
    ],
    cta: 'Request an office site review and workplace planning discussion.',
  },
  {
    slug: 'commercial-interior-design-lahore',
    title: 'Commercial Interior Design',
    shortTitle: 'Commercial Interiors',
    icon: 'Store',
    image: '/images/project-dining.jpg',
    excerpt:
      'Interior design solutions for customer-facing and operational commercial environments across Lahore.',
    metaTitle: 'Commercial Interior Design in Lahore | Woodex',
    metaDesc:
      'Commercial interior design in Lahore for offices, stores, showrooms and customer-facing spaces. Discuss your project with Woodex Interior.',
    h1: 'Commercial Interior Design in Lahore',
    intro: [
      'Commercial interiors must support business operations while creating the right experience for employees, customers and visitors.',
      'Woodex Interior develops commercial environments around circulation, brand presentation, customer requirements, storage, lighting, furniture and operational efficiency.',
    ],
    sections: [
      {
        heading: 'Commercial Project Types',
        items: [
          'Corporate offices',
          'Retail outlets',
          'Showrooms',
          'Service centers',
          'Clinics',
          'Salons',
          'Restaurants and cafés',
          'Educational environments',
          'Reception areas',
        ],
      },
    ],
    cta: 'Contact Woodex with your property type, location, area and required opening date.',
  },
  {
    slug: 'retail-shop-interior-design-lahore',
    title: 'Retail & Shop Interior Design',
    shortTitle: 'Retail & Shop Interiors',
    icon: 'ShoppingBag',
    image: '/images/project-retail.jpg',
    excerpt:
      'Store layouts, product displays, lighting, counters, signage integration and customer-flow planning.',
    metaTitle: 'Shop & Retail Interior Design Lahore | Woodex',
    metaDesc:
      'Retail and shop interior design in Lahore, including layouts, counters, display units, lighting, branding and custom furniture.',
    h1: 'Shop and Retail Interior Design in Lahore',
    intro: [
      'A retail interior should make products easy to discover while creating a clear, memorable expression of the brand.',
      'Woodex plans shop and retail environments around customer movement, product visibility, display capacity, lighting, counter placement, storage and brand communication.',
    ],
    sections: [
      {
        heading: 'Retail Design Services',
        items: [
          'Store layout planning',
          'Display-unit design',
          'Cash and reception counters',
          'Product shelving',
          'Feature displays',
          'Lighting concepts',
          'Storage integration',
          'Signage coordination',
          'Custom retail furniture',
          'Shopfront concepts',
        ],
      },
    ],
    cta: 'Planning a new shop or redesigning an existing outlet? Send Woodex your floor plan and product requirements.',
  },
  {
    slug: '3d-interior-design-space-planning-lahore',
    title: '3D Design & Space Planning',
    shortTitle: '3D Design & Planning',
    icon: 'Boxes',
    image: '/images/service-3d.jpg',
    excerpt:
      'Layouts and visual concepts that help you understand the proposed space before execution begins.',
    metaTitle: '3D Interior Design & Space Planning Lahore | Woodex',
    metaDesc:
      'Understand your proposed interior through space planning, furniture layouts and 3D interior design services in Lahore.',
    h1: '3D Interior Design and Space Planning in Lahore',
    intro: [
      'Space planning determines how people, furniture and activities fit within the available area.',
      'Woodex develops layouts that consider circulation, room functions, furniture dimensions, storage and visual balance. Where included in the agreed package, 3D visualization helps clients understand the proposed colors, materials, furniture and lighting before execution.',
    ],
    sections: [
      {
        heading: 'Available Deliverables',
        items: [
          'Measured site plan',
          'Furniture layout',
          'Floor plan',
          'Ceiling concept',
          'Lighting layout',
          'Wall elevations',
          '3D interior views',
          'Material schedule',
          'Furniture specifications',
        ],
      },
    ],
    cta: 'Send us your floor plan to discuss a space-planning or visualization package.',
  },
  {
    slug: 'custom-furniture-lahore',
    title: 'Custom Furniture',
    shortTitle: 'Custom Furniture',
    icon: 'Sofa',
    image: '/images/project-workshop.jpg',
    excerpt:
      'Purpose-built furniture designed according to the measurements, function and visual language of your interior.',
    metaTitle: 'Custom Furniture in Lahore | Woodex Interior',
    metaDesc:
      'Custom home and office furniture in Lahore, designed around your space, function and preferred finish. Request a quotation from Woodex.',
    h1: 'Custom Furniture Designed for Your Space',
    intro: [
      'Woodex creates customized furniture for residential and commercial environments. Each item is planned according to its required function, dimensions, storage capacity, material and design direction.',
      'Designing the furniture alongside the interior creates better proportions, stronger visual consistency and more effective use of space.',
    ],
    sections: [
      {
        heading: 'Custom Furniture Categories',
        items: [
          'Executive tables',
          'Workstations',
          'Conference tables',
          'Reception counters',
          'Storage cabinets',
          'Shelving and display units',
          'Wardrobes',
          'Beds and side tables',
          'TV and media units',
          'Dining tables',
          'Home-office furniture',
        ],
      },
      {
        heading: 'The Custom Furniture Process',
        items: [
          'Requirement discussion',
          'Site measurement',
          'Design development',
          'Material and finish selection',
          'Quotation approval',
          'Manufacturing',
          'Delivery and installation',
        ],
      },
    ],
    cta: 'Send your reference design, measurements or furniture requirements for a customized quotation.',
  },
  {
    slug: 'office-furniture-lahore',
    title: 'Office Furniture',
    shortTitle: 'Office Furniture',
    icon: 'LampDesk',
    image: '/images/service-office-furniture.jpg',
    excerpt:
      'Customized workstations, executive desks, conference tables, reception counters and office storage — made for your office.',
    metaTitle: 'Custom Office Furniture in Lahore | Woodex',
    metaDesc:
      'Custom office furniture in Lahore, including workstations, executive desks, conference tables, reception counters and office storage.',
    h1: 'Custom Office Furniture in Lahore',
    intro: [
      'Well-planned furniture improves how an office uses its available area.',
      'Woodex supplies customized office furniture designed around employee requirements, room dimensions, storage, cable management, working styles and the overall office interior.',
    ],
    sections: [
      {
        heading: 'Products',
        items: [
          'Executive office tables',
          'Manager desks',
          'Staff workstations',
          'Conference tables',
          'Reception desks',
          'Office storage',
          'Filing units',
          'Shelving',
          'Waiting-area furniture',
          'Custom office sofas',
        ],
      },
    ],
    cta: 'Request an office furniture layout and quotation.',
  },
  {
    slug: 'carpenter-services-lahore',
    title: 'Carpenter & Woodwork',
    shortTitle: 'Carpenter & Woodwork',
    icon: 'Hammer',
    image: '/images/project-workshop.jpg',
    excerpt:
      'Custom carpentry and interior woodwork — cabinets, wardrobes, doors, shelving, counters and detailed joinery.',
    metaTitle: 'Carpenter Services in Lahore | Woodex Interior',
    metaDesc:
      'Custom carpenter and interior woodwork services in Lahore — cabinets, wardrobes, shelving, counters and furniture woodwork by Woodex.',
    h1: 'Custom Carpenter and Interior Woodwork Services in Lahore',
    intro: [
      'Detailed woodwork gives an interior its finished character. Woodex provides custom carpentry coordinated with the overall design, so every joint, edge and surface belongs to the same visual language.',
    ],
    sections: [
      {
        heading: 'Woodwork Capabilities',
        items: [
          'Cabinets and kitchen woodwork',
          'Wardrobes and closets',
          'Shelving and display units',
          'Counters and reception desks',
          'Doors and paneling',
          'Furniture repair and refinishing',
        ],
      },
    ],
    cta: 'Share your woodwork requirements and site details for a quotation.',
  },
  {
    slug: 'turnkey-interior-solutions-lahore',
    title: 'Turnkey Interiors',
    shortTitle: 'Turnkey Interiors',
    icon: 'KeyRound',
    image: '/images/project-kitchen.jpg',
    excerpt:
      'From planning and materials to furniture and final installation — one coordinated project process.',
    metaTitle: 'Turnkey Interior Solutions in Lahore | Woodex',
    metaDesc:
      'Turnkey interior design and execution in Lahore. Woodex coordinates planning, materials, furniture and installation in one process.',
    h1: 'Turnkey Interior Design and Execution in Lahore',
    intro: [
      'From planning and materials to furniture and final installation, Woodex coordinates the agreed project scope through a single project process — giving you one point of responsibility from concept to completion.',
    ],
    sections: [
      {
        heading: 'What a Turnkey Scope Can Include',
        items: [
          'Design concept and space planning',
          'Material and finish selection',
          'Custom furniture manufacturing',
          'Site execution coordination',
          'Lighting and fixture installation',
          'Final review and handover',
        ],
      },
    ],
    cta: 'Discuss your site and timeline to scope a turnkey interior project.',
  },
  {
    slug: 'interior-renovation-lahore',
    title: 'Interior Renovation',
    shortTitle: 'Interior Renovation',
    icon: 'PaintRoller',
    image: '/images/project-bedroom.jpg',
    excerpt:
      'Planned renovation of existing homes, offices and commercial spaces — from assessment to finish.',
    metaTitle: 'Interior Renovation in Lahore | Woodex Interior',
    metaDesc:
      'Interior renovation services in Lahore for homes and offices — assessment, ceilings, flooring, painting, woodwork and schedules.',
    h1: 'Interior Renovation Services in Lahore',
    intro: [
      'A renovation should solve the problems of an existing space, not only refresh its surface. Woodex plans renovation work around the current condition of the property and the way the space needs to perform.',
    ],
    sections: [
      {
        heading: 'Renovation Scope',
        items: [
          'Existing-condition assessment',
          'Demolition scope',
          'Electrical work',
          'Ceiling changes',
          'Flooring',
          'Painting',
          'Furniture and woodwork',
          'Project schedule',
        ],
      },
    ],
    cta: 'Book a renovation assessment for your home or office.',
  },
  {
    slug: 'exterior-design-lahore',
    title: 'Exterior Design',
    shortTitle: 'Exterior Design',
    icon: 'Landmark',
    image: '/images/project-living.jpg',
    excerpt:
      'Front elevation and exterior design concepts that give your property a considered, cohesive presence.',
    metaTitle: 'Exterior Design in Lahore | Woodex Interior',
    metaDesc:
      'Exterior and front elevation design in Lahore. Woodex creates exterior concepts coordinated with your interior design direction.',
    h1: 'Exterior and Front Elevation Design in Lahore',
    intro: [
      'The exterior sets the expectation for everything inside. Woodex develops front elevation and exterior design concepts that align with the interior direction — materials, lighting and proportions considered together.',
    ],
    sections: [
      {
        heading: 'Exterior Design Scope',
        items: [
          'Front elevation concepts',
          'Material and finish palettes',
          'Exterior lighting direction',
          'Entrance and gate concepts',
          'Boundary wall treatments',
        ],
      },
    ],
    cta: 'Share your property details to discuss an exterior design concept.',
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
