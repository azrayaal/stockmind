# StockMind AI

AI-powered inventory dashboard POC for Indonesian SMEs.

## Tech Stack

- **Next.js 16** — App Router
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** — Radix-based components
- **Recharts** — Dashboard charts
- **Zustand** — State management
- **React Hook Form + Zod** — Form validation

## Getting Started

```bash
cd stockmind-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login

Use any email/password — authentication is mocked for POC demo.

Pre-filled: `budi@tokoberkahjaya.id` / `demo123`

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Authentication UI |
| `/dashboard` | Analytics overview with charts |
| `/inventory` | Product CRUD with search/filter |
| `/incoming` | Stock-in transactions |
| `/outgoing` | Stock-out transactions |
| `/forecast` | AI restock predictions (mock) |
| `/alerts` | Low stock, overstock, unusual movement |
| `/reports` | Revenue, inventory, movement reports |

## Project Structure

```
app/
  login/              # Login page
  (dashboard)/        # Protected routes with sidebar layout
components/
  ui/                 # shadcn-style primitives
  dashboard/          # Stat cards, widgets
  inventory/          # Product & transaction modals
  charts/             # Recharts wrappers
  layout/             # Sidebar, navbar, auth guard
store/                # Zustand stores (auth + inventory)
mock/                 # Indonesian SME mock data
types/                # TypeScript interfaces
lib/                  # Utilities (cn, formatCurrency)
```

## Features

- Responsive sidebar + mobile menu
- Dark mode ready (system preference)
- Mock AI forecast with confidence scores
- Real-time state updates via Zustand
- Indonesian product examples (Indomie, Teh Botol Sosro, etc.)

## Notes

This is a **Proof of Concept** — no real backend, AI, or authentication. All data is mocked and stored in client-side state.
# stockmind
