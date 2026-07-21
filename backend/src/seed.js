/**
 * Woodex Interior — Database Seeding
 * Populates initial data on first run with verified Woodex content.
 * Data sourced from frontend static files (services.ts, projects.ts, articles.ts, site.ts).
 */

import { getMemory, isMongo, getDefaultSettings, getDefaultTheme, getDefaultHeaderFooter } from "./store.js";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

// ============================================================
//  DATA — sourced from frontend src/data/
// ============================================================

const WOODEX_SERVICES = [
  {
    slug: "interior-design-lahore",
    name: "Interior Design",
    shortDescription: "Complete interior design services for homeowners and businesses across Lahore — planned around purpose, area, style and function.",
    icon: "Armchair",
    category: "interior-design",
    order: 0,
    richContent: {
      image: "/images/hero.jpg",
      metaTitle: "Interior Designer in Lahore | Woodex Interior",
      metaDesc: "Looking for an interior designer in Lahore? Woodex creates residential, office, retail and commercial interiors with custom furniture solutions.",
      h1: "Interior Designer in Lahore for Functional, Personalized Spaces",
      intro: [
        "Woodex Interior provides interior design services for homeowners and businesses across Lahore. We plan spaces around their purpose, available area, preferred style and functional requirements.",
        "Our design scope can include layout planning, color and material selection, lighting direction, furniture planning, storage solutions, decorative elements and project coordination.",
      ],
      sections: [
        { heading: "Interior Design Services", items: ["Concept development", "Space planning", "Furniture layouts", "Color and material selection", "Lighting planning", "Ceiling and feature-wall concepts", "Custom furniture design", "3D interior visualization", "Residential interiors", "Commercial interiors"] },
        { heading: "What Clients Receive", body: "Deliverables are tailored to each package and can include a site survey, concept or mood board, furniture layout, 2D drawings, 3D views, material schedule, furniture specifications, project estimate and execution supervision — agreed clearly before work begins." },
      ],
      cta: "Tell us about your space and request an interior design consultation.",
    },
  },
  {
    slug: "residential-interior-design-lahore",
    name: "Residential Interior Design",
    shortDescription: "Personalized interior solutions for living rooms, bedrooms, kitchens, dining spaces, home offices and complete residences.",
    icon: "Home",
    category: "residential",
    order: 1,
    richContent: {
      image: "/images/project-living.jpg",
      metaTitle: "Home Interior Design in Lahore | Woodex Interior",
      metaDesc: "Personalized home interior design in Lahore for living rooms, bedrooms, kitchens and complete residences. Plan your space with Woodex Interior.",
      h1: "Home and Residential Interior Design in Lahore",
      intro: [
        "Your home should reflect how you live, not simply follow a design template.",
        "Woodex Interior creates personalized residential environments by considering family requirements, room dimensions, circulation, storage, lighting, furniture and preferred visual style.",
      ],
      sections: [
        { heading: "Residential Spaces We Design", items: ["Living rooms", "Drawing rooms", "Bedrooms", "Dining spaces", "Kitchens", "Home offices", "Children's rooms", "TV lounges", "Entrance areas", "Complete homes and apartments"] },
        { heading: "A More Practical Home", body: "Good home design improves everyday activities. Furniture should fit the available area, storage should be accessible, lighting should support different uses and materials should be suitable for long-term maintenance. Woodex brings these requirements together to create a home that feels comfortable, organized and visually connected." },
      ],
      cta: "Share your house plan, room photographs or site location to begin your residential interior project.",
    },
  },
  {
    slug: "office-interior-design-lahore",
    name: "Office Interior Design",
    shortDescription: "Workspaces planned around team requirements, circulation, privacy, storage, collaboration and brand identity.",
    icon: "Building2",
    category: "office",
    order: 2,
    richContent: {
      image: "/images/project-office.jpg",
      metaTitle: "Office Interior Design in Lahore | Woodex Interior",
      metaDesc: "Plan a productive workplace with Woodex office interior design in Lahore. Workstations, meeting rooms, receptions and custom office furniture.",
      h1: "Office Interior Design in Lahore",
      intro: [
        "An office should support productivity, communication and employee comfort while presenting a professional image to clients.",
        "Woodex Interior plans office environments around team size, workflow, privacy, storage, technology requirements and future growth.",
      ],
      sections: [
        { heading: "Office Spaces We Design", items: ["Reception and waiting areas", "Open workstations", "Executive offices", "Manager rooms", "Meeting and conference rooms", "Breakout spaces", "Storage areas", "Training rooms", "Collaborative work areas", "Home offices"] },
        { heading: "Office Furniture Integration", body: "Woodex can coordinate office layouts with customized workstations, executive desks, reception counters, conference tables, storage units and other furniture — so dimensions and design are planned around the actual office rather than selected later as unrelated standard pieces." },
        { heading: "Information Needed for a Proposal", items: ["Office location", "Total covered area", "Number of employees", "Required rooms", "Existing drawings", "Furniture requirements", "Preferred style", "Expected completion date"] },
      ],
      cta: "Request an office site review and workplace planning discussion.",
    },
  },
  {
    slug: "commercial-interior-design-lahore",
    name: "Commercial Interior Design",
    shortDescription: "Interior design solutions for customer-facing and operational commercial environments across Lahore.",
    icon: "Store",
    category: "commercial",
    order: 3,
    richContent: {
      image: "/images/project-dining.jpg",
      metaTitle: "Commercial Interior Design in Lahore | Woodex",
      metaDesc: "Commercial interior design in Lahore for offices, stores, showrooms and customer-facing spaces. Discuss your project with Woodex Interior.",
      h1: "Commercial Interior Design in Lahore",
      intro: [
        "Commercial interiors must support business operations while creating the right experience for employees, customers and visitors.",
        "Woodex Interior develops commercial environments around circulation, brand presentation, customer requirements, storage, lighting, furniture and operational efficiency.",
      ],
      sections: [
        { heading: "Commercial Project Types", items: ["Corporate offices", "Retail outlets", "Showrooms", "Service centers", "Clinics", "Salons", "Restaurants and cafés", "Educational environments", "Reception areas"] },
      ],
      cta: "Contact Woodex with your property type, location, area and required opening date.",
    },
  },
  {
    slug: "retail-shop-interior-design-lahore",
    name: "Retail & Shop Interior Design",
    shortDescription: "Store layouts, product displays, lighting, counters, signage integration and customer-flow planning.",
    icon: "ShoppingBag",
    category: "retail",
    order: 4,
    richContent: {
      image: "/images/project-retail.jpg",
      metaTitle: "Shop & Retail Interior Design Lahore | Woodex",
      metaDesc: "Retail and shop interior design in Lahore, including layouts, counters, display units, lighting, branding and custom furniture.",
      h1: "Shop and Retail Interior Design in Lahore",
      intro: [
        "A retail interior should make products easy to discover while creating a clear, memorable expression of the brand.",
        "Woodex plans shop and retail environments around customer movement, product visibility, display capacity, lighting, counter placement, storage and brand communication.",
      ],
      sections: [
        { heading: "Retail Design Services", items: ["Store layout planning", "Display-unit design", "Cash and reception counters", "Product shelving", "Feature displays", "Lighting concepts", "Storage integration", "Signage coordination", "Custom retail furniture", "Shopfront concepts"] },
      ],
      cta: "Planning a new shop or redesigning an existing outlet? Send Woodex your floor plan and product requirements.",
    },
  },
  {
    slug: "3d-interior-design-space-planning-lahore",
    name: "3D Design & Space Planning",
    shortDescription: "Layouts and visual concepts that help you understand the proposed space before execution begins.",
    icon: "Boxes",
    category: "planning",
    order: 5,
    richContent: {
      image: "/images/service-3d.jpg",
      metaTitle: "3D Interior Design & Space Planning Lahore | Woodex",
      metaDesc: "Understand your proposed interior through space planning, furniture layouts and 3D interior design services in Lahore.",
      h1: "3D Interior Design and Space Planning in Lahore",
      intro: [
        "Space planning determines how people, furniture and activities fit within the available area.",
        "Woodex develops layouts that consider circulation, room functions, furniture dimensions, storage and visual balance. Where included in the agreed package, 3D visualization helps clients understand the proposed colors, materials, furniture and lighting before execution.",
      ],
      sections: [
        { heading: "Available Deliverables", items: ["Measured site plan", "Furniture layout", "Floor plan", "Ceiling concept", "Lighting layout", "Wall elevations", "3D interior views", "Material schedule", "Furniture specifications"] },
      ],
      cta: "Send us your floor plan to discuss a space-planning or visualization package.",
    },
  },
  {
    slug: "custom-furniture-lahore",
    name: "Custom Furniture",
    shortDescription: "Purpose-built furniture designed according to the measurements, function and visual language of your interior.",
    icon: "Sofa",
    category: "furniture",
    order: 6,
    richContent: {
      image: "/images/project-workshop.jpg",
      metaTitle: "Custom Furniture in Lahore | Woodex Interior",
      metaDesc: "Custom home and office furniture in Lahore, designed around your space, function and preferred finish. Request a quotation from Woodex.",
      h1: "Custom Furniture Designed for Your Space",
      intro: [
        "Woodex creates customized furniture for residential and commercial environments. Each item is planned according to its required function, dimensions, storage capacity, material and design direction.",
        "Designing the furniture alongside the interior creates better proportions, stronger visual consistency and more effective use of space.",
      ],
      sections: [
        { heading: "Custom Furniture Categories", items: ["Executive tables", "Workstations", "Conference tables", "Reception counters", "Storage cabinets", "Shelving and display units", "Wardrobes", "Beds and side tables", "TV and media units", "Dining tables", "Home-office furniture"] },
        { heading: "The Custom Furniture Process", items: ["Requirement discussion", "Site measurement", "Design development", "Material and finish selection", "Quotation approval", "Manufacturing", "Delivery and installation"] },
      ],
      cta: "Send your reference design, measurements or furniture requirements for a customized quotation.",
    },
  },
  {
    slug: "office-furniture-lahore",
    name: "Office Furniture",
    shortDescription: "Customized workstations, executive desks, conference tables, reception counters and office storage — made for your office.",
    icon: "LampDesk",
    category: "furniture",
    order: 7,
    richContent: {
      image: "/images/service-office-furniture.jpg",
      metaTitle: "Custom Office Furniture in Lahore | Woodex",
      metaDesc: "Custom office furniture in Lahore, including workstations, executive desks, conference tables, reception counters and office storage.",
      h1: "Custom Office Furniture in Lahore",
      intro: [
        "Well-planned furniture improves how an office uses its available area.",
        "Woodex supplies customized office furniture designed around employee requirements, room dimensions, storage, cable management, working styles and the overall office interior.",
      ],
      sections: [
        { heading: "Products", items: ["Executive office tables", "Manager desks", "Staff workstations", "Conference tables", "Reception desks", "Office storage", "Filing units", "Shelving", "Waiting-area furniture", "Custom office sofas"] },
      ],
      cta: "Request an office furniture layout and quotation.",
    },
  },
  {
    slug: "carpenter-services-lahore",
    name: "Carpenter & Woodwork",
    shortDescription: "Custom carpentry and interior woodwork — cabinets, wardrobes, doors, shelving, counters and detailed joinery.",
    icon: "Hammer",
    category: "carpentry",
    order: 8,
    richContent: {
      image: "/images/project-workshop.jpg",
      metaTitle: "Carpenter Services in Lahore | Woodex Interior",
      metaDesc: "Custom carpenter and interior woodwork services in Lahore — cabinets, wardrobes, shelving, counters and furniture woodwork by Woodex.",
      h1: "Custom Carpenter and Interior Woodwork Services in Lahore",
      intro: [
        "Detailed woodwork gives an interior its finished character. Woodex provides custom carpentry coordinated with the overall design, so every joint, edge and surface belongs to the same visual language.",
      ],
      sections: [
        { heading: "Woodwork Capabilities", items: ["Cabinets and kitchen woodwork", "Wardrobes and closets", "Shelving and display units", "Counters and reception desks", "Doors and paneling", "Furniture repair and refinishing"] },
      ],
      cta: "Share your woodwork requirements and site details for a quotation.",
    },
  },
  {
    slug: "turnkey-interior-solutions-lahore",
    name: "Turnkey Interiors",
    shortDescription: "From planning and materials to furniture and final installation — one coordinated project process.",
    icon: "KeyRound",
    category: "turnkey",
    order: 9,
    richContent: {
      image: "/images/project-kitchen.jpg",
      metaTitle: "Turnkey Interior Solutions in Lahore | Woodex",
      metaDesc: "Turnkey interior design and execution in Lahore. Woodex coordinates planning, materials, furniture and installation in one process.",
      h1: "Turnkey Interior Design and Execution in Lahore",
      intro: [
        "From planning and materials to furniture and final installation, Woodex coordinates the agreed project scope through a single project process — giving you one point of responsibility from concept to completion.",
      ],
      sections: [
        { heading: "What a Turnkey Scope Can Include", items: ["Design concept and space planning", "Material and finish selection", "Custom furniture manufacturing", "Site execution coordination", "Lighting and fixture installation", "Final review and handover"] },
      ],
      cta: "Discuss your site and timeline to scope a turnkey interior project.",
    },
  },
  {
    slug: "interior-renovation-lahore",
    name: "Interior Renovation",
    shortDescription: "Planned renovation of existing homes, offices and commercial spaces — from assessment to finish.",
    icon: "PaintRoller",
    category: "renovation",
    order: 10,
    richContent: {
      image: "/images/project-bedroom.jpg",
      metaTitle: "Interior Renovation in Lahore | Woodex Interior",
      metaDesc: "Interior renovation services in Lahore for homes and offices — assessment, ceilings, flooring, painting, woodwork and schedules.",
      h1: "Interior Renovation Services in Lahore",
      intro: [
        "A renovation should solve the problems of an existing space, not only refresh its surface. Woodex plans renovation work around the current condition of the property and the way the space needs to perform.",
      ],
      sections: [
        { heading: "Renovation Scope", items: ["Existing-condition assessment", "Demolition scope", "Electrical work", "Ceiling changes", "Flooring", "Painting", "Furniture and woodwork", "Project schedule"] },
      ],
      cta: "Book a renovation assessment for your home or office.",
    },
  },
  {
    slug: "exterior-design-lahore",
    name: "Exterior Design",
    shortDescription: "Front elevation and exterior design concepts that give your property a considered, cohesive presence.",
    icon: "Landmark",
    category: "exterior",
    order: 11,
    richContent: {
      image: "/images/project-living.jpg",
      metaTitle: "Exterior Design in Lahore | Woodex Interior",
      metaDesc: "Exterior and front elevation design in Lahore. Woodex creates exterior concepts coordinated with your interior design direction.",
      h1: "Exterior and Front Elevation Design in Lahore",
      intro: [
        "The exterior sets the expectation for everything inside. Woodex develops front elevation and exterior design concepts that align with the interior direction — materials, lighting and proportions considered together.",
      ],
      sections: [
        { heading: "Exterior Design Scope", items: ["Front elevation concepts", "Material and finish palettes", "Exterior lighting direction", "Entrance and gate concepts", "Boundary wall treatments"] },
      ],
      cta: "Share your property details to discuss an exterior design concept.",
    },
  },
];

const WOODEX_PROJECTS = [
  {
    slug: "family-residence-model-town",
    title: "Modern Family Residence",
    category: "residential",
    categorySlug: "residential",
    location: "Model Town, Lahore",
    area: "Approx. 1 Kanal",
    year: "2024",
    image: "/images/project-living.jpg",
    excerpt: "A warm, wood-led family interior planned around daily routines, storage and layered lighting.",
    brief: "The family wanted a home that felt warm and contemporary rather than formal — with practical storage, durable finishes and spaces that work for both children and guests.",
    challenge: "The existing layout produced dark corridors and under-used transitional areas, and standard furniture sizes did not fit the main living wall.",
    solution: "Woodex re-planned the living and dining zones around a continuous walnut slat feature wall with integrated storage, layered cove and accent lighting, and custom-sized furniture built to the exact wall dimensions.",
    materials: ["Walnut veneer slats", "Brushed brass details", "Linen upholstery", "Honed marble"],
    servicesList: ["Residential Interior Design", "Custom Furniture", "Lighting Planning"],
  },
  {
    slug: "corporate-office-gulberg",
    title: "Corporate Office Floor",
    category: "office",
    categorySlug: "office",
    location: "Gulberg, Lahore",
    area: "Approx. 6,000 sq ft",
    year: "2024",
    image: "/images/project-office.jpg",
    excerpt: "A complete workplace planned around team workflow — workstations, meeting rooms and a custom reception.",
    brief: "A growing company needed a full office floor that balanced open collaboration with quiet focus zones, and a reception that presented a professional first impression.",
    challenge: "The floor plate had deep areas with limited natural light, and cable management across 40+ workstations required early coordination.",
    solution: "Workstations were planned in team clusters near the glazing line, enclosed meeting and manager rooms sit at the core, and all desks were custom-manufactured with integrated cable routing and matching storage.",
    materials: ["Oak-tone laminates", "Powder-coated frames", "Acoustic panels", "Warm LED systems"],
    servicesList: ["Office Interior Design", "Custom Office Furniture", "Space Planning"],
  },
  {
    slug: "boutique-retail-store",
    title: "Boutique Retail Store",
    category: "retail",
    categorySlug: "retail",
    location: "DHA, Lahore",
    area: "Approx. 1,200 sq ft",
    year: "2023",
    image: "/images/project-retail.jpg",
    excerpt: "A retail interior designed around product discovery — displays, counters and customer flow.",
    brief: "The retailer wanted a store that made collections easy to browse, with display capacity that could adapt between seasons and a counter zone that anchored the space.",
    challenge: "The narrow shop front limited window display depth, and stock storage had to be absorbed without shrinking the sales floor.",
    solution: "A clear circulation loop was planned around perimeter display shelving and central feature tables, with a custom cash counter concealing storage and integrated signage lighting to pull sightlines through the store.",
    materials: ["Blackened steel", "Oak display units", "Track spotlighting", "Polished concrete"],
    servicesList: ["Retail Interior Design", "Custom Display Units", "Lighting Concepts"],
  },
  {
    slug: "walnut-kitchen-residence",
    title: "Walnut Kitchen & Dining",
    category: "residential",
    categorySlug: "residential",
    location: "Bahria Town, Lahore",
    area: "Approx. 450 sq ft",
    year: "2024",
    image: "/images/project-kitchen.jpg",
    excerpt: "A minimal kitchen in walnut and stone, with custom cabinetry planned around the family's cooking routine.",
    brief: "The clients wanted a clean, handle-less kitchen with generous preparation space, concealed storage and a dining connection for everyday family use.",
    challenge: "Services routing for appliances and a structural column interrupted the ideal cabinet run.",
    solution: "Cabinetry was custom-manufactured to absorb the column into a tall storage unit, appliances were stacked on a dedicated services wall, and a marble-topped island doubles as preparation and casual dining space.",
    materials: ["Walnut veneer", "Engineered stone", "Matte lacquer", "Brass hardware"],
    servicesList: ["Residential Interior Design", "Custom Cabinetry", "3D Visualization"],
  },
  {
    slug: "executive-boardroom-suite",
    title: "Executive Boardroom Suite",
    category: "commercial",
    categorySlug: "commercial",
    location: "M.M. Alam Road, Lahore",
    area: "Approx. 900 sq ft",
    year: "2023",
    image: "/images/project-dining.jpg",
    excerpt: "A hospitality-grade boardroom and lounge with custom conference furniture and warm brass detailing.",
    brief: "A services firm needed a boardroom that could host client presentations with the atmosphere of a private lounge rather than a generic meeting room.",
    challenge: "The room proportions were long and narrow, and presentation technology needed to disappear when not in use.",
    solution: "A custom boat-shaped conference table anchors the room, wall paneling conceals the display and cabling, and a lounge corner with soft seating supports informal discussions before and after meetings.",
    materials: ["Smoked oak", "Brass inlays", "Velvet upholstery", "Fluted glass"],
    servicesList: ["Commercial Interior Design", "Custom Conference Furniture"],
  },
  {
    slug: "craft-furniture-workshop",
    title: "Custom Furniture Commission",
    category: "commercial",
    categorySlug: "commercial",
    location: "Ferozepur Road, Lahore",
    area: "Multiple pieces",
    year: "2024",
    image: "/images/project-workshop.jpg",
    excerpt: "A set of purpose-built solid-wood pieces designed and manufactured for a single coordinated interior.",
    brief: "The client commissioned a coordinated furniture set — dining table, sideboards and shelving — designed to match the proportions and finishes of their new interior.",
    challenge: "Each piece had to align exactly with the room's datum lines and lighting positions decided during the interior design stage.",
    solution: "Woodex manufactured every item in its own workshop to the interior drawings, finishing each surface to the same veneer and hardware specification used across the project.",
    materials: ["Solid ash and walnut", "Natural oil finishes", "Brass fittings"],
    servicesList: ["Custom Furniture", "Carpenter & Woodwork"],
  },
];

const WOODEX_ARTICLES = [
  {
    slug: "interior-design-cost-lahore",
    title: "Interior Design Cost in Lahore: Complete Planning Guide",
    category: "Cost Guides",
    date: "2025-01-12",
    readTime: "8 min read",
    image: "/images/hero.jpg",
    excerpt: "What actually drives interior design cost in Lahore — scope, materials, furniture and execution — and how to plan a realistic budget.",
    richContent: {
      answer: "Interior design cost in Lahore depends primarily on four things: the size of the space, the design scope (layout only vs. full 3D and documentation), the materials and finishes you select, and whether custom furniture and execution are included. A clear brief and measured floor plan are the fastest route to an accurate quotation.",
      body: [
        { text: "Every interior project budget is a combination of design work and physical work. Understanding which side of that line each cost sits on makes quotations much easier to compare." },
        { heading: "What Drives the Cost", list: ["Covered area and number of rooms", "Design deliverables: layout, 2D drawings, 3D views, material schedules", "Material and finish selections", "Custom furniture scope and quantities", "Execution, supervision and installation", "Timeline requirements"] },
        { heading: "How to Budget Realistically", text: "Start with the rooms that matter most to daily use — kitchens, living areas and work zones typically justify the largest share of the budget because they combine cabinetry, surfaces and lighting. Secondary spaces can follow a simpler specification." },
        { heading: "Getting an Accurate Quotation", text: "Provide your floor plan or measurements, photographs of the current space, a list of required rooms and any reference images for style. The more specific the brief, the more accurate — and comparable — the quotation." },
      ],
      faqs: [
        { q: "Is design charged separately from execution?", a: "It can be. Many clients take a design-only package first and add execution later. The scope is agreed before work begins so pricing stays transparent." },
        { q: "Does custom furniture cost more than ready-made?", a: "Custom furniture is priced on materials and making time. It often compares well once exact sizing, storage and durability are factored in — and it is built for your space rather than adapted to it." },
      ],
    },
    relatedService: "interior-design-lahore",
  },
  {
    slug: "office-interior-design-cost-lahore",
    title: "Office Interior Design Cost in Lahore",
    category: "Cost Guides",
    date: "2025-01-05",
    readTime: "7 min read",
    image: "/images/project-office.jpg",
    excerpt: "How office interior pricing works in Lahore — per-seat planning, furniture scope, and what to prepare before requesting a fit-out quotation.",
    richContent: {
      answer: "Office interior cost in Lahore is shaped by headcount, covered area, the mix of open workstations versus enclosed rooms, furniture scope, and services work such as electrical and data cabling. Offices that reuse custom-manufactured furniture across future expansions often achieve better long-term value.",
      body: [
        { text: "Workplace budgets behave differently from home budgets because they scale with people. Cost planning works best when it starts from headcount and workflow rather than from finishes." },
        { heading: "The Main Cost Components", list: ["Space planning and layout development", "Workstations, desks and seating", "Meeting and conference room fit-out", "Reception and waiting areas", "Storage systems", "Electrical, data and lighting work"] },
        { heading: "Planning for Growth", text: "A layout planned around team clusters can absorb new workstations without redesigning the whole floor. Custom furniture manufactured to a standard module makes later expansion faster and more consistent." },
      ],
      faqs: [
        { q: "What should I prepare before requesting a quotation?", a: "Office location, covered area, current and planned headcount, required rooms, any existing drawings, furniture requirements, preferred style and your target completion date." },
        { q: "Can existing furniture be reused?", a: "Yes. A site review identifies what can be refurbished or integrated, and new custom pieces are planned to match." },
      ],
    },
    relatedService: "office-interior-design-lahore",
  },
  {
    slug: "how-to-plan-an-office-interior",
    title: "How to Plan an Office Interior",
    category: "Workspace",
    date: "2024-12-20",
    readTime: "6 min read",
    image: "/images/service-3d.jpg",
    excerpt: "A practical sequence for planning a workplace — from headcount and workflow to layouts, 3D views and furniture.",
    richContent: {
      answer: "Plan an office interior in this order: confirm headcount and teams, map how people work and meet, zone the floor plan, develop the layout and 3D views, then coordinate furniture, storage and cabling before execution starts.",
      body: [
        { text: "Offices fail when they are designed as decoration first and workplaces second. The sequence below keeps function in front." },
        { heading: "The Planning Sequence", list: ["Confirm current and future headcount", "Map workflows: focus, collaboration, meetings, storage", "Zone the floor: open areas, enclosed rooms, support spaces", "Develop furniture layouts and 3D views", "Coordinate power, data and lighting with furniture positions", "Finalize materials and custom furniture specifications"] },
        { heading: "Where 3D Visualization Helps", text: "3D views let decision-makers walk the office before anything is built — checking sightlines, reception presentation and meeting-room privacy while changes are still inexpensive." },
      ],
      faqs: [
        { q: "How long does office planning take?", a: "It depends on floor size and decision speed. A focused brief with drawings and headcount data shortens the concept stage significantly." },
      ],
    },
    relatedService: "3d-interior-design-space-planning-lahore",
  },
  {
    slug: "small-office-interior-design-ideas",
    title: "Small Office Interior Design Ideas",
    category: "Workspace",
    date: "2024-12-08",
    readTime: "5 min read",
    image: "/images/service-office-furniture.jpg",
    excerpt: "Making a compact office feel organized and professional — layout, storage and furniture decisions that matter most.",
    richContent: {
      answer: "In a small office, the highest-impact moves are: a layout that protects circulation, custom-sized desks that fit the room exactly, vertical storage, a restrained material palette, and lighting that separates work zones without walls.",
      body: [
        { text: "Small offices punish generic furniture. Pieces that are slightly too large consume the circulation space that makes a workplace feel calm." },
        { heading: "Ideas That Work", list: ["Custom desk depths sized to the room, not the catalog", "Wall-mounted and tall storage to free the floor", "Glass or open partitions instead of solid walls", "One continuous material palette to reduce visual noise", "Layered lighting: ambient plus task at each desk", "A compact but well-detailed reception corner"] },
      ],
      faqs: [
        { q: "Can custom furniture help in a very small office?", a: "Especially there. When every hundred millimetres matters, furniture made to the room's exact dimensions recovers space that standard pieces waste." },
      ],
    },
    relatedService: "office-interior-design-lahore",
  },
  {
    slug: "shop-interior-design-ideas",
    title: "Shop Interior Design Ideas That Improve Product Visibility",
    category: "Retail",
    date: "2024-11-25",
    readTime: "6 min read",
    image: "/images/project-retail.jpg",
    excerpt: "Retail layout, display and lighting decisions that help customers find products faster and remember the store.",
    richContent: {
      answer: "Product visibility improves when the store has a clear circulation loop, displays at varied heights, focused accent lighting on merchandise, a visible counter anchor, and signage integrated into the design rather than added afterwards.",
      body: [
        { text: "Customers decide within seconds whether a shop feels easy to browse. Layout and lighting do most of that work before a single product is touched." },
        { heading: "Design Moves That Lift Visibility", list: ["A circulation loop that exposes every wall to foot traffic", "Feature displays at the first sightline from the entrance", "Accent lighting aimed at merchandise, not the floor", "Tiered shelving so products read at multiple heights", "A counter position visible from the entrance", "Signage and branding planned with the interior, not after it"] },
      ],
      faqs: [
        { q: "Can an existing shop be redesigned without closing?", a: "Often yes, by phasing the work zone by zone. The schedule is planned around trading hours during the site review." },
      ],
    },
    relatedService: "retail-shop-interior-design-lahore",
  },
  {
    slug: "turnkey-interior-design-explained",
    title: "Turnkey Interior Design: What Is Included?",
    category: "Guides",
    date: "2024-11-10",
    readTime: "5 min read",
    image: "/images/project-kitchen.jpg",
    excerpt: "What a turnkey interior scope actually covers — and the questions to ask before signing one.",
    richContent: {
      answer: "A turnkey interior includes the full chain from design concept and material selection to custom furniture, site execution and final installation — coordinated through one process and one point of responsibility.",
      body: [
        { text: "Turnkey means you receive the space ready to use. The value is coordination: design decisions, manufacturing and site work are planned together instead of handed between separate vendors." },
        { heading: "A Typical Turnkey Scope", list: ["Design concept, layouts and 3D views", "Material and finish selection with samples", "Custom furniture manufacturing", "Site execution and trade coordination", "Lighting and fixture installation", "Final review and handover"] },
        { heading: "Questions to Ask First", text: "Confirm exactly which trades are included, how variations are priced, who supervises the site, and how the schedule handles approvals. A written scope protects both sides." },
      ],
      faqs: [
        { q: "Is turnkey more expensive than managing vendors myself?", a: "Not necessarily. Coordination reduces rework and delays, which are the most common hidden costs of self-managed projects." },
      ],
    },
    relatedService: "turnkey-interior-solutions-lahore",
  },
];

// ============================================================
//  SEED FUNCTION
// ============================================================

export async function seedDatabase() {
  const all = getMemory();

  // ============= USERS =============
  if (!all.users || all.users.length === 0) {
    const adminHash = await bcrypt.hash("woodex2024", 10);
    const editorHash = await bcrypt.hash("editor2025", 10);
    const demoHash = await bcrypt.hash("demo123", 10);
    all.users = [
      { _id: uuid(), id: "u-1", username: "admin", email: "admin@woodex.com.pk", passwordHash: adminHash, fullName: "Woodex Admin", role: "admin", createdAt: "2026-01-01" },
      { _id: uuid(), id: "u-2", username: "editor", email: "editor@woodex.com.pk", passwordHash: editorHash, fullName: "Woodex Editor", role: "editor", createdAt: "2026-01-15" },
      { _id: uuid(), id: "u-3", username: "demo", email: "demo@woodex.com.pk", passwordHash: demoHash, fullName: "Demo User", role: "viewer", createdAt: "2026-02-01" },
    ];
    console.log("[seed] Created 3 users (admin/editor/demo)");
  }

  // ============= AGENTS =============
  if (!all.agents || all.agents.length === 0) {
    all.agents = [
      { _id: uuid(), id: uuid(), name: "Woodex Team", email: "info@woodex.com.pk", phone: "+92 322 4000768", role: "lead-agent", whatsappNumber: "923224000768", isOnline: true, specialties: ["Interior Design", "Custom Furniture"] },
      { _id: uuid(), id: uuid(), name: "Senior Designer", email: "design@woodex.com.pk", phone: "+92 322 4000768", role: "senior-agent", whatsappNumber: "923224000768", isOnline: true, specialties: ["Residential", "Office", "3D Visualization"] },
    ];
    console.log("[seed] Created 2 agents");
  }

  // ============= PAGES =============
  if (!all.pages || all.pages.length === 0) {
    all.pages = [
      { _id: "p-home", id: "p-home", slug: "home", title: "Home", description: "Main landing page", isHome: true, isPublished: true, blocks: [], meta: { title: "Woodex Interior — Interior Design & Custom Furniture Lahore", description: "Lahore-based interior design and custom furniture company creating residential, office, retail and commercial spaces." }, order: 0 },
      { _id: "p-about", id: "p-about", slug: "about", title: "About", description: "About Woodex Interior", isHome: false, isPublished: true, blocks: [], meta: { title: "About Woodex Interior — Lahore Design Studio", description: "Learn about Woodex Interior, a Lahore-based interior design and custom furniture company." }, order: 1 },
      { _id: "p-services", id: "p-services", slug: "services", title: "Services", description: "All services", isHome: false, isPublished: true, blocks: [], meta: { title: "Services | Woodex Interior", description: "12 coordinated service lines covering residential, office, retail and commercial interiors." }, order: 2 },
      { _id: "p-projects", id: "p-projects", slug: "projects", title: "Projects", description: "Portfolio", isHome: false, isPublished: true, blocks: [], meta: { title: "Portfolio | Woodex Interior", description: "Selected residential, office, retail and commercial interior projects by Woodex." }, order: 3 },
      { _id: "p-insights", id: "p-insights", slug: "insights", title: "Insights", description: "Articles and guides", isHome: false, isPublished: true, blocks: [], meta: { title: "Insights | Woodex Interior", description: "Practical guides on interior costs, office planning, retail design and custom furniture." }, order: 4 },
      { _id: "p-contact", id: "p-contact", slug: "contact", title: "Contact", description: "Contact form", isHome: false, isPublished: true, blocks: [], meta: { title: "Contact | Woodex Interior", description: "Discuss your project with Woodex Interior. Call, WhatsApp or visit us in Lahore." }, order: 5 },
      { _id: "p-privacy", id: "p-privacy", slug: "privacy-policy", title: "Privacy Policy", description: "Privacy policy", isHome: false, isPublished: true, blocks: [], meta: { title: "Privacy Policy | Woodex Interior", description: "Privacy policy" }, order: 6 },
      { _id: "p-terms", id: "p-terms", slug: "terms", title: "Terms of Service", description: "Terms", isHome: false, isPublished: true, blocks: [], meta: { title: "Terms of Service | Woodex Interior", description: "Terms of service" }, order: 7 },
    ];
    console.log("[seed] Created 8 pages");
  }

  // ============= SERVICES (12 Woodex services) =============
  if (!all.services || all.services.length === 0) {
    all.services = WOODEX_SERVICES.map((s) => ({
      _id: uuid(),
      id: s.slug,
      slug: s.slug,
      name: s.name,
      shortDescription: s.shortDescription,
      icon: s.icon,
      category: s.category,
      order: s.order,
      status: "published",
      ...s.richContent,
    }));
    console.log(`[seed] Created ${all.services.length} services`);
  }

  // ============= PROJECTS (6 Woodex case studies) =============
  if (!all.projects || all.projects.length === 0) {
    all.projects = WOODEX_PROJECTS.map((p) => ({
      _id: uuid(),
      id: p.slug,
      slug: p.slug,
      title: p.title,
      category: p.category,
      categorySlug: p.categorySlug,
      location: p.location,
      area: p.area,
      year: p.year,
      image: p.image,
      excerpt: p.excerpt,
      brief: p.brief,
      challenge: p.challenge,
      solution: p.solution,
      materials: p.materials,
      services: p.servicesList,
      status: "published",
      featured: true,
    }));
    console.log(`[seed] Created ${all.projects.length} projects`);
  }

  // ============= ARTICLES / BLOG POSTS (6 Woodex guides) =============
  if (!all.blogPosts || all.blogPosts.length === 0) {
    all.blogPosts = WOODEX_ARTICLES.map((a) => ({
      _id: uuid(),
      id: a.slug,
      slug: a.slug,
      title: a.title,
      category: a.category,
      date: a.date,
      readTime: a.readTime,
      image: a.image,
      excerpt: a.excerpt,
      relatedService: a.relatedService,
      body: a.richContent.body,
      faqs: a.richContent.faqs,
      answer: a.richContent.answer,
      author: "Woodex Interior",
      authorRole: "Design Team",
      authorBio: "Woodex Interior creates functional residential, office, retail and commercial interiors in Lahore, supported by space planning and custom furniture.",
      status: "published",
    }));
    console.log(`[seed] Created ${all.blogPosts.length} articles`);
  }

  // ============= LEADS =============
  if (!all.leads || all.leads.length === 0) {
    all.leads = [
      { _id: uuid(), id: uuid(), name: "Aaliya Khan", email: "aaliya@example.com", phone: "+92 300 1234567", project_type: "Office / Workspace", project_location: "Gulberg, Lahore", area: "8,000 sq ft", services: ["Office Interiors"], message: "Hi, I'm interested in office design for our 8,000 sq ft space in Gulberg.", status: "new", createdAt: new Date().toISOString() },
      { _id: uuid(), id: uuid(), name: "Hamza Sheikh", email: "hamza@example.com", phone: "+92 321 9876543", project_type: "Retail / Shop", project_location: "DHA Phase 5, Lahore", area: "1,200 sq ft", services: ["Retail & Shop Interiors", "Custom Furniture"], message: "We're launching a specialty store and need complete interior design.", status: "read", createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];
    console.log("[seed] Created 2 sample leads");
  }

  // ============= CONVERSATIONS =============
  if (!all.conversations || all.conversations.length === 0) {
    all.conversations = [
      {
        _id: uuid(), id: uuid(),
        channel: "whatsapp", customerName: "Aaliya Khan", customerPhone: "+92 300 1234567", service: "Office Interior Design",
        status: "active", priority: "high", assignedAgent: all.agents?.[0]?.id,
        messages: [
          { id: uuid(), from: "customer", text: "Hi, I'm interested in office design for our 8,000 sq ft space in Gulberg.", timestamp: new Date(Date.now() - 3600000).toISOString(), read: true },
          { id: uuid(), from: "agent", text: "Hi Aaliya! Thanks for reaching out. Could you share some reference images and your timeline?", timestamp: new Date().toISOString(), read: true },
        ],
        source: "contact-form",
      },
    ];
    console.log("[seed] Created 1 sample conversation");
  }

  // ============= MEDIA =============
  if (!all.media || all.media.length === 0) {
    all.media = [
      { _id: uuid(), id: uuid(), url: "/images/project-living.jpg", name: "project-living.jpg", size: 0, type: "image/jpeg" },
      { _id: uuid(), id: uuid(), url: "/images/project-office.jpg", name: "project-office.jpg", size: 0, type: "image/jpeg" },
    ];
    console.log("[seed] Created 2 media items");
  }

  // ============= SETTINGS (Woodex) =============
  if (!all.settings) {
    const defaults = getDefaultSettings();
    all.settings = {
      ...defaults,
      siteName: "Woodex Interior",
      siteTagline: "Interior Design & Custom Furniture — Lahore",
      contactEmail: "info@woodex.com.pk",
      contactPhone: "+92 322 4000768",
      address: "Zainab Tower, Model Town Link Road, Lahore, Punjab, Pakistan",
      socialInstagram: "",
      socialLinkedIn: "",
      socialPinterest: "",
    };
  }

  // ============= THEME =============
  if (!all.theme) {
    const defaults = getDefaultTheme();
    all.theme = {
      ...defaults,
      fontHeading: "Cormorant Garamond",
      fontBody: "Montserrat",
      colorCream: "#F5F0EB",
      colorEspresso: "#0A0A0A",
      colorGold: "#C9A84C",
      colorGoldHover: "#E2C97E",
    };
  }

  // ============= HEADER/FOOTER (Woodex) =============
  if (!all.headerFooter) {
    const defaults = getDefaultHeaderFooter();
    all.headerFooter = {
      ...defaults,
      header: {
        ...defaults.header,
        logoText: "Woodex",
        logoTagline: "Interior",
        ctaButtonText: "Get a Quote",
        navLinks: [
          { id: "n-1", label: "Home", page: "home", visible: true, order: 0 },
          { id: "n-2", label: "About", page: "about", visible: true, order: 1 },
          { id: "n-3", label: "Services", page: "services", visible: true, order: 2 },
          { id: "n-4", label: "Projects", page: "projects", visible: true, order: 3 },
          { id: "n-5", label: "Insights", page: "insights", visible: true, order: 4 },
          { id: "n-6", label: "Contact", page: "contact", visible: true, order: 5 },
        ],
      },
      footer: {
        ...defaults.footer,
        brandDescription: "Lahore-based interior design and custom furniture company creating functional residential, office, retail and commercial spaces.",
        copyrightText: "© 2026 Woodex Interior. All rights reserved.",
      },
    };
  }

  console.log("[seed] Database seeded successfully with Woodex data");
}
