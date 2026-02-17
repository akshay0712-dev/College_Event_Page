# GEC Freshers Event Platform

A full-stack event website for **GEC Kishanganj Freshers’ Night**, built with React + Vite and powered by Firebase for realtime content management, authentication, storage, and registrations.

This project has two major parts:
- A **public-facing event website** (hero, timeline, videos, speakers, gallery, tickets, FAQ, contact, etc.)
- A **protected admin dashboard** for managing all dynamic content and reviewing student registrations

## Table of Contents

- Project Overview
- Core Features
- Tech Stack
- Runtime Architecture
- Application Routes
- Admin Dashboard Modules
- Firestore Data Model
- Firebase Storage Structure
- Project Structure
- Local Setup
- Firebase Setup
- Environment & Security Notes
- Available Scripts
- Deployment (Vercel)
- Current Known Issues
- Suggested Improvements
- Troubleshooting

## Project Overview

This application is designed to let organizers publish and manage a fresher event website without changing code each time event data changes. Most public content is fetched from Firestore in realtime, and admins can create/update/delete content through a dashboard.

The app includes:
- Realtime content updates on public pages via Firestore listeners
- Role-gated admin area via Firebase Authentication
- Registration flow with photo + payment screenshot upload to Firebase Storage
- Event-centric linking (`eventId`) so content can be grouped by event
- Single-page behavior with smooth section-based navigation and animated UI

## Core Features

### Public Site

- Dynamic hero section from Firestore (`heroEvents`)
- Event countdown timer and hero media (image/video)
- Dynamic timeline categories from `events`
- Video highlight section from `videos`
- Speakers section from `speakers`
- News feed from `news`
- Animated gallery from `gallery`
- Tiered sponsors section from `sponsors`
- Ticket cards from `tickets`
- Team/committee section from `team`
- FAQ accordion and contact form UI
- Full-screen startup loader and background particle effects

### Admin Panel

- Secure admin login (`/login`) with Firebase Auth email/password
- Protected dashboard route (`/admin`)
- CRUD for:
  - Hero events
  - Tickets
  - News
  - Timeline events
  - Videos
  - Speakers
  - Team
  - Gallery
  - Sponsors
  - Registrations (verify/reject/delete)
- Event Monitor sidebar with current/upcoming/previous events
- Linked-item counting and cascading delete for event-linked data

### Registration Workflow

- Multi-step registration form
- Creates Firebase Auth account for student
- Uploads profile photo + payment screenshot to Firebase Storage
- Writes registration record to Firestore (`registrations`)
- Waits for admin verification in realtime (pending -> verified/rejected)

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router DOM 7
- Tailwind CSS 4 (`@tailwindcss/vite` plugin)
- Framer Motion
- GSAP + Draggable plugin
- Lucide React + Font Awesome

### Backend-as-a-Service (Firebase)

- Firebase Authentication
- Cloud Firestore (with `initializeFirestore` long polling config)
- Firebase Storage

### Tooling

- ESLint 9 (flat config)
- Vercel deployment config (`vercel.json`)

## Runtime Architecture

- `src/main.jsx` mounts the app in strict mode.
- `src/App.jsx` controls:
  - global loading gate (`FullScreenLoader`)
  - auth readiness
  - route protection (`/admin`, `/login`)
  - rendering of main public site sections
- Most content components use Firestore `onSnapshot` listeners for realtime updates.
- Admin dashboard uses large, centralized state and per-module handlers for CRUD.

## Application Routes

| Route | Access | Purpose |
|------|--------|---------|
| `/` | Public | Main event landing page |
| `/login` | Public | Admin authentication page |
| `/admin` | Auth required | Full dashboard for content and registration management |

### Important Route Note

`Hero.jsx` links to `/register`, and a `Registration.jsx` component exists, but `/register` route is **not currently wired** in `App.jsx`.

## Admin Dashboard Modules

Admin dashboard (`src/pages/admin/Dashboard.jsx`) contains modules/tabs for:
- Registrations
- Hero Events
- Tickets
- News
- Timeline Events
- Videos
- Speakers
- Team
- Gallery
- Sponsors

Each module supports list rendering + add/edit/delete operations (with Firestore).

## Firestore Data Model

Below is the practical schema inferred from the current code.

### `heroEvents`

- `title: string`
- `date: string` (human-readable display date)
- `location: string`
- `eventDate: Timestamp` (canonical event date/time)
- `backgroundImage: string`
- `backgroundVideo: string`
- `status: string` (e.g., `upcoming`)
- `createdAt: Timestamp`
- `updatedAt: Timestamp`

### `tickets`

- `name: string`
- `price: string | number`
- `features: string[]`
- `featured: boolean`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `news`

- `title: string`
- `cat: string`
- `date: string` (formatted for UI)
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `events` (timeline)

- `title: string`
- `time: string`
- `desc: string`
- `icon: string` (Font Awesome class suffix)
- `order: number`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `videos`

- `url: string`
- `title: string`
- `description: string`
- `thumbnail: string`
- `orientation: 'landscape' | 'portrait'`
- `order: number`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `speakers`

- `name: string`
- `role: string`
- `img: string`
- `order: number`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `team`

- `name: string`
- `role: string`
- `img: string`
- `order: number`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `gallery`

- `url: string`
- `alt: string`
- `category: string`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `sponsors`

- `name: string`
- `logo: string`
- `website: string`
- `tier: 'platinum' | 'gold' | 'silver'`
- `order: number`
- `eventId: string | null`
- `createdAt: Timestamp`
- `updatedAt?: Timestamp`

### `registrations`

- `uid: string`
- `email: string`
- `fullName: string`
- `collegeRollNo: string`
- `registrationNo: string`
- `branch: string`
- `gender: string`
- `phone: string`
- `utrNumber: string`
- `profileUrl: string`
- `paymentUrl: string`
- `status: 'pending' | 'verified' | 'rejected'`
- `verificationMessage?: string`
- `verifiedAt?: Timestamp`
- `verifiedBy?: string`
- `adminEmail: string`
- `createdAt: Date | Timestamp`

## Firebase Storage Structure

Used by registration flow:

- `fresher2025/{uid}/profile.jpg`
- `fresher2025/{uid}/payment.jpg`

## Project Structure

```text
College_Event_Page/
  public/
    vite.svg
  src/
    components/
      About.jsx
      BackgroundParticles.jsx
      Contact.jsx
      EventCategories.jsx
      FAQ.jsx
      Footer.jsx
      FullScreenLoader.jsx
      Gallery.jsx
      Hang.jsx
      Header.jsx
      Hero.jsx
      NewsFeed.jsx
      Registration.jsx
      Speakers.jsx
      Sponsor.jsx
      Team.jsx
      Tickets.jsx
      VideoHighlights.jsx
    css/
      Contact.css
      Footer.css
      Gallery.css
      Header.css
      Registration.css
    firebase/
      config.js
    pages/admin/
      AdminLogin.jsx
      Dashboard.jsx
    utils/
      migrateGallery.js
    App.jsx
    index.css
    main.jsx
  eslint.config.js
  index.html
  package.json
  vercel.json
  vite.config.js
```

## Local Setup

### Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Firebase project configured for:
  - Authentication (Email/Password)
  - Firestore
  - Storage

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open local URL printed by Vite (typically `http://localhost:5173`).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Firebase Setup

Current Firebase initialization lives in:
- `src/firebase/config.js`

It currently contains hardcoded Firebase config values. Recommended production approach:
- move values to environment variables
- use `.env` / `.env.local`
- avoid committing sensitive runtime config conventions without intent

Example env keys you can use:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Then map them in `config.js` via `import.meta.env`.

## Environment & Security Notes

- Configure Firestore security rules so only authorized admins can write event collections.
- Restrict Storage upload paths and file sizes with Storage rules.
- Ensure only trusted admins can verify or reject registrations.
- Do not rely solely on client checks for role protection.

## Available Scripts

From `package.json`:

- `npm run dev` -> start Vite development server
- `npm run build` -> create production build
- `npm run preview` -> preview production build locally
- `npm run lint` -> run ESLint across project

## Deployment (Vercel)

`vercel.json` includes SPA rewrite:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures deep links like `/admin` resolve correctly on refresh.

Recommended deploy flow:
- Push repository to Git provider
- Import project into Vercel
- Set production environment variables
- Deploy

## Current Known Issues

- `/register` route not configured in `App.jsx` although referenced from hero CTA.
- Several UI strings show character encoding artifacts in some files.
- `src/App.css` contains default Vite template CSS and appears unused.
- Some CSS module files exist but are empty (`Contact.css`, `Header.css`).
- Contact/FAQ submit actions are mostly UI-level and not fully integrated with backend workflows.

## Suggested Improvements

- Wire `Registration` page to router (`/register`) and add auth guards as needed.
- Add centralized role-based admin checks.
- Move Firebase credentials to env-based config.
- Split large dashboard component into smaller feature modules.
- Add form validation library (e.g., Zod + React Hook Form).
- Add loading/error boundaries and toast system.
- Add unit/integration tests (Vitest + React Testing Library).
- Add accessibility audit and semantic improvements.

## Troubleshooting

### Firestore query/index errors

If Firestore throws index-required errors for compound `where + orderBy` queries:
- open the Firebase console link from the error
- create required composite indexes

### Admin login not working

- ensure Email/Password auth is enabled in Firebase
- verify credentials exist in Firebase Authentication users

### Media upload failures

- verify Firebase Storage rules allow the authenticated write path
- verify file size and type constraints

### Dashboard appears blank

- check browser console for Firestore permission errors
- verify collection names match exactly:
  - `heroEvents`, `tickets`, `news`, `events`, `videos`, `speakers`, `team`, `gallery`, `sponsors`, `registrations`

---

If needed, this README can be expanded further with:
- explicit Firestore security rule templates
- Storage rule templates
- step-by-step admin onboarding guide
- seed data JSON for first-time setup
