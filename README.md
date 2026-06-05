# Okapi Real Estate — Frontend

A full-featured real estate web platform built with **Next.js 16** and **React 19**, targeting the Congolese (DRC) property market. The platform covers property listings for buying, renting, selling, and commercial real estate, alongside agent and agency directories, a blog, and a complete user dashboard.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [API Architecture](#api-architecture)
- [State Management](#state-management)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | TypeScript 5 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| UI Components | [Radix UI](https://www.radix-ui.com), [shadcn/ui](https://ui.shadcn.com) |
| Icons | [Lucide React](https://lucide.dev) |
| State Management | [Zustand 5](https://zustand-demo.pmnd.rs) |
| Server State / Caching | [TanStack Query v5](https://tanstack.com/query) |
| HTTP Client | [Axios](https://axios-http.com) |
| Forms | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev) |
| Utilities | clsx, tailwind-merge, class-variance-authority |

---

## Project Structure

```
src/
├── app/
│   ├── (pages)/
│   │   ├── (dashboard)/        # Authenticated / user-account pages
│   │   │   ├── profil/
│   │   │   ├── favoris/
│   │   │   ├── demandes/
│   │   │   ├── alertes/
│   │   │   ├── avis/
│   │   │   ├── connexion/
│   │   │   ├── inscription/
│   │   │   ├── mot-de-passe-oublie/
│   │   │   ├── a-propos/
│   │   │   ├── carrieres/
│   │   │   ├── contact/
│   │   │   ├── conditions-generales/
│   │   │   ├── confidentialite/
│   │   │   ├── cookies/
│   │   │   ├── plan-du-site/
│   │   │   └── conseils/       # Advice & guides sub-section
│   │   └── (marketing)/        # Public-facing marketing pages
│   │       ├── page.tsx        # Home page
│   │       ├── acheter/        # Buy property listings
│   │       ├── louer/          # Rent property listings
│   │       ├── vendre/         # Sell / property estimation
│   │       ├── commercial/     # Commercial real estate
│   │       ├── property/[id]/  # Property detail
│   │       ├── agents/         # Agent directory & detail
│   │       ├── agences/        # Agency directory & detail
│   │       └── blog/           # Blog listing & article detail
│   └── api/                    # Next.js Route Handlers (BFF layer)
│       ├── auth/
│       ├── agency/
│       ├── listings/
│       └── user/
├── features/                   # Feature-scoped modules
│   ├── home/
│   ├── properties/
│   ├── agents/
│   ├── agency/
│   └── user/
├── shared/                     # Global reusable components & utilities
│   ├── components/
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Buttons, cards, icons, loaders
│   └── utils/
├── hooks/                      # Custom React hooks
├── lib/                        # Server-side data fetching helpers
├── services/                   # Axios service layer (client-side)
└── store/                      # Zustand global stores
```

---

## Pages & Features

### Home (`/`)
- **Hero** — Full-width search banner with property type tabs
- **Regions** — Browse properties by Kinshasa neighbourhoods
- **Discover** — Featured / recommended listings carousel
- **Content Sections** — Buyer, seller, and tenant value propositions
- **Mobile App CTA** — App Store / Google Play download prompt
- **About Section** — Company overview teaser

### Buy (`/acheter`)
Sub-categories: Appartements, Maisons de ville, Villas, Terrains

### Rent (`/louer`)
Sub-categories: Appartements, Studios, Maisons de ville, Villas

### Sell (`/vendre`)
- General sell landing page
- Sub-pages for Appartement and Maison
- **Free property estimation** (`/vendre/estimation`)

### Commercial (`/commercial`)
- **For Sale**: Bureaux, Entrepôts, Magasins, Terrains
- **For Rent**: Bureaux, Entrepôts, Magasins
- Commercial news / actualités

### Property Detail (`/property/[id]`)
- Full image gallery
- Key facts: bedrooms, bathrooms, area, parking
- Travel time indicators (walk, train)
- Agent contact panel with WhatsApp shortcut
- Save to favourites (authenticated)
- Share button
- Premium / Verified / New badges

### Agents (`/agents`, `/agents/[id]`)
- Searchable agent directory with pagination
- Agent profile: bio, listings, star rating, contact details
- Agent selection component for filtering

### Agencies (`/agences`, `/agences/[id]`)
- Agency directory cards
- Agency detail with associated properties and agents

### Blog (`/blog`, `/blog/[slug]`)
- Article listing with category filters and load-more pagination
- Full article detail with rich content
- Links to related commercial articles

### Advice / Conseils (`/conseils`)
Sub-pages: Guide acheteur, Guide vendeur, Guide locataire, Quartiers, Communautés, Écoles & Universités, Tours & Résidences

### User Dashboard (authenticated)
| Route | Feature |
|---|---|
| `/profil` | Edit personal info, change password |
| `/favoris` | Saved / favourite properties |
| `/demandes` | Property enquiry history |
| `/alertes` | Search alert management |
| `/avis` | Reviews left for agents / properties |

### Auth
- `/connexion` — Login with JWT auth
- `/inscription` — User registration
- `/mot-de-passe-oublie` — Password reset request

### Static / Legal Pages
`/a-propos`, `/carrieres`, `/contact`, `/conditions-generales`, `/confidentialite`, `/cookies`, `/plan-du-site`

---

## API Architecture

The app uses a **Backend-for-Frontend (BFF)** pattern. All API calls from the browser go through Next.js Route Handlers located in `src/app/api/`, which proxy requests to the external backend and handle auth headers.

```
Browser → Next.js API Routes → External Backend API
```

A URL rewrite in `next.config.ts` maps `/api/proxy/*` → `${API_URL}/*` for server-side fetching.

### API Route Groups

| Prefix | Purpose |
|---|---|
| `/api/auth` | Login, registration, forgot-password |
| `/api/listings/properties` | Property CRUD and search |
| `/api/listings/agents` | Agent listing and detail |
| `/api/listings/agencies` | Agency listing and detail |
| `/api/user/favorites` | Add / remove favourites |
| `/api/user/enquiries` | Contact / enquiry submission |
| `/api/user/alerts` | Search alert CRUD + matches |
| `/api/user/reviews` | Post and fetch reviews |

Server-side data fetching (for SSR pages) is handled by helpers in `src/lib/` using `fetch` with `cache: "no-store"`.

---

## State Management

### Zustand Stores (`src/store/`)

| Store | Purpose |
|---|---|
| `useAuthStore` | JWT token, user object, `isAuthenticated` flag — persisted to `localStorage` under the key `okapi-auth` |
| `useAgentsStore` | Client-side agent list and filter state |
| `useAgenciesStore` | Client-side agency list state |

### TanStack Query (`src/store/QueryProvider.tsx`)
Wraps the app to enable server-state caching, background refetching, and optimistic updates for property, agent, and user data fetched on the client.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd okapi-real-estate-frontend

# Install dependencies
pnpm install
```

### Running the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env.local` file at the project root:

```env
# URL of the backend REST API
API_URL=http://localhost:4000
```

| Variable | Description | Default |
|---|---|---|
| `API_URL` | Base URL of the backend API consumed by server-side helpers and the Next.js proxy rewrite | `http://localhost:3000` |

---

## Available Scripts

```bash
pnpm dev        # Start dev server with Turbopack
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

---

## Deployment

The app is designed to be deployed on [Vercel](https://vercel.com). Set the `API_URL` environment variable in your Vercel project settings to point to your production backend.

```bash
# Build for production locally
pnpm build
pnpm start
```

For other platforms (Railway, Render, AWS, etc.) ensure the `API_URL` environment variable is set and the Node.js server can serve the `.next` output via `next start`.
