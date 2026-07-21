/**
 * In-memory store (default) with optional MongoDB support
 * Provides a unified API to the routes, swappable with Mongoose models
 */

let useMongo = false;
let mongoConnected = false;

// ============= IN-MEMORY STORE =============
const memory = {
  users: [],
  pages: [],
  blocks: [],
  projects: [],
  blogPosts: [],
  services: [],
  media: [],
  leads: [],
  conversations: [],
  agents: [],
  templates: [],
  settings: null,
  theme: null,
  headerFooter: null,
};

// ============= INITIALIZATION =============
export async function initStore() {
  if (process.env.MONGODB_URI && process.env.USE_MEMORY_STORE !== "true") {
    try {
      const mongoose = await import("mongoose");
      await mongoose.connect(process.env.MONGODB_URI);
      useMongo = true;
      mongoConnected = true;
      console.log("[store] Connected to MongoDB");
      return;
    } catch (e) {
      console.warn("[store] MongoDB connection failed, falling back to in-memory:", e.message);
    }
  }
  useMongo = false;
  console.log("[store] Using in-memory store");
}

export const isMongo = () => useMongo && mongoConnected;
export const getMemory = () => memory;

// ============= MONGODB SCHEMAS (lazy load) =============
let _models = null;
async function getMongoModels() {
  if (_models) return _models;
  if (!useMongo) return null;
  const mongoose = await import("mongoose");

  const PageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: String,
    description: String,
    isHome: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    blocks: [{ type: mongoose.Schema.Types.Mixed }],
    meta: { title: String, description: String, ogImage: String },
    order: { type: Number, default: 0 },
  }, { timestamps: true });

  const BlockSchema = new mongoose.Schema({
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: "Page" },
    type: String,
    title: String,
    visible: { type: Boolean, default: true },
    order: Number,
    props: mongoose.Schema.Types.Mixed,
    styles: mongoose.Schema.Types.Mixed,
    visibility: mongoose.Schema.Types.Mixed,
  }, { timestamps: true });

  const ProjectSchema = new mongoose.Schema({
    title: String,
    category: String,
    categorySlug: String,
    client: String,
    location: String,
    year: String,
    image: String,
    description: String,
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  }, { timestamps: true });

  const BlogPostSchema = new mongoose.Schema({
    slug: { type: String, unique: true },
    title: String,
    excerpt: String,
    content: String,
    body: String,
    category: String,
    date: String,
    readTime: String,
    image: String,
    author: String,
    authorRole: String,
    authorBio: String,
    metaTitle: String,
    metaDescription: String,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  }, { timestamps: true });

  const ServiceSchema = new mongoose.Schema({
    slug: { type: String, unique: true },
    name: String,
    shortDescription: String,
    description: String,
    icon: String,
    category: String,
    order: Number,
    price: String,
    status: { type: String, enum: ["draft", "published"], default: "published" },
  }, { timestamps: true });

  const MediaSchema = new mongoose.Schema({
    url: String,
    name: String,
    size: Number,
    type: String,
  }, { timestamps: true });

  const LeadSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    service: String,
    message: String,
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  }, { timestamps: true });

  const ConversationSchema = new mongoose.Schema({
    channel: { type: String, enum: ["whatsapp", "email", "sms", "live-chat"], default: "whatsapp" },
    customerName: String,
    customerPhone: String,
    customerEmail: String,
    service: String,
    status: { type: String, enum: ["queued", "active", "resolved", "spam"], default: "queued" },
    priority: { type: String, enum: ["low", "normal", "high", "urgent"], default: "normal" },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    messages: [{
      from: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
      read: { type: Boolean, default: false },
    }],
    source: String,
  }, { timestamps: true });

  const AgentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    role: { type: String, enum: ["lead-agent", "senior-agent", "manager"], default: "lead-agent" },
    whatsappNumber: String,
    isOnline: { type: Boolean, default: false },
    specialties: [String],
  }, { timestamps: true });

  const TemplateSchema = new mongoose.Schema({
    name: String,
    channel: String,
    subject: String,
    body: String,
    variables: [String],
    category: String,
    isActive: { type: Boolean, default: true },
  });

  const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    passwordHash: String,
    fullName: String,
    role: { type: String, enum: ["admin", "editor", "viewer"], default: "viewer" },
    lastLogin: Date,
  }, { timestamps: true });

  const SettingsSchema = new mongoose.Schema({
    siteName: String,
    siteTagline: String,
    contactEmail: String,
    contactPhone: String,
    address: String,
    socialInstagram: String,
    socialLinkedIn: String,
    socialPinterest: String,
    primaryColor: String,
    accentColor: String,
    maintenanceMode: Boolean,
    allowRegistrations: Boolean,
    emailNotifications: Boolean,
    whatsappAlertsEnabled: Boolean,
    alertPhone: String,
    alertOnNewLead: Boolean,
    alertOnNewConversation: Boolean,
    alertOnUrgentPriority: Boolean,
    autoAssignAgent: Boolean,
    defaultAgentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    businessHoursStart: String,
    businessHoursEnd: String,
    outOfHoursMessage: String,
    llmAgentEnabled: Boolean,
    llmAgentModel: String,
  });

  const ThemeSchema = new mongoose.Schema({
    fontHeading: String,
    fontBody: String,
    fontMono: String,
    colorCream: String,
    colorEspresso: String,
    colorGold: String,
    colorGoldHover: String,
    colorWhite: String,
    colorText: String,
    colorHeading: String,
    colorBorder: String,
    colorSuccess: String,
    colorDanger: String,
    heroHeight: String,
    sectionSpacing: String,
    cardRadius: String,
    buttonRadius: String,
    baseFontSize: String,
    enableShadows: Boolean,
    enableAnimations: Boolean,
    darkMode: Boolean,
  });

  const HeaderFooterSchema = new mongoose.Schema({
    header: mongoose.Schema.Types.Mixed,
    footer: mongoose.Schema.Types.Mixed,
    servicesDropdown: mongoose.Schema.Types.Mixed,
  });

  _models = {
    User: mongoose.model("User", UserSchema),
    Page: mongoose.model("Page", PageSchema),
    Block: mongoose.model("Block", BlockSchema),
    Project: mongoose.model("Project", ProjectSchema),
    BlogPost: mongoose.model("BlogPost", BlogPostSchema),
    Service: mongoose.model("Service", ServiceSchema),
    Media: mongoose.model("Media", MediaSchema),
    Lead: mongoose.model("Lead", LeadSchema),
    Conversation: mongoose.model("Conversation", ConversationSchema),
    Agent: mongoose.model("Agent", AgentSchema),
    Template: mongoose.model("Template", TemplateSchema),
    Settings: mongoose.model("Settings", SettingsSchema),
    Theme: mongoose.model("Theme", ThemeSchema),
    HeaderFooter: mongoose.model("HeaderFooter", HeaderFooterSchema),
  };
  return _models;
}

// ============= CRUD HELPER =============
export async function findAll(ModelName, filter = {}, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    return M[ModelName].find(filter).sort({ order: 1, createdAt: 1 }).lean();
  }
  const items = memory[mongoSchema];
  return items ? items.filter((i) => matchesFilter(i, filter)) : [];
}

export async function findOne(ModelName, filter, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    return M[ModelName].findOne(filter).lean();
  }
  const items = memory[mongoSchema];
  return items ? items.find((i) => matchesFilter(i, filter)) || null : null;
}

export async function findById(ModelName, id, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    return M[ModelName].findById(id).lean();
  }
  return memory[mongoSchema]?.find((i) => i._id === id || i.id === id) || null;
}

export async function create(ModelName, data, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    const doc = await M[ModelName].create(data);
    return doc.toObject();
  }
  if (!memory[mongoSchema]) memory[mongoSchema] = [];
  const id = data._id || data.id || `${mongoSchema.slice(0, 3)}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const item = { ...data, _id: id, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  memory[mongoSchema].push(item);
  return item;
}

export async function update(ModelName, id, patch, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    return M[ModelName].findByIdAndUpdate(id, patch, { new: true }).lean();
  }
  const idx = memory[mongoSchema]?.findIndex((i) => i._id === id || i.id === id);
  if (idx === -1 || idx === undefined) return null;
  memory[mongoSchema][idx] = { ...memory[mongoSchema][idx], ...patch, updatedAt: new Date().toISOString() };
  return memory[mongoSchema][idx];
}

export async function remove(ModelName, id, mongoSchema) {
  if (isMongo()) {
    const M = await getMongoModels();
    return M[ModelName].findByIdAndDelete(id).lean();
  }
  const idx = memory[mongoSchema]?.findIndex((i) => i._id === id || i.id === id);
  if (idx === -1 || idx === undefined) return null;
  const [removed] = memory[mongoSchema].splice(idx, 1);
  return removed;
}

function matchesFilter(item, filter) {
  return Object.entries(filter).every(([k, v]) => {
    if (typeof v === "object" && v !== null) {
      return Object.entries(v).every(([op, val]) => {
        if (op === "$regex") return new RegExp(val, "i").test(item[k]);
        if (op === "$in") return val.includes(item[k]);
        return item[k] === val;
      });
    }
    return item[k] === v;
  });
}

export async function getSettings() {
  if (isMongo()) {
    const M = await getMongoModels();
    let s = await M.Settings.findOne().lean();
    if (!s) {
      s = await M.Settings.create(getDefaultSettings());
    }
    return s;
  }
  if (!memory.settings) {
    memory.settings = getDefaultSettings();
  }
  return memory.settings;
}

export async function getTheme() {
  if (isMongo()) {
    const M = await getMongoModels();
    let t = await M.Theme.findOne().lean();
    if (!t) t = await M.Theme.create(getDefaultTheme());
    return t;
  }
  if (!memory.theme) memory.theme = getDefaultTheme();
  return memory.theme;
}

export async function getHeaderFooter() {
  if (isMongo()) {
    const M = await getMongoModels();
    let h = await M.HeaderFooter.findOne().lean();
    if (!h) h = await M.HeaderFooter.create(getDefaultHeaderFooter());
    return h;
  }
  if (!memory.headerFooter) memory.headerFooter = getDefaultHeaderFooter();
  return memory.headerFooter;
}

function getDefaultSettings() {
  return {
    siteName: "WP Interior Studio",
    siteTagline: "Pakistan's award-winning interior design company",
    contactEmail: "hello@wpinterior.com",
    contactPhone: "+92 300 1234567",
    address: "124-G, MM Alam Road, Gulberg III, Lahore 54000, Pakistan",
    socialInstagram: "https://instagram.com/wpinterior",
    socialLinkedIn: "https://linkedin.com/company/wpinterior",
    socialPinterest: "https://pinterest.com/wpinterior",
    primaryColor: "#C6A15B",
    accentColor: "#211C18",
    maintenanceMode: false,
    allowRegistrations: false,
    emailNotifications: true,
    whatsappAlertsEnabled: true,
    alertPhone: "+92 300 9998877",
    alertOnNewLead: true,
    alertOnNewConversation: true,
    alertOnUrgentPriority: true,
    autoAssignAgent: true,
    defaultAgentId: null,
    businessHoursStart: "09:00",
    businessHoursEnd: "19:00",
    outOfHoursMessage: "Thanks for reaching out! Our team is currently offline. We'll respond to your message first thing in the morning. For urgent matters, please call +92 300 1234567.",
    llmAgentEnabled: false,
    llmAgentModel: "gpt-4o-mini",
  };
}

function getDefaultTheme() {
  return {
    fontHeading: "Playfair Display",
    fontBody: "Poppins",
    fontMono: "JetBrains Mono",
    colorCream: "#F6F1E7",
    colorEspresso: "#211C18",
    colorGold: "#C6A15B",
    colorGoldHover: "#B89048",
    colorWhite: "#FFFFFF",
    colorText: "#6E6660",
    colorHeading: "#2A241F",
    colorBorder: "#E5E0D8",
    colorSuccess: "#16A34A",
    colorDanger: "#DC2626",
    heroHeight: "md",
    sectionSpacing: "lg",
    cardRadius: "16px",
    buttonRadius: "9999px",
    baseFontSize: "base",
    enableShadows: true,
    enableAnimations: true,
    darkMode: false,
  };
}

function getDefaultHeaderFooter() {
  return {
    header: {
      logoText: "WP Interior",
      logoTagline: "Design Studio",
      ctaButtonText: "Free Consultation",
      ctaButtonPage: "consultation",
      ctaButtonVisible: true,
      transparentBackground: true,
      showOnScroll: true,
      navLinks: [
        { id: "n-1", label: "Home", page: "home", visible: true, order: 0 },
        { id: "n-2", label: "About", page: "about", visible: true, order: 1 },
        { id: "n-3", label: "Services", page: "services", visible: true, order: 2 },
        { id: "n-4", label: "3D Studio", page: "studio", visible: true, order: 3 },
        { id: "n-5", label: "Portfolio", page: "portfolio", visible: true, order: 4 },
        { id: "n-6", label: "Journal", page: "blog", visible: true, order: 5 },
        { id: "n-7", label: "Contact", page: "contact", visible: true, order: 6 },
      ],
    },
    footer: {
      brandDescription: "Pakistan's award-winning interior design company. Crafting timeless spaces where vision meets craftsmanship.",
      newsletterTitle: "The Journal · Monthly",
      newsletterDescription: "Design notes, delivered monthly.",
      socialLinks: [
        { id: "s-1", platform: "Instagram", url: "https://instagram.com/wpinterior", visible: true },
        { id: "s-2", platform: "LinkedIn", url: "https://linkedin.com/company/wpinterior", visible: true },
        { id: "s-3", platform: "Pinterest", url: "https://pinterest.com/wpinterior", visible: true },
      ],
      showNewsletter: true,
      showSocial: true,
      showAwards: false,
      copyrightText: "© 2025 WP Interior Studio. All rights reserved.",
      legalLinks: [
        { id: "l-1", label: "Privacy", url: "#" },
        { id: "l-2", label: "Terms", url: "#" },
        { id: "l-3", label: "Cookies", url: "#" },
        { id: "l-4", label: "Sitemap", url: "#" },
      ],
    },
    servicesDropdown: [
      { id: "svc-1", name: "Office Interior", shortDescription: "Workplaces that boost productivity & brand.", icon: "commercial", link: "office-interior-design-lahore", visible: true },
      { id: "svc-2", name: "Restaurant Design", shortDescription: "Atmospheres guests remember and share.", icon: "hospitality", link: "restaurant-interior-design-pakistan", visible: true },
      { id: "svc-3", name: "Cafe Design", shortDescription: "Spaces for laptops, dates and group hangs.", icon: "hospitality", link: "cafe-interior-design-services", visible: true },
      { id: "svc-4", name: "3D Visualization", shortDescription: "See it before it's built.", icon: "3d", link: "3d-visualization-interior-design-pakistan", visible: true },
      { id: "svc-5", name: "Renovation", shortDescription: "End-to-end renovation services.", icon: "residential", link: "renovation-services-pakistan", visible: true },
      { id: "svc-6", name: "Retail Design", shortDescription: "Stores that convert browsers to buyers.", icon: "commercial", link: "retail-interior-design-pakistan", visible: true },
    ],
  };
}

export { getDefaultSettings, getDefaultTheme, getDefaultHeaderFooter };
