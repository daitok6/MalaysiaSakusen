# Sakusen Tracker — Web App Design Spec

> Date: 2026-03-28 | Target: Deploy on Vercel, shared between two users

---

## Overview

A lightweight, design-heavy Next.js web app to track progress on the Malaysia relocation plan. Shared between Daito and partner — no auth, no traditional database. Malaysian flag-inspired warm design with encouraging tone.

---

## Architecture

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 14 App Router | Full-stack, Vercel-native |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS + shadcn/ui | Fast, beautiful components |
| Data store | Vercel KV (Upstash Redis) | No-schema key-value, free tier, shared state |
| Currency rates | frankfurter.app | Free, no API key required |
| Charts | Recharts | Income/savings visualizations |
| Hosting | Vercel | Free tier, auto-deploy |
| Auth | None | Simple name picker (localStorage) |

### Data Flow

1. All task/financial/visa data stored in Vercel KV as JSON blobs
2. Next.js API routes read/write to KV
3. Client fetches data via API routes, renders with currency conversion
4. Currency rates fetched from frankfurter.app, cached client-side (1hr TTL)
5. User identity is a name picker stored in localStorage — no passwords

---

## Design Language: "Jalur Gemilang Warm"

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Primary (red) | #D4423B | Buttons, active states, progress fills |
| Accent (gold) | #F5C518 | Highlights, badges, celebrations |
| Navy | #1A237E | Header/nav, headings, dark text |
| Background | #FFF8F0 | Page background, warm cream |
| Text | #1A1A3E | Body text, warm dark navy |
| Success | #2E7D6F | Completed states, done badges |
| Card base | #FFFFFF | Card backgrounds with warm shadow |

### Typography

- **Font:** Plus Jakarta Sans (Google Fonts) — rounded, friendly, approachable
- **Headings:** Bold, navy (#1A237E)
- **Body:** Regular, warm dark (#1A1A3E)

### Design Elements

- Large border-radius on cards (12-16px)
- Soft warm shadows (rgba warm-toned)
- Red-and-white striped patterns for progress bars (flag's 14 stripes motif)
- Gold crescent-and-star as subtle logo/brand element in nav
- Subtle batik-inspired dividers between sections
- Gold confetti + "Bagus!" / "Boleh!" celebrations on milestones

### Tone of Voice

- Warm, encouraging, celebratory
- Mix of English and Malay exclamations: "Bagus!" (great), "Boleh!" (can do), "Syabas!" (well done)
- Progress messages: "You're X% closer to KL!", "One step at a time — you've got this!"
- Rotating encouragement banners on the dashboard

---

## Pages

### 1. Dashboard (`/`)

**Purpose:** At-a-glance progress overview and motivation.

**Components:**

- **Hero / Flight Path:** Stylized Tokyo → KL dotted arc with airplane icon. Airplane position = % of time elapsed between now and Nov 2026.
- **Countdown Card:** Large display — "X days until KL" with crescent-and-star motif. Gold background.
- **Quick Stats Row:** 4 metric cards:
  - Tasks completed (% across all categories)
  - Savings progress (current vs ¥1,200,000 target)
  - Side income this month
  - Visa status (phase label + % steps done)
- **Upcoming Deadlines:** Next 5 tasks by due date, showing title, category icon, priority badge, assignee
- **Encouragement Banner:** Rotating messages — "You've completed X tasks — Bagus!", "Y days closer to Mont Kiara!"
- **Global Currency Selector:** In the header/nav bar, dropdown for MYR / USD / JPY. Persists across all pages via localStorage.

### 2. Checklist (`/checklist`)

**Purpose:** Track all ~50 tasks from the master plan.

**Components:**

- **Category Tabs:** Visa & Legal | Income | Business | Life & Logistics | Tech — each with an icon
- **Task Cards:** Per task:
  - Title
  - Priority badge (Critical = red, High = gold, Medium = navy, Low = muted)
  - Deadline (with overdue warning if past)
  - Assignee chip (Daito / Partner)
  - Status: 3-state pill toggle (Todo → In Progress → Done)
  - Dependency label ("Blocked by: V2")
- **Category Progress Bar:** Red-and-white striped fill showing % completed per tab
- **Filter Bar:** Filter by assignee, priority, status
- **Celebration:** Category hits 100% → gold confetti burst + "Boleh!" badge

**Initial Data:** All tasks from MASTER_PLAN.md sections 6 (Visa V1-V22, Income I1-I11, Business B1-B12, Life L1-L13, Tech T1-T9) pre-loaded into KV on first deploy via a seed script.

### 3. Finances (`/finances`)

**Purpose:** Track savings, income, and cost of living — all amounts in selected currency.

**Components:**

- **Savings Progress Bar:** Current savings vs ¥1,200,000 target. Large, prominent, striped fill.
- **Monthly Savings Table:** Columns: Month, Salary Saved, Side Income, Cumulative (Projected), Cumulative (Actual). Data from master plan with editable "Actual" column.
- **Cost of Living Comparison:** Side-by-side cards — Tokyo vs Mont Kiara:
  - Rent, Utilities, Food, Transport, Health Insurance, Misc
  - All amounts in selected currency
  - Total monthly cost with difference highlighted
- **August Checkpoint Gate:** Highlighted card with 3 metrics:
  - Savings ≥ ¥400,000? (green check / red X)
  - Side income ≥ ¥80,000/mo? (green check / red X)
  - 納税管理人 identified? (green check / red X)
- **Income by Layer:** 3 cards (Layer 1 / Layer 2 / Layer 3) each showing target range and actual for current month

**Editable fields:** Users can update actual savings and actual income per month. Stored in KV.

### 4. Visa Tracker (`/visa`)

**Purpose:** Step-by-step visa application progress.

**Components:**

- **Vertical Timeline:** Phases A through D from the master plan, displayed as a vertical line with nodes:
  - Phase A: Foundation (Apr-Jun 2026)
  - Phase B: Income Building (May-Aug 2026)
  - Phase C: Visa Application (Aug-Sep 2026)
  - Phase D: Relocation (Oct-Nov 2026)
- **Step Nodes:** Each step within a phase shows:
  - Title and description
  - Status badge (Pending / In Progress / Completed / Blocked)
  - Due date
  - Editable notes field
  - Completion toggle
- **Document Checklist:** The 9 required documents:
  1. Valid passports (18+ months)
  2. Marriage certificate (English)
  3. Proof of income (3 months)
  4. Employment contract / freelance invoices
  5. CV / Resume (both)
  6. Portfolio of digital work
  7. Health/travel insurance policy
  8. Passport photos
  9. MDEC application form
  10. Proof of accommodation
  - Each with status: Not Started / In Progress / Ready
- **Application Countdown:** Days until Aug 15, 2026 (target submission)
- **Dependency Info:** Labels showing which steps must complete before application submission

---

## Data Model (Vercel KV)

All data stored as JSON values under string keys:

### Key: `tasks`

```typescript
type Task = {
  id: string;           // e.g., "V1", "I3", "B5", "L2", "T1"
  title: string;
  description?: string;
  category: "visa" | "income" | "business" | "life" | "tech";
  priority: "critical" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  deadline?: string;    // ISO date
  assignee?: string;    // "Daito" | partner name
  dependsOn?: string[]; // task IDs
  updatedBy?: string;
  updatedAt?: string;   // ISO datetime
};
```

### Key: `savings`

```typescript
type SavingsEntry = {
  month: string;          // "2026-04", "2026-05", etc.
  projectedSalary: number;
  projectedSideIncome: number;
  projectedCumulative: number;
  actualSalary?: number;
  actualSideIncome?: number;
  actualCumulative?: number;
  currency: "JPY";        // stored in JPY, converted at render
};
```

### Key: `visa_steps`

```typescript
type VisaStep = {
  id: string;
  phase: "A" | "B" | "C" | "D";
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "blocked";
  dueDate?: string;
  notes?: string;
  completedAt?: string;
  sortOrder: number;
};
```

### Key: `documents`

```typescript
type Document = {
  id: string;
  name: string;
  status: "not_started" | "in_progress" | "ready";
  notes?: string;
};
```

### Key: `settings`

```typescript
type Settings = {
  userNames: string[];       // ["Daito", "Partner Name"]
  preferredCurrency: "MYR" | "USD" | "JPY";
};
```

---

## Currency Conversion

- **Source:** frankfurter.app (`https://api.frankfurter.app/latest?from=JPY&to=USD,MYR`)
- **Caching:** Client-side, 1-hour TTL. Rates stored in React context.
- **Storage format:** All monetary values stored in their original currency with a `currency` field
- **Render:** A `<Money amount={100000} currency="JPY" />` component that converts and formats based on global selected currency
- **Supported currencies:** JPY (¥), USD ($), MYR (RM)
- **Fallback:** If API is unreachable, use hardcoded rates: 1 USD = 150 JPY = 4.5 MYR

---

## Seed Data

A seed script (`scripts/seed.ts`) that populates Vercel KV with initial data from the master plan:

- 50+ tasks across 5 categories (V1-V22, I1-I11, B1-B12, L1-L13, T1-T9)
- 7 months of projected savings data (Apr-Oct 2026)
- 4 visa phases with ~15 timeline steps
- 10 document checklist items
- Default settings

The seed script is idempotent — it only writes if keys don't exist.

---

## User Identity

- On first visit, a modal asks "Who are you?" with buttons for each user name (configured in settings)
- Selection stored in localStorage
- Displayed as a small avatar/chip in the header
- Used to tag task updates ("Marked done by Daito")
- No passwords, no auth — purely cosmetic identity

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/tasks` | GET | Fetch all tasks |
| `/api/tasks` | PUT | Update a task's status/assignee/notes |
| `/api/savings` | GET | Fetch savings data |
| `/api/savings` | PUT | Update actual savings for a month |
| `/api/visa` | GET | Fetch visa steps + documents |
| `/api/visa` | PUT | Update a visa step or document status |
| `/api/settings` | GET/PUT | Read/update settings |
| `/api/rates` | GET | Proxy to frankfurter.app (caching layer) |
| `/api/seed` | POST | Run seed script (one-time) |

---

## Non-Goals (Explicitly Out of Scope)

- Authentication / passwords
- Multi-team support (this is for 2 people)
- Document file uploads
- Push notifications
- Mobile app (responsive web is sufficient)
- Offline support
- Decision log / Notes pages (can add later)
- Income entry tracking (using editable savings table instead)
