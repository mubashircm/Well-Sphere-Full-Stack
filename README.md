# WellSphere

Evidence-aware health content, lifestyle guidance, and editorial wellness platform built on the MERN stack.

## Architecture

**Frontend:**
- Vite 8 + React 19
- JavaScript
- Vanilla CSS + Tailwind CSS

**Backend:**
- Node.js (ESM) + Express 5
- MongoDB (Mongoose 8) + Cloudinary Media Storage

**Stack:**
- MERN (Modular 6-Layer Architecture: `Route -> Middleware -> Controller -> Service -> Repository -> MongoDB`)

## Project Structure

- `client/` → Modern React SPA with route code-splitting, accessible design, and responsive media utilities
- `server/` → Production-hardened REST API with RBAC, session cookie security, rate limiting, and Cloudinary storage
- `docs/` → Project status tracker, architecture decisions, and production deployment runbooks

## Development

- Start client dev server: `npm run dev:client`
- Start server dev server: `npm run dev:server`
- Build client bundle: `npm run build:client`
- Lint client code: `npm run lint:client`