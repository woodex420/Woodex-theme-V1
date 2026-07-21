# Woodex Interior — Fullstack Project

> **Version:** V1  
> **Stack:** Vite + React (frontend) · Express + Socket.IO (backend) · WordPress (theme)  
> **Deployment:** Hostinger shared hosting + subdomain API

---

## Project Structure

```
Woodex-theme-V1/
├── frontend/              # Vite + React SPA (port 3000)
│   ├── src/               # React components, pages, hooks
│   │   ├── pages/         # Route pages (Home, About, Services…)
│   │   ├── components/    # UI components + dashboard + builder
│   │   ├── lib/           # API client, auth, builder store
│   │   └── data/          # Static fallback data
│   ├── public/images/     # Site images
│   ├── dist/              # Build output (upload to Hostinger)
│   ├── .env.example       # Environment template
│   └── package.json
│
├── backend/               # Express API server (port 4000)
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── server.js      # Entry point
│   │   ├── store.js       # In-memory / MongoDB store
│   │   └── seed.js        # Database seeder
│   ├── uploads/           # File uploads
│   ├── .env.example       # Environment template
│   ├── Dockerfile         # Container support
│   └── package.json
│
├── docs/                  # Documentation
├── blueprint/             # Planning & architecture docs
├── .gitignore
├── README.md
└── localrun.md            # Local development quick-start
```

---

## Quick Start (Development)

### Prerequisites

- **Node.js** >= 18
- **npm**

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env        # Edit if needed
npm run dev                 # Starts on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env        # Edit if needed
npm run dev                 # Starts on http://localhost:3000
```

### 3. Open

Visit **http://localhost:3000** in your browser.

---

## Login Credentials (Dev)

| Username  | Password     | Role     |
|-----------|-------------|----------|
| `admin`   | `woodex2024`| Admin    |
| `editor`  | `editor2025`| Editor   |
| `demo`    | `demo123`   | Viewer   |

Login at **http://localhost:3000/login** → Dashboard at **/dashboard**.

---

## Deployment (Hostinger)

### Frontend (Shared Hosting — Main Domain)

```bash
cd frontend
npm install
npm run build               # Outputs to frontend/dist/
```

Upload the contents of **`frontend/dist/`** to your Hostinger public_html (or a subdirectory).

### Backend (Subdomain — e.g. api.woodexinterior.com)

```bash
cd backend
npm install --production
cp .env.example .env        # Set production values
node src/server.js          # Or use PM2 for persistence
```

Configure the subdomain in Hostinger to point to the backend directory with Node.js support enabled.

### Environment Variables (Production)

**Backend `.env`:**

```env
PORT=4000
NODE_ENV=production
JWT_SECRET=<generate-a-strong-secret>
CLIENT_ORIGIN=https://yourdomain.com
USE_MEMORY_STORE=false
MONGODB_URI=mongodb://<user>:<pass>@<host>:<port>/woodex
```

**Frontend `.env`:**

```env
VITE_API_BASE=https://api.yourdomain.com/api
```

---

## WordPress Theme

The `wp-theme-starter/` directory under `backend/` contains a Vite + React starter template (Tailwind CSS v4). It was originally scoped for WordPress theme development but is maintained as a reference/experimental project.

---

## Technology Stack

| Layer           | Technology                                      |
|-----------------|-------------------------------------------------|
| Frontend        | React 19, TypeScript, Vite 7, Tailwind CSS 3    |
| UI Components   | shadcn/ui, Radix UI, Lucide Icons               |
| Backend         | Express.js, Socket.IO, JWT auth                 |
| Database        | In-memory (dev) / MongoDB (production)          |
| File Uploads    | Multer                                          |
| Builder         | Custom live-editing system with localStorage    |

---

## Key Features

- 🏠 **Public site** — Home, About, Services (12), Projects, Insights, Contact
- 📊 **Admin dashboard** — CRUD for services, projects, blog, leads, media, settings
- ✏️ **Live Page Builder** — Visual inline editing, style panel, drag-and-drop sections
- 📨 **Inquiry form** — Honeypot-protected, rate-limited lead capture
- 🔐 **JWT authentication** — Role-based access (admin/editor/viewer)
- 🔌 **WebSocket** — Real-time conversations and builder sync
- 📱 **WhatsApp integration** — Contact and lead notification via WhatsApp Business API

---

## License

Proprietary — Woodex Interior
