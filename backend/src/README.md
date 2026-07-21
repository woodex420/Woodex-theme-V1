# WP Interior Backend

Node.js + Express API for the WP Interior Studio admin platform.

## Quick Start

```bash
npm install
cp .env.example .env
npm run seed    # Seed initial data
npm run dev     # Start on :4000
```

## Endpoints

All endpoints are prefixed with `/api/`. See main README for full list.

## WebSocket

Connect to `ws://localhost:4000` and emit/listen for events:
- `agent:online`, `agent:offline`
- `conversation:join`, `conversation:message`, `conversation:typing`
- `builder:join`, `builder:update`, `builder:cursor`
- Server: `lead:new`, `conversation:new`, `agents:online`

## Docker

```bash
docker build -t wp-interior-api .
docker run -p 4000:4000 wp-interior-api
```

## Environment

- `MONGODB_URI` — Optional. Falls back to in-memory store if not set.
- `WHATSAPP_BUSINESS_TOKEN` — Optional. Falls back to demo mode.
- `OPENAI_API_KEY` — Optional. Required for LLM features.

## Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | wpinterior2024 | admin |
| editor | editor2025 | editor |
| demo | demo123 | viewer |
