# Woodex Interior — Local Development Guide

## Prerequisites

- **Node.js** >= 18
- **npm** (comes with Node.js)
- A terminal (Git Bash, CMD, or PowerShell)

## Project Structure

```
Woodex-theme-V1/
├── frontend/          # Vite + React SPA (port 3000)
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # React components + dashboard + builder
│   │   ├── lib/            # Utilities (API, auth, builder)
│   │   ├── data/           # Static fallback data
│   │   └── App.tsx         # Root with router
│   ├── public/images/      # Site images
│   ├── dist/               # Build output (Hostinger upload)
│   ├── .env.example        # Environment template
│   └── package.json
│
├── backend/           # Express API server (port 4000)
│   ├── src/
│   │   ├── routes/   # API route handlers
│   │   ├── server.js # Entry point
│   │   ├── store.js  # In-memory / MongoDB data store
│   │   ├── seed.js   # Database seeder
│   │   ├── middleware.js  # Auth middleware
│   │   └── socket.js # WebSocket (Socket.IO)
│   ├── uploads/      # File uploads directory
│   ├── .env.example  # Environment template
│   ├── Dockerfile    # Container support
│   └── package.json
│
├── backend/wp-theme-starter/  # Experimental Vite starter (Tailwind v4)
├── docs/              # Documentation
├── blueprint/         # Planning documents
├── .gitignore
└── README.md
```

## Quick Start

### 1. Start the Backend

```bash
cd backend
npm run dev
```

The backend starts on **http://localhost:4000** with an in-memory store (auto-seeded on first launch).

### 2. Start the Frontend (in a separate terminal)

```bash
cd frontend
npm run dev
```

The frontend starts on **http://localhost:3000**.

### 3. Open the Site

Visit **http://localhost:3000** in your browser.

---

## Default Credentials

| Username  | Password     | Role     |
|-----------|-------------|----------|
| `admin`   | `woodex2024`| Admin    |
| `editor`  | `editor2025`| Editor   |
| `demo`    | `demo123`   | Viewer   |

Login at **http://localhost:3000/login** to access the dashboard at **http://localhost:3000/dashboard**.

---

## Environment Variables

### Backend (`backend/.env` — copy from `.env.example`)

| Variable                    | Default                        | Description                          |
|----------------------------|--------------------------------|--------------------------------------|
| `PORT`                     | `4000`                         | API server port                      |
| `NODE_ENV`                 | `development`                  | Environment mode                     |
| `JWT_SECRET`               | `woodex-interior-dev-secret-key-2026` | JWT signing secret          |
| `CLIENT_ORIGIN`            | `http://localhost:3000`        | CORS allowed origin                  |
| `USE_MEMORY_STORE`         | `true`                         | Use `true` for in-memory, `false` for MongoDB |
| `MONGODB_URI`              | *(empty)*                      | MongoDB connection string            |

### Frontend (`frontend/.env` — copy from `.env.example`)

| Variable          | Default                      | Description              |
|-------------------|------------------------------|--------------------------|
| `VITE_API_BASE`   | `http://localhost:4000/api`  | Backend API base URL    |

---

## Available API Endpoints

### Public (no auth)

| Method | Endpoint                  | Description              |
|--------|---------------------------|--------------------------|
| GET    | `/api/health`             | Health check             |
| GET    | `/api/services`           | List all services        |
| GET    | `/api/services/:slug`     | Service by slug          |
| GET    | `/api/projects`           | List all projects        |
| GET    | `/api/projects/:slug`     | Project by slug          |
| GET    | `/api/articles`           | List published articles  |
| GET    | `/api/articles/:slug`     | Article by slug          |
| POST   | `/api/inquiries`          | Submit a lead/inquiry    |
| POST   | `/api/auth/login`         | JWT login                |

### Admin (auth required)

| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| CRUD   | `/api/admin/services`             | Manage services          |
| CRUD   | `/api/admin/projects`             | Manage projects          |
| CRUD   | `/api/admin/articles`             | Manage articles          |
| CRUD   | `/api/admin/pages`                | Manage pages             |
| CRUD   | `/api/admin/leads`                | Manage leads             |
| CRUD   | `/api/admin/media`                | Manage media files       |
| CRUD   | `/api/admin/settings`             | Manage site settings     |
| CRUD   | `/api/admin/theme`                | Manage theme             |
| CRUD   | `/api/admin/header-footer`        | Manage header & footer   |
| POST   | `/api/admin/whatsapp/send`        | Send WhatsApp message    |
| POST   | `/api/admin/llm/chat`             | LLM agent chat           |

---

## NPM Scripts

### Backend

| Script             | Command                        |
|--------------------|--------------------------------|
| `npm run dev`      | `node --watch src/server.js`  |
| `npm start`        | `node src/server.js`          |
| `npm test`         | `node --test src/tests`       |
| `npm run seed`     | `node src/seed.js`            |

### Frontend

| Script             | Command                        |
|--------------------|--------------------------------|
| `npm run dev`      | `vite`                        |
| `npm run build`    | `tsc -b && vite build`        |
| `npm run preview`  | `vite preview`                |
| `npm run lint`     | `eslint .`                    |

---

## Troubleshooting

| Problem                        | Solution                                             |
|--------------------------------|------------------------------------------------------|
| Backend won't start            | Ensure Node >= 18. Check `.env` file exists.         |
| Frontend can't reach backend   | Verify `VITE_API_BASE` in `frontend/.env` matches backend URL. |
| CORS errors                    | Ensure `CLIENT_ORIGIN` in `backend/.env` matches the frontend URL. |
| Login fails                    | Use the correct credentials from the table above.    |
| Port already in use            | Change `PORT` in `backend/.env` or `vite.config.ts`. |
| Blank page on frontend         | Check the browser console for errors. Run `npm run build` to check for TypeScript errors. |

---

## Notes

- The backend uses an **in-memory data store** by default — all data resets when the server restarts.
- To use **MongoDB**, set `MONGODB_URI` in `backend/.env` and `USE_MEMORY_STORE=false`.
- The WhatsApp Business API and LLM Agent features require API keys and are **disabled** in development by default.
- File uploads are stored in `backend/uploads/`.
