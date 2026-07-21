# WP Interior Studio - Full-Stack Admin + Live Page Builder

A complete CMS-style admin platform with drag-and-drop page builder, WhatsApp Business integration, LLM agent, and master theme controls for the WP Interior interior design studio.

## 🏗️ Architecture

```
wp-interior/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── server.js          # Express + Socket.IO bootstrap
│   │   ├── store.js           # MongoDB-ready data store
│   │   ├── socket.js          # Real-time WebSocket layer
│   │   ├── middleware.js      # JWT auth + role guards
│   │   ├── seed.js            # Database seeder
│   │   ├── whatsapp.js        # WhatsApp Business API
│   │   └── routes/            # 14 route modules
│   │       ├── auth.js
│   │       ├── pages.js
│   │       ├── blocks.js
│   │       ├── projects.js
│   │       ├── blog.js
│   │       ├── services.js
│   │       ├── media.js
│   │       ├── leads.js
│   │       ├── conversations.js
│   │       ├── agents.js
│   │       ├── templates.js
│   │       ├── settings.js
│   │       ├── theme.js
│   │       ├── headerFooter.js
│   │       ├── whatsapp.js
│   │       └── llm.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── src/                        # React + TypeScript frontend
│   ├── components/
│   │   ├── admin/             # Admin dashboard
│   │   │   ├── AdminApp.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminPages.tsx
│   │   │   ├── PagesAdmin.tsx        # Page CMS
│   │   │   ├── HeaderFooterAdmin.tsx # Header/footer editor
│   │   │   ├── ThemeAdmin.tsx        # Master theme manager
│   │   │   ├── ProjectsAdmin.tsx     # Projects with gallery
│   │   │   └── SupportAdmin.tsx      # Live support + agents
│   │   ├── LivePageBuilder.tsx       # Drag-drop live builder
│   │   ├── LiveChatWidget.tsx        # WhatsApp widget
│   │   ├── RichTextEditor.tsx        # WYSIWYG editor
│   │   ├── HeaderFooterEditor.tsx
│   │   └── ...                          # Site pages
│   ├── lib/
│   │   ├── auth.ts            # Frontend auth
│   │   ├── contentStore.ts    # Content data
│   │   ├── pageBuilderStore.ts # Page builder
│   │   ├── supportStore.ts    # Support system
│   │   ├── themeManager.ts    # Theme system
│   │   └── builderStore.ts    # Builder state
│   └── App.tsx
│
└── package.json
```

## ✨ Features

### 🔐 Authentication
- JWT-based auth with bcrypt password hashing
- 3 roles: admin, editor, viewer
- 8-hour session expiry
- Default users: admin / editor / demo

### 📄 Live Page Builder (Drag & Drop)
- **JSON schema storage** (not DOM attributes)
- **15+ block types**: Hero, Text, Image, Button, CTA, Features, Testimonials, Stats, Gallery, FAQ, Logos, Pricing, Contact Form, Video, Spacer, Custom HTML
- **Drag-and-drop canvas** with native HTML5 DnD
- **Inspector Panel** for editing text, images, size, position, styles
- **Undo/Redo** with full history (30 steps)
- **Inline content editing** (double-click)
- **Import/Export** layouts (JSON/HTML)
- **Section name customization** (each block has editable name)
- **Hide/Show** blocks
- **Reorder** blocks (drag + arrows)
- **Save** to backend with auto-save (1s debounce)
- **Error boundary** for crash recovery
- **Live canvas preview**

### 🛠️ Admin Dashboard
- **Dashboard** with stats and recent leads
- **Pages** — 13 pages, full CRUD with block editor
- **Header & Footer** — logo, nav links, services dropdown
- **Theme Manager** — fonts, colors, sizes, effects
- **Projects** — gallery upload, rich text description
- **Services** — full CRUD with icon and category
- **Blog Posts** — featured image, rich text body, SEO fields
- **Testimonials** — client reviews
- **Contacts** — lead inbox with status pipeline
- **Media Library** — file upload (drag-drop, library)
- **Live Support** — WhatsApp queue, agents, message templates
- **Users** — team management
- **Settings** — site config, WhatsApp alerts, LLM agent

### 💬 Live Support System
- **WhatsApp Business API** integration
- **Multi-channel**: WhatsApp, Email, SMS, Live Chat
- **Queue management** with status pipeline (queued → active → resolved)
- **Priority levels**: low, normal, high, urgent
- **Agent assignment** with online/offline status
- **Message templates** with variable substitution ({{name}}, {{service}}, {{date}})
- **Auto-reply** for out-of-hours
- **Real-time updates** via Socket.IO
- **WhatsApp webhook** for inbound messages
- **Auto-lead assignment** to online agents

### 🤖 LLM Agent (OpenAI-compatible)
- **Chat completion** endpoint
- **Content generation**: blog posts, project descriptions, social media, service descriptions
- **Auto-reply** for customer messages
- **Test render** endpoint
- Configurable model (gpt-4o-mini default)

### 🎨 Theme System
- **Master controls**: fonts, colors, sizes, effects
- **Live CSS variables** applied to document
- **Live preview** for all settings
- **Import/Export** theme as JSON
- **Reset** to defaults
- **3 tabs**: Fonts, Colors, Sizes & Spacing, Effects

### 📞 WhatsApp Integration
- **WhatsApp Business Cloud API** (real)
- **Webhook** for inbound messages (verified)
- **Send alerts** for new leads, urgent conversations
- **Auto-create conversations** from webhooks
- **Demo mode** (no API keys required)

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev        # Development
npm run build      # Production build
```

Open http://localhost:5173 and visit `#/admin` to access the admin panel.

### Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit as needed
npm run seed           # Seed initial data
npm run dev            # Start on :4000
```

### Docker
```bash
cd backend
docker build -t wp-interior-api .
docker run -p 4000:4000 wp-interior-api
```

## 🔑 Default Credentials

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | `admin` | `wpinterior2024` | Full access |
| Editor | `editor` | `editor2025` | Content only |
| Demo | `demo` | `demo123` | Read-only |

## 🌐 API Endpoints

### Auth
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user
- `POST /api/auth/logout`

### Pages
- `GET /api/pages` — List
- `POST /api/pages` — Create
- `GET /api/pages/:id`
- `PUT /api/pages/:id` — Update
- `DELETE /api/pages/:id`
- `POST /api/pages/:id/duplicate`
- `POST /api/pages/:id/reorder`
- `POST /api/pages/import`
- `GET /api/pages/export/all`

### Blocks
- `GET /api/blocks?pageId=xxx`
- `POST /api/blocks`
- `PUT /api/blocks/:id`
- `DELETE /api/blocks/:id`
- `POST /api/blocks/:id/duplicate`
- `POST /api/blocks/:id/move`
- `POST /api/blocks/:id/toggle-visibility`

### Other Resources
- `/api/projects`, `/api/blog`, `/api/services`, `/api/media`
- `/api/leads` (CRUD + public submit), `/api/conversations`
- `/api/agents`, `/api/templates`, `/api/settings`
- `/api/theme`, `/api/header-footer`
- `/api/whatsapp` (send + webhook)
- `/api/llm` (chat + generate-content + auto-reply + status)

### WebSocket
- `agent:online` / `agent:offline` — Presence
- `conversation:join` / `conversation:message` / `conversation:typing` — Live chat
- `builder:join` / `builder:update` / `builder:cursor` — Collaborative editing
- Server emits: `lead:new`, `conversation:new`, `conversation:updated`, `agents:online`, `alert`

## 🔌 Environment Variables

```env
PORT=4000
NODE_ENV=production
JWT_SECRET=...
CLIENT_ORIGIN=...
MONGODB_URI=...                    # Optional - falls back to in-memory
USE_MEMORY_STORE=true
WHATSAPP_BUSINESS_ACCOUNT_ID=...
WHATSAPP_BUSINESS_PHONE_ID=...
WHATSAPP_BUSINESS_TOKEN=...
WHATSAPP_WEBHOOK_VERIFY_TOKEN=...
WHATSAPP_ALERT_PHONE=+923001234567
OPENAI_API_KEY=...
LLM_AGENT_ENABLED=false
LLM_AGENT_MODEL=gpt-4o-mini
SMTP_HOST=...
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=10
```

## 🧪 Testing

```bash
cd backend
npm test
```

## 📦 Tech Stack

**Frontend**: React 19, TypeScript, Vite, TailwindCSS v4
**Backend**: Node.js 20, Express 4, MongoDB/Mongoose, Socket.IO 4
**Auth**: JWT + bcrypt
**Uploads**: Multer (disk storage)
**AI**: OpenAI-compatible LLMs
**Messaging**: WhatsApp Business Cloud API
**Deployment**: Docker

## 📄 License

MIT
