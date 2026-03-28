# Sakusen Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a warm, Malaysia-themed progress tracker web app with 4 pages (Dashboard, Checklist, Finances, Visa), shared between two users via Vercel KV, with live currency conversion.

**Architecture:** Next.js 14 App Router with TypeScript. All data stored in Vercel KV as JSON blobs, accessed via API routes. Currency conversion via frankfurter.app with client-side caching. No auth — just a name picker stored in localStorage.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Vercel KV (@vercel/kv), Recharts, Plus Jakarta Sans font

**Spec:** `docs/superpowers/specs/2026-03-28-sakusen-tracker-app-design.md`

---

## File Structure

```
app/
  layout.tsx                    - Root layout: font, theme, providers, nav
  page.tsx                      - Dashboard page
  checklist/page.tsx            - Checklist page
  finances/page.tsx             - Finances page
  visa/page.tsx                 - Visa tracker page
  globals.css                   - Tailwind + custom CSS (colors, fonts, striped progress bars)
  api/
    tasks/route.ts              - GET/PUT tasks
    savings/route.ts            - GET/PUT savings entries
    visa/route.ts               - GET/PUT visa steps + documents
    settings/route.ts           - GET/PUT settings
    rates/route.ts              - GET currency rates (proxy + cache)
    seed/route.ts               - POST seed data (idempotent)
components/
  nav.tsx                       - Header: logo, nav links, currency selector, user chip
  currency-provider.tsx         - React context for currency state + rates
  money.tsx                     - <Money> component: converts + formats amounts
  user-picker-modal.tsx         - First-visit "Who are you?" modal
  countdown.tsx                 - Days-until-KL countdown display
  flight-path.tsx               - Tokyo→KL flight path SVG with airplane
  task-card.tsx                 - Individual task card (checklist)
  progress-bar.tsx              - Striped progress bar (flag motif)
  stat-card.tsx                 - Metric card for dashboard
  encouragement-banner.tsx      - Rotating warm messages
  savings-table.tsx             - Monthly savings table with editable actuals
  cost-comparison.tsx           - Tokyo vs KL cost of living cards
  checkpoint-gate.tsx           - August checkpoint card
  visa-timeline.tsx             - Vertical timeline for visa phases
  document-checklist.tsx        - Document status checklist
  ui/                           - shadcn/ui components (installed via CLI)
lib/
  types.ts                      - All shared TypeScript types
  kv.ts                         - Vercel KV read/write helpers
  currency.ts                   - Conversion logic + formatting
  seed-data.ts                  - All initial data (tasks, savings, visa steps, documents)
  encouragements.ts             - Array of warm messages
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`, `next.config.ts`

- [ ] **Step 1: Initialize Next.js project**

```bash
cd /Users/Daito/repos/MalaysiaSakusen
npx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

This creates the project in an `app/` subfolder — we'll move files up after. Actually, create it in-place:

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```

If it warns about existing files, that's fine — it won't overwrite docs/.

- [ ] **Step 2: Install dependencies**

```bash
npm install @vercel/kv recharts
npm install -D @types/node
```

- [ ] **Step 3: Initialize shadcn/ui**

```bash
npx shadcn@latest init -d
```

When prompted, select defaults (New York style, Zinc base color, CSS variables yes). This creates `components/ui/` and `lib/utils.ts`.

- [ ] **Step 4: Install shadcn components we'll need**

```bash
npx shadcn@latest add button card badge tabs select dialog table dropdown-menu tooltip progress
```

- [ ] **Step 5: Add Plus Jakarta Sans font and custom theme to globals.css**

Replace `app/globals.css` with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: #FAF6F1;
  --color-foreground: #3D3D50;
  --color-card: #FFFDF9;
  --color-card-foreground: #3D3D50;
  --color-popover: #FFFDF9;
  --color-popover-foreground: #3D3D50;
  --color-primary: #C4706E;
  --color-primary-foreground: #FFFDF9;
  --color-secondary: #F0EBE4;
  --color-secondary-foreground: #2D3A5C;
  --color-muted: #F0EBE4;
  --color-muted-foreground: #7A7A8E;
  --color-accent: #E8C97A;
  --color-accent-foreground: #2D3A5C;
  --color-destructive: #C4706E;
  --color-destructive-foreground: #FFFDF9;
  --color-border: #E8E0D6;
  --color-input: #E8E0D6;
  --color-ring: #C4706E;
  --color-success: #6B9E8A;
  --color-success-foreground: #FFFDF9;
  --color-navy: #2D3A5C;
  --color-gold: #E8C97A;
  --radius: 0.75rem;

  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-background text-foreground font-sans;
  }
}

/* Striped progress bar - Malaysian flag motif */
.progress-striped .progress-fill {
  background: repeating-linear-gradient(
    90deg,
    #C4706E 0px,
    #C4706E 8px,
    #FFFDF9 8px,
    #FFFDF9 16px
  );
}
```

- [ ] **Step 6: Update layout.tsx with Plus Jakarta Sans**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sakusen - Malaysia Relocation Tracker",
  description: "Track your journey from Tokyo to Kuala Lumpur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 7: Update .gitignore**

Ensure `.gitignore` includes:

```
node_modules/
.next/
.env
.env.local
.vercel
```

- [ ] **Step 8: Verify dev server starts**

```bash
npm run dev
```

Visit http://localhost:3000, confirm it loads without errors. Kill the server.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts tailwind.config.ts postcss.config.mjs .gitignore app/ components/ lib/ components.json
git commit -m "feat: scaffold Next.js project with Tailwind, shadcn/ui, Vercel KV"
```

---

## Task 2: Types + KV Helpers

**Files:**
- Create: `lib/types.ts`, `lib/kv.ts`

- [ ] **Step 1: Create shared types**

Create `lib/types.ts`:

```typescript
export type TaskCategory = "visa" | "income" | "business" | "life" | "tech";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export type Task = {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  deadline?: string;
  assignee?: string;
  dependsOn?: string[];
  updatedBy?: string;
  updatedAt?: string;
};

export type SavingsEntry = {
  month: string;
  projectedSalary: number;
  projectedSideIncome: number;
  projectedCumulative: number;
  actualSalary?: number;
  actualSideIncome?: number;
  actualCumulative?: number;
  currency: "JPY";
};

export type VisaPhase = "A" | "B" | "C" | "D";
export type VisaStepStatus = "pending" | "in_progress" | "completed" | "blocked";

export type VisaStep = {
  id: string;
  phase: VisaPhase;
  title: string;
  description?: string;
  status: VisaStepStatus;
  dueDate?: string;
  notes?: string;
  completedAt?: string;
  sortOrder: number;
};

export type DocumentStatus = "not_started" | "in_progress" | "ready";

export type TrackerDocument = {
  id: string;
  name: string;
  status: DocumentStatus;
  notes?: string;
};

export type Currency = "MYR" | "USD" | "JPY";

export type Settings = {
  userNames: string[];
  preferredCurrency: Currency;
};

export type ExchangeRates = {
  base: Currency;
  rates: Record<Currency, number>;
  fetchedAt: string;
};
```

- [ ] **Step 2: Create KV helper functions**

Create `lib/kv.ts`:

```typescript
import { kv } from "@vercel/kv";
import type { Task, SavingsEntry, VisaStep, TrackerDocument, Settings } from "./types";

export async function getTasks(): Promise<Task[]> {
  return (await kv.get<Task[]>("tasks")) ?? [];
}

export async function setTasks(tasks: Task[]): Promise<void> {
  await kv.set("tasks", tasks);
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task[]> {
  const tasks = await getTasks();
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error(`Task ${id} not found`);
  tasks[index] = { ...tasks[index], ...updates, updatedAt: new Date().toISOString() };
  await setTasks(tasks);
  return tasks;
}

export async function getSavings(): Promise<SavingsEntry[]> {
  return (await kv.get<SavingsEntry[]>("savings")) ?? [];
}

export async function setSavings(savings: SavingsEntry[]): Promise<void> {
  await kv.set("savings", savings);
}

export async function updateSavingsEntry(
  month: string,
  updates: Partial<SavingsEntry>
): Promise<SavingsEntry[]> {
  const savings = await getSavings();
  const index = savings.findIndex((s) => s.month === month);
  if (index === -1) throw new Error(`Savings entry for ${month} not found`);
  savings[index] = { ...savings[index], ...updates };
  await setSavings(savings);
  return savings;
}

export async function getVisaSteps(): Promise<VisaStep[]> {
  return (await kv.get<VisaStep[]>("visa_steps")) ?? [];
}

export async function setVisaSteps(steps: VisaStep[]): Promise<void> {
  await kv.set("visa_steps", steps);
}

export async function updateVisaStep(
  id: string,
  updates: Partial<VisaStep>
): Promise<VisaStep[]> {
  const steps = await getVisaSteps();
  const index = steps.findIndex((s) => s.id === id);
  if (index === -1) throw new Error(`Visa step ${id} not found`);
  steps[index] = { ...steps[index], ...updates };
  await setVisaSteps(steps);
  return steps;
}

export async function getDocuments(): Promise<TrackerDocument[]> {
  return (await kv.get<TrackerDocument[]>("documents")) ?? [];
}

export async function setDocuments(docs: TrackerDocument[]): Promise<void> {
  await kv.set("documents", docs);
}

export async function updateDocument(
  id: string,
  updates: Partial<TrackerDocument>
): Promise<TrackerDocument[]> {
  const docs = await getDocuments();
  const index = docs.findIndex((d) => d.id === id);
  if (index === -1) throw new Error(`Document ${id} not found`);
  docs[index] = { ...docs[index], ...updates };
  await setDocuments(docs);
  return docs;
}

export async function getSettings(): Promise<Settings> {
  return (
    (await kv.get<Settings>("settings")) ?? {
      userNames: ["Daito", "Partner"],
      preferredCurrency: "JPY",
    }
  );
}

export async function setSettings(settings: Settings): Promise<void> {
  await kv.set("settings", settings);
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts lib/kv.ts
git commit -m "feat: add shared types and Vercel KV helper functions"
```

---

## Task 3: Seed Data

**Files:**
- Create: `lib/seed-data.ts`, `app/api/seed/route.ts`

- [ ] **Step 1: Create seed data file**

Create `lib/seed-data.ts` with all tasks from the master plan. This is a large file — all data is extracted from `MASTER_PLAN.md` Section 6.

```typescript
import type { Task, SavingsEntry, VisaStep, TrackerDocument, Settings } from "./types";

export const seedTasks: Task[] = [
  // === VISA & LEGAL (V1-V22) ===
  { id: "V1", title: "Register marriage in Japan", category: "visa", priority: "critical", status: "todo", deadline: "2026-04-30", dependsOn: [] },
  { id: "V2", title: "Check passport validity (both)", category: "visa", priority: "critical", status: "todo", deadline: "2026-04-15", dependsOn: [] },
  { id: "V3", title: "Renew passports if needed", category: "visa", priority: "high", status: "todo", deadline: "2026-05-31", dependsOn: ["V2"] },
  { id: "V4", title: "Research DE Rantau latest requirements", category: "visa", priority: "high", status: "todo", deadline: "2026-04-15", dependsOn: [] },
  { id: "V5", title: "Get marriage certificate English translation", category: "visa", priority: "high", status: "todo", deadline: "2026-05-15", dependsOn: ["V1"] },
  { id: "V6", title: "Get health insurance (SafetyWing/Cigna)", category: "visa", priority: "high", status: "todo", deadline: "2026-08-01", dependsOn: [] },
  { id: "V7", title: "Compile 3 months income proof", category: "visa", priority: "critical", status: "todo", deadline: "2026-08-01", dependsOn: [] },
  { id: "V8", title: "Prepare CV/portfolio for both", category: "visa", priority: "medium", status: "todo", deadline: "2026-07-31", dependsOn: [] },
  { id: "V9", title: "Submit DE Rantau application", category: "visa", priority: "critical", status: "todo", deadline: "2026-08-15", dependsOn: ["V3", "V5", "V6", "V7", "V8"] },
  { id: "V10", title: "Receive visa approval", category: "visa", priority: "critical", status: "todo", deadline: "2026-09-15", dependsOn: ["V9"] },
  { id: "V11", title: "Check resignation notice period (both)", category: "visa", priority: "high", status: "todo", deadline: "2026-08-15", dependsOn: [] },
  { id: "V12", title: "Identify tax representative (納税管理人)", category: "visa", priority: "high", status: "todo", deadline: "2026-09-15", dependsOn: [] },
  { id: "V13", title: "Submit 納税管理人届出書 (tax office + city hall)", category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V12"] },
  { id: "V14", title: "Submit resignation (退職届) — both", category: "visa", priority: "critical", status: "todo", deadline: "2026-10-15", dependsOn: ["V10", "V11"] },
  { id: "V15", title: "Request 退職証明書 + 源泉徴収票 from employers", category: "visa", priority: "high", status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V16", title: "Use remaining 有給休暇 (both)", category: "visa", priority: "high", status: "todo", deadline: "2026-10-31", dependsOn: ["V14"] },
  { id: "V17", title: "Submit 転出届 at city hall", category: "visa", priority: "critical", status: "todo", deadline: "2026-10-20", dependsOn: ["V14"] },
  { id: "V18", title: "Cancel utilities, NHK, internet", category: "visa", priority: "medium", status: "todo", deadline: "2026-10-25", dependsOn: [] },
  { id: "V19", title: "Set up mail forwarding (転送届)", category: "visa", priority: "medium", status: "todo", deadline: "2026-10-25", dependsOn: [] },
  { id: "V20", title: "Switch mobile to povo2.0", category: "visa", priority: "low", status: "todo", deadline: "2026-10-31", dependsOn: [] },
  { id: "V21", title: "Keep JP bank account + set up online banking", category: "visa", priority: "high", status: "todo", deadline: "2026-10-31", dependsOn: [] },
  { id: "V22", title: "File 確定申告 for 2026 via 納税管理人", category: "visa", priority: "critical", status: "todo", deadline: "2027-03-15", dependsOn: ["V13"] },

  // === INCOME (I1-I11) ===
  { id: "I1", title: "Complete DataAnnotation onboarding", category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07", dependsOn: [] },
  { id: "I2", title: "Complete Outlier onboarding", category: "income", priority: "critical", status: "in_progress", deadline: "2026-04-07", dependsOn: [] },
  { id: "I3", title: "Apply to Appen, Telus, Scale AI (backup)", category: "income", priority: "high", status: "todo", deadline: "2026-04-01", dependsOn: [] },
  { id: "I4", title: "Set up Wise account (USD receiving)", category: "income", priority: "critical", status: "todo", deadline: "2026-04-10", dependsOn: [] },
  { id: "I5", title: "Create Upwork profile", category: "income", priority: "high", status: "todo", deadline: "2026-05-01", dependsOn: [] },
  { id: "I6", title: "Apply to Toptal", category: "income", priority: "medium", status: "todo", deadline: "2026-05-15", dependsOn: [] },
  { id: "I7", title: "Complete first freelance project", category: "income", priority: "high", status: "todo", deadline: "2026-06-15", dependsOn: ["I5"] },
  { id: "I8", title: "Partner: Set up CrowdWorks profile", category: "income", priority: "medium", status: "todo", deadline: "2026-04-15", dependsOn: [] },
  { id: "I9", title: "Partner: Complete HubSpot Marketing course", category: "income", priority: "medium", status: "todo", deadline: "2026-05-31", dependsOn: [] },
  { id: "I10", title: "Reach $1,500/mo side income", category: "income", priority: "critical", status: "todo", deadline: "2026-07-31", dependsOn: ["I1", "I5"] },
  { id: "I11", title: "Reach $2,500/mo side income", category: "income", priority: "high", status: "todo", deadline: "2026-09-30", dependsOn: ["I10"] },

  // === BUSINESS (B1-B12) ===
  { id: "B1", title: "Validate SaaS idea (tweet, Reddit, talk to 5 devs)", category: "business", priority: "high", status: "todo", deadline: "2026-06-15", dependsOn: [] },
  { id: "B2", title: "Build SaaS MVP", category: "business", priority: "high", status: "todo", deadline: "2026-07-31", dependsOn: ["B1"] },
  { id: "B3", title: "Launch on Product Hunt", category: "business", priority: "medium", status: "todo", deadline: "2026-08-15", dependsOn: ["B2"] },
  { id: "B4", title: "Create first digital product (template)", category: "business", priority: "medium", status: "todo", deadline: "2026-06-30", dependsOn: [] },
  { id: "B5", title: "Set up Gumroad store", category: "business", priority: "medium", status: "todo", deadline: "2026-06-15", dependsOn: [] },
  { id: "B6", title: "Partner: Start content creation (blog/social)", category: "business", priority: "medium", status: "todo", deadline: "2026-05-15", dependsOn: ["I9"] },
  { id: "B7", title: "Launch newsletter", category: "business", priority: "medium", status: "todo", deadline: "2026-07-01", dependsOn: ["B6"] },
  { id: "B8", title: "First 10 paying SaaS customers", category: "business", priority: "high", status: "todo", deadline: "2026-10-31", dependsOn: ["B3"] },
  { id: "B9", title: "Verify side-work policy at both employers", category: "business", priority: "critical", status: "todo", dependsOn: [] },
  { id: "B10", title: "SaaS validation: 5 interested users + 2 beta testers", category: "business", priority: "high", status: "todo", deadline: "2026-06-15", dependsOn: ["B1"] },
  { id: "B11", title: "Partner: build portfolio of 3-5 writing samples", category: "business", priority: "medium", status: "todo", deadline: "2026-06-30", dependsOn: [] },
  { id: "B12", title: "Decide on business entity when SaaS > $2K/mo", category: "business", priority: "medium", status: "todo", dependsOn: [] },

  // === LIFE & LOGISTICS (L1-L13) ===
  { id: "L1", title: "Start saving \u00a5100,000+/mo", category: "life", priority: "critical", status: "todo", deadline: "2026-04-01", dependsOn: [] },
  { id: "L2", title: "Research Mont Kiara apartments", category: "life", priority: "medium", status: "todo", deadline: "2026-08-01", dependsOn: [] },
  { id: "L3", title: "Book Airbnb for first month in KL", category: "life", priority: "high", status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L4", title: "Give notice on Tokyo apartment", category: "life", priority: "high", status: "todo", deadline: "2026-10-01", dependsOn: ["V10"] },
  { id: "L5", title: "Sell/ship belongings", category: "life", priority: "medium", status: "todo", deadline: "2026-10-15", dependsOn: ["L4"] },
  { id: "L6", title: "Cancel Japanese utilities & subscriptions", category: "life", priority: "medium", status: "todo", deadline: "2026-10-25", dependsOn: ["L4"] },
  { id: "L7", title: "Book flights Tokyo \u2192 KL", category: "life", priority: "high", status: "todo", deadline: "2026-10-10", dependsOn: ["V10"] },
  { id: "L8", title: "Reach \u00a51,200,000+ savings", category: "life", priority: "critical", status: "todo", deadline: "2026-10-31", dependsOn: ["L1"] },
  { id: "L9", title: "Download Grab + Touch 'n Go apps", category: "life", priority: "low", status: "todo", deadline: "2026-11-01", dependsOn: [] },
  { id: "L10", title: "Get SIM card at KLIA on arrival", category: "life", priority: "high", status: "todo", deadline: "2026-11-01", dependsOn: [] },
  { id: "L11", title: "Open Malaysian bank account", category: "life", priority: "high", status: "todo", deadline: "2026-11-21", dependsOn: ["L10"] },
  { id: "L12", title: "Budget MYR 10,500+ for apartment deposit", category: "life", priority: "critical", status: "todo", dependsOn: [] },
  { id: "L13", title: "Consult Malaysian tax advisor", category: "life", priority: "high", status: "todo", deadline: "2027-12-01", dependsOn: [] },

  // === TECH (T1-T9) ===
  { id: "T1", title: "Initialize Next.js + Supabase project", category: "tech", priority: "high", status: "todo", deadline: "2026-04-05", dependsOn: [] },
  { id: "T2", title: "Set up auth (email/password for 2 users)", category: "tech", priority: "high", status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
  { id: "T3", title: "Build dashboard page", category: "tech", priority: "high", status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T4", title: "Build checklist page", category: "tech", priority: "high", status: "todo", deadline: "2026-04-14", dependsOn: ["T2"] },
  { id: "T5", title: "Build income tracking page", category: "tech", priority: "high", status: "todo", deadline: "2026-04-21", dependsOn: ["T2"] },
  { id: "T6", title: "Build visa tracker page", category: "tech", priority: "medium", status: "todo", deadline: "2026-04-28", dependsOn: ["T2"] },
  { id: "T7", title: "Build notes page", category: "tech", priority: "medium", status: "todo", deadline: "2026-05-05", dependsOn: ["T2"] },
  { id: "T8", title: "Build decision log page", category: "tech", priority: "low", status: "todo", deadline: "2026-05-12", dependsOn: ["T2"] },
  { id: "T9", title: "Deploy to Vercel", category: "tech", priority: "high", status: "todo", deadline: "2026-04-07", dependsOn: ["T1"] },
];

export const seedSavings: SavingsEntry[] = [
  { month: "2026-04", projectedSalary: 60000, projectedSideIncome: 0, projectedCumulative: 60000, currency: "JPY" },
  { month: "2026-05", projectedSalary: 60000, projectedSideIncome: 15000, projectedCumulative: 135000, currency: "JPY" },
  { month: "2026-06", projectedSalary: 60000, projectedSideIncome: 30000, projectedCumulative: 225000, currency: "JPY" },
  { month: "2026-07", projectedSalary: 60000, projectedSideIncome: 60000, projectedCumulative: 345000, currency: "JPY" },
  { month: "2026-08", projectedSalary: 60000, projectedSideIncome: 90000, projectedCumulative: 495000, currency: "JPY" },
  { month: "2026-09", projectedSalary: 60000, projectedSideIncome: 120000, projectedCumulative: 675000, currency: "JPY" },
  { month: "2026-10", projectedSalary: 60000, projectedSideIncome: 150000, projectedCumulative: 885000, currency: "JPY" },
];

export const seedVisaSteps: VisaStep[] = [
  // Phase A: Foundation (Apr-Jun 2026)
  { id: "VA1", phase: "A", title: "Get married (register in Japan)", description: "Register marriage — simplifies dependent visa", status: "pending", dueDate: "2026-04-15", sortOrder: 1 },
  { id: "VA2", phase: "A", title: "Start DataAnnotation/Outlier work", description: "Begin earning as soon as approved", status: "pending", dueDate: "2026-04-07", sortOrder: 2 },
  { id: "VA3", phase: "A", title: "Open USD-receiving account (Wise)", description: "Wise, Payoneer, or US bank account", status: "pending", dueDate: "2026-04-14", sortOrder: 3 },
  { id: "VA4", phase: "A", title: "Begin saving \u00a5100,000+/mo", description: "Minimum monthly savings target", status: "pending", dueDate: "2026-04-14", sortOrder: 4 },
  { id: "VA5", phase: "A", title: "Build 2-3 months income proof", description: "Bank statements and invoices", status: "pending", dueDate: "2026-06-01", sortOrder: 5 },
  { id: "VA6", phase: "A", title: "Renew passports if < 18 months validity", status: "pending", dueDate: "2026-05-31", sortOrder: 6 },
  { id: "VA7", phase: "A", title: "Get health insurance quotes", description: "SafetyWing, Cigna Global", status: "pending", dueDate: "2026-06-30", sortOrder: 7 },

  // Phase B: Income Building (May-Aug 2026)
  { id: "VB1", phase: "B", title: "Launch freelance profiles", description: "Upwork, Toptal, freelancer.com", status: "pending", dueDate: "2026-05-15", sortOrder: 8 },
  { id: "VB2", phase: "B", title: "Take first freelance contracts", description: "Target: $500-1,000/mo side income", status: "pending", dueDate: "2026-06-30", sortOrder: 9 },
  { id: "VB3", phase: "B", title: "Begin building SaaS MVP", description: "Evenings/weekends", status: "pending", dueDate: "2026-07-01", sortOrder: 10 },
  { id: "VB4", phase: "B", title: "Scale side income to $1,500-2,500/mo", status: "pending", dueDate: "2026-08-31", sortOrder: 11 },

  // Phase C: Visa Application (Aug-Sep 2026)
  { id: "VC1", phase: "C", title: "Compile all visa documents", description: "See document checklist", status: "pending", dueDate: "2026-08-07", sortOrder: 12 },
  { id: "VC2", phase: "C", title: "Submit DE Rantau application on MDEC portal", status: "pending", dueDate: "2026-08-14", sortOrder: 13 },
  { id: "VC3", phase: "C", title: "Processing period (2-4 weeks)", status: "pending", dueDate: "2026-09-07", sortOrder: 14 },
  { id: "VC4", phase: "C", title: "Receive approval", status: "pending", dueDate: "2026-09-14", sortOrder: 15 },

  // Phase D: Relocation (Oct-Nov 2026)
  { id: "VD1", phase: "D", title: "Book flights (Tokyo \u2192 KL)", status: "pending", dueDate: "2026-10-07", sortOrder: 16 },
  { id: "VD2", phase: "D", title: "Secure Mont Kiara apartment", description: "Airbnb first month, then lease", status: "pending", dueDate: "2026-10-07", sortOrder: 17 },
  { id: "VD3", phase: "D", title: "Close out Tokyo apartment, ship/sell belongings", status: "pending", dueDate: "2026-10-21", sortOrder: 18 },
  { id: "VD4", phase: "D", title: "Cancel Japanese utilities, redirect mail", status: "pending", dueDate: "2026-10-28", sortOrder: 19 },
  { id: "VD5", phase: "D", title: "Arrive in Kuala Lumpur!", description: "Welcome to your new home!", status: "pending", dueDate: "2026-11-01", sortOrder: 20 },
  { id: "VD6", phase: "D", title: "Complete immigration formalities", status: "pending", dueDate: "2026-11-07", sortOrder: 21 },
  { id: "VD7", phase: "D", title: "Set up local bank + SIM card", description: "Maybank, Hotlink/Digi", status: "pending", dueDate: "2026-11-14", sortOrder: 22 },
];

export const seedDocuments: TrackerDocument[] = [
  { id: "D1", name: "Valid passports (both, 18+ months validity)", status: "not_started" },
  { id: "D2", name: "Marriage certificate (translated to English)", status: "not_started" },
  { id: "D3", name: "Proof of income \u2014 3 months bank statements", status: "not_started" },
  { id: "D4", name: "Employment contract or freelance invoices", status: "not_started" },
  { id: "D5", name: "CV/Resume (both)", status: "not_started" },
  { id: "D6", name: "Portfolio of digital work", status: "not_started" },
  { id: "D7", name: "Health/travel insurance policy", status: "not_started" },
  { id: "D8", name: "Passport photos (white background)", status: "not_started" },
  { id: "D9", name: "Completed MDEC application form", status: "not_started" },
  { id: "D10", name: "Proof of accommodation (Airbnb booking)", status: "not_started" },
];

export const seedSettings: Settings = {
  userNames: ["Daito", "Partner"],
  preferredCurrency: "JPY",
};
```

- [ ] **Step 2: Create seed API route**

Create `app/api/seed/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { seedTasks, seedSavings, seedVisaSteps, seedDocuments, seedSettings } from "@/lib/seed-data";

export async function POST() {
  const existing = await kv.get("tasks");
  if (existing) {
    return NextResponse.json({ message: "Data already seeded", seeded: false });
  }

  await Promise.all([
    kv.set("tasks", seedTasks),
    kv.set("savings", seedSavings),
    kv.set("visa_steps", seedVisaSteps),
    kv.set("documents", seedDocuments),
    kv.set("settings", seedSettings),
  ]);

  return NextResponse.json({ message: "Seed complete", seeded: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/seed-data.ts app/api/seed/route.ts
git commit -m "feat: add seed data from master plan and seed API route"
```

---

## Task 4: Currency System

**Files:**
- Create: `lib/currency.ts`, `components/currency-provider.tsx`, `components/money.tsx`, `app/api/rates/route.ts`

- [ ] **Step 1: Create currency conversion utilities**

Create `lib/currency.ts`:

```typescript
import type { Currency } from "./types";

const FALLBACK_RATES: Record<string, number> = {
  "JPY:USD": 1 / 150,
  "JPY:MYR": 4.5 / 150,
  "USD:JPY": 150,
  "USD:MYR": 4.5,
  "MYR:JPY": 150 / 4.5,
  "MYR:USD": 1 / 4.5,
};

export function convert(
  amount: number,
  from: Currency,
  to: Currency,
  rates: Record<string, number>
): number {
  if (from === to) return amount;
  const key = `${from}:${to}`;
  const rate = rates[key] ?? FALLBACK_RATES[key];
  if (!rate) return amount;
  return amount * rate;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = {
    JPY: "\u00a5",
    USD: "$",
    MYR: "RM",
  };
  const decimals = currency === "JPY" ? 0 : 2;
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${symbols[currency]}${formatted}`;
}

export function buildRateMap(
  base: Currency,
  apiRates: Record<string, number>
): Record<string, number> {
  const currencies: Currency[] = ["JPY", "USD", "MYR"];
  const map: Record<string, number> = {};

  // Add direct rates from API response
  for (const [to, rate] of Object.entries(apiRates)) {
    map[`${base}:${to}`] = rate;
    // Add inverse
    map[`${to}:${base}`] = 1 / rate;
  }

  // Build cross rates
  for (const from of currencies) {
    for (const to of currencies) {
      if (from === to) continue;
      const key = `${from}:${to}`;
      if (map[key]) continue;

      // Try via base currency
      const fromToBase = map[`${from}:${base}`];
      const baseToTo = map[`${base}:${to}`];
      if (fromToBase && baseToTo) {
        map[key] = fromToBase * baseToTo;
      }
    }
  }

  return map;
}
```

- [ ] **Step 2: Create rates API route**

Create `app/api/rates/route.ts`:

```typescript
import { NextResponse } from "next/server";

let cachedRates: { rates: Record<string, number>; fetchedAt: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET() {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < CACHE_TTL) {
    return NextResponse.json(cachedRates.rates);
  }

  try {
    const res = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=JPY,MYR"
    );
    if (!res.ok) throw new Error("Frankfurter API error");
    const data = await res.json();

    cachedRates = { rates: data.rates, fetchedAt: Date.now() };
    return NextResponse.json(data.rates);
  } catch {
    // Fallback rates
    return NextResponse.json({ JPY: 150, MYR: 4.5 });
  }
}
```

- [ ] **Step 3: Create CurrencyProvider context**

Create `components/currency-provider.tsx`:

```tsx
"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Currency } from "@/lib/types";
import { buildRateMap } from "@/lib/currency";

type CurrencyContextType = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  rates: Record<string, number>;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "JPY",
  setCurrency: () => {},
  rates: {},
  isLoading: true,
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("JPY");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("sakusen-currency", c);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sakusen-currency") as Currency | null;
    if (saved && ["JPY", "USD", "MYR"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  useEffect(() => {
    async function fetchRates() {
      try {
        const res = await fetch("/api/rates");
        const data = await res.json();
        const rateMap = buildRateMap("USD", data);
        setRates(rateMap);
      } catch {
        setRates({});
      } finally {
        setIsLoading(false);
      }
    }
    fetchRates();
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, isLoading }}>
      {children}
    </CurrencyContext.Provider>
  );
}
```

- [ ] **Step 4: Create Money component**

Create `components/money.tsx`:

```tsx
"use client";

import { useCurrency } from "./currency-provider";
import { convert, formatCurrency } from "@/lib/currency";
import type { Currency } from "@/lib/types";

type MoneyProps = {
  amount: number;
  from: Currency;
  className?: string;
};

export function Money({ amount, from, className }: MoneyProps) {
  const { currency, rates, isLoading } = useCurrency();

  if (isLoading) {
    return <span className={className}>...</span>;
  }

  const converted = convert(amount, from, currency, rates);
  return <span className={className}>{formatCurrency(converted, currency)}</span>;
}
```

- [ ] **Step 5: Commit**

```bash
git add lib/currency.ts app/api/rates/route.ts components/currency-provider.tsx components/money.tsx
git commit -m "feat: add currency conversion system with live rates from frankfurter.app"
```

---

## Task 5: API Routes (Tasks, Savings, Visa, Settings)

**Files:**
- Create: `app/api/tasks/route.ts`, `app/api/savings/route.ts`, `app/api/visa/route.ts`, `app/api/settings/route.ts`

- [ ] **Step 1: Create tasks API route**

Create `app/api/tasks/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getTasks, updateTask } from "@/lib/kv";

export async function GET() {
  const tasks = await getTasks();
  return NextResponse.json(tasks);
}

export async function PUT(request: NextRequest) {
  const { id, ...updates } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const tasks = await updateTask(id, updates);
  return NextResponse.json(tasks);
}
```

- [ ] **Step 2: Create savings API route**

Create `app/api/savings/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSavings, updateSavingsEntry } from "@/lib/kv";

export async function GET() {
  const savings = await getSavings();
  return NextResponse.json(savings);
}

export async function PUT(request: NextRequest) {
  const { month, ...updates } = await request.json();
  if (!month) return NextResponse.json({ error: "month required" }, { status: 400 });
  const savings = await updateSavingsEntry(month, updates);
  return NextResponse.json(savings);
}
```

- [ ] **Step 3: Create visa API route**

Create `app/api/visa/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getVisaSteps, updateVisaStep, getDocuments, updateDocument } from "@/lib/kv";

export async function GET() {
  const [steps, documents] = await Promise.all([getVisaSteps(), getDocuments()]);
  return NextResponse.json({ steps, documents });
}

export async function PUT(request: NextRequest) {
  const { type, id, ...updates } = await request.json();
  if (!type || !id) {
    return NextResponse.json({ error: "type and id required" }, { status: 400 });
  }

  if (type === "step") {
    const steps = await updateVisaStep(id, updates);
    const documents = await getDocuments();
    return NextResponse.json({ steps, documents });
  } else if (type === "document") {
    const documents = await updateDocument(id, updates);
    const steps = await getVisaSteps();
    return NextResponse.json({ steps, documents });
  }

  return NextResponse.json({ error: "type must be 'step' or 'document'" }, { status: 400 });
}
```

- [ ] **Step 4: Create settings API route**

Create `app/api/settings/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/kv";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const updates = await request.json();
  const current = await getSettings();
  const merged = { ...current, ...updates };
  await setSettings(merged);
  return NextResponse.json(merged);
}
```

- [ ] **Step 5: Commit**

```bash
git add app/api/tasks/route.ts app/api/savings/route.ts app/api/visa/route.ts app/api/settings/route.ts
git commit -m "feat: add API routes for tasks, savings, visa, and settings"
```

---

## Task 6: Layout, Nav, and User Picker

**Files:**
- Create: `components/nav.tsx`, `components/user-picker-modal.tsx`, `lib/encouragements.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create encouragements list**

Create `lib/encouragements.ts`:

```typescript
export const encouragements = [
  "You're doing amazing \u2014 one step closer to KL! \ud83c\udf34",
  "Bagus! Every task completed is progress \u2728",
  "Boleh! You've got this \ud83d\udcaa",
  "Syabas! Keep up the great work \ud83c\udf1f",
  "Mont Kiara is waiting for you \ud83c\udfd9\ufe0f",
  "Small steps, big journey \u2014 you're on your way! \u2708\ufe0f",
  "Your future in Malaysia is getting closer every day \ud83c\udf05",
  "Believe in the plan \u2014 you're making it happen! \ud83d\ude80",
  "Two hearts, one dream \u2014 KL here you come! \u2764\ufe0f",
  "Every checkbox is a victory \u2014 celebrate it! \ud83c\udf89",
];
```

- [ ] **Step 2: Create user picker modal**

Create `components/user-picker-modal.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function useCurrentUser() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("sakusen-user");
    setUser(saved);
  }, []);

  const selectUser = (name: string) => {
    localStorage.setItem("sakusen-user", name);
    setUser(name);
  };

  return { user, selectUser };
}

type UserPickerModalProps = {
  userNames: string[];
  onSelect: (name: string) => void;
  open: boolean;
};

export function UserPickerModal({ userNames, onSelect, open }: UserPickerModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-navy text-center text-xl">
            Welcome to Sakusen! \ud83c\udf1f
          </DialogTitle>
          <DialogDescription className="text-center">
            Who are you? This helps us track who did what.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-4 justify-center pt-4">
          {userNames.map((name) => (
            <Button
              key={name}
              variant="outline"
              className="h-20 w-32 text-lg font-semibold border-2 hover:border-primary hover:bg-primary/10"
              onClick={() => onSelect(name)}
            >
              {name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 3: Create navigation component**

Create `components/nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrency } from "./currency-provider";
import type { Currency } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const navItems = [
  { href: "/", label: "Dashboard", icon: "\ud83c\udfe0" },
  { href: "/checklist", label: "Checklist", icon: "\u2705" },
  { href: "/finances", label: "Finances", icon: "\ud83d\udcb0" },
  { href: "/visa", label: "Visa", icon: "\ud83d\udcc4" },
];

const currencyOptions: { value: Currency; label: string }[] = [
  { value: "JPY", label: "\u00a5 JPY" },
  { value: "USD", label: "$ USD" },
  { value: "MYR", label: "RM MYR" },
];

type NavProps = {
  userName: string | null;
};

export function Nav({ userName }: NavProps) {
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-navy text-white">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-gold">\u2606</span>
            <span>Sakusen</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-white/15 text-gold"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="w-[100px] h-8 bg-white/10 border-white/20 text-white text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userName && (
            <div className="h-8 px-3 rounded-full bg-gold/20 text-gold text-sm font-medium flex items-center">
              {userName}
            </div>
          )}
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden flex border-t border-white/10">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 text-center py-2 text-xs font-medium transition-colors ${
              pathname === item.href
                ? "text-gold bg-white/10"
                : "text-white/60"
            }`}
          >
            <div className="text-lg">{item.icon}</div>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Update layout.tsx to include providers, nav, and user picker**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sakusen - Malaysia Relocation Tracker",
  description: "Track your journey from Tokyo to Kuala Lumpur",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans antialiased`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Create AppShell component**

This wraps the client-side providers, nav, and user picker logic. Create `components/app-shell.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { CurrencyProvider } from "./currency-provider";
import { Nav } from "./nav";
import { UserPickerModal, useCurrentUser } from "./user-picker-modal";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, selectUser } = useCurrentUser();
  const [userNames, setUserNames] = useState<string[]>(["Daito", "Partner"]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.userNames) setUserNames(data.userNames);
      })
      .catch(() => {});
  }, []);

  // Seed data on first load
  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  if (!mounted) return null;

  return (
    <CurrencyProvider>
      <Nav userName={user} />
      <UserPickerModal
        userNames={userNames}
        onSelect={selectUser}
        open={!user}
      />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </CurrencyProvider>
  );
}
```

- [ ] **Step 6: Verify the app loads with nav and user picker**

```bash
npm run dev
```

Visit http://localhost:3000. You should see the navy header with "Sakusen" and a user picker modal. The KV calls will fail locally without env vars — that's expected. Kill server.

- [ ] **Step 7: Commit**

```bash
git add lib/encouragements.ts components/user-picker-modal.tsx components/nav.tsx components/app-shell.tsx app/layout.tsx
git commit -m "feat: add nav, user picker, app shell with currency provider"
```

---

## Task 7: Shared UI Components

**Files:**
- Create: `components/progress-bar.tsx`, `components/stat-card.tsx`, `components/encouragement-banner.tsx`, `components/countdown.tsx`, `components/flight-path.tsx`, `components/task-card.tsx`

- [ ] **Step 1: Create striped progress bar**

Create `components/progress-bar.tsx`:

```tsx
type ProgressBarProps = {
  value: number; // 0-100
  label?: string;
  className?: string;
};

export function ProgressBar({ value, label, className = "" }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium text-navy">{label}</span>
          <span className="text-muted-foreground">{Math.round(clamped)}%</span>
        </div>
      )}
      <div className="h-3 rounded-full bg-secondary overflow-hidden progress-striped">
        <div
          className="h-full rounded-full progress-fill transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create stat card**

Create `components/stat-card.tsx`:

```tsx
import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  icon: string;
  label: string;
  value: string | React.ReactNode;
  subtitle?: string;
  className?: string;
};

export function StatCard({ icon, label, value, subtitle, className = "" }: StatCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-navy mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Create encouragement banner**

Create `components/encouragement-banner.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { encouragements } from "@/lib/encouragements";

export function EncouragementBanner() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const idx = Math.floor(Math.random() * encouragements.length);
    setMessage(encouragements[idx]);
  }, []);

  if (!message) return null;

  return (
    <div className="rounded-xl bg-gradient-to-r from-gold/20 to-primary/10 border border-gold/30 px-6 py-4 text-center">
      <p className="text-navy font-medium">{message}</p>
    </div>
  );
}
```

- [ ] **Step 4: Create countdown component**

Create `components/countdown.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const TARGET_DATE = new Date("2026-11-01");

export function Countdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const now = new Date();
    const diff = TARGET_DATE.getTime() - now.getTime();
    setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  if (days === null) return null;

  return (
    <Card className="bg-gradient-to-br from-gold/20 via-gold/10 to-transparent border-gold/30">
      <CardContent className="pt-6 text-center">
        <p className="text-sm text-navy/70 font-medium mb-1">Days until KL</p>
        <p className="text-5xl font-bold text-navy">{days}</p>
        <p className="text-gold mt-2 text-lg">\u2606</p>
        <p className="text-sm text-muted-foreground mt-1">
          {days > 200
            ? "Plenty of time \u2014 steady progress!"
            : days > 100
            ? "Halfway there \u2014 keep going!"
            : days > 30
            ? "Getting close \u2014 exciting times!"
            : "Almost there \u2014 you're so close!"}
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 5: Create flight path SVG**

Create `components/flight-path.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";

const START_DATE = new Date("2026-03-28");
const TARGET_DATE = new Date("2026-11-01");

export function FlightPath() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const now = new Date();
    const total = TARGET_DATE.getTime() - START_DATE.getTime();
    const elapsed = now.getTime() - START_DATE.getTime();
    setProgress(Math.min(1, Math.max(0, elapsed / total)));
  }, []);

  // SVG arc from Tokyo (left) to KL (right)
  const width = 600;
  const height = 120;
  const startX = 60;
  const endX = 540;
  const arcY = 30;

  // Position along the arc
  const t = progress;
  const x = startX + t * (endX - startX);
  // Parabolic arc
  const y = height - 20 - 4 * arcY * t * (1 - t);

  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Dotted path */}
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="#E8C97A"
          strokeWidth="2"
          strokeDasharray="6 4"
          opacity="0.6"
        />
        {/* Traveled path */}
        <path
          d={`M ${startX} ${height - 20} Q ${width / 2} ${arcY} ${endX} ${height - 20}`}
          fill="none"
          stroke="#C4706E"
          strokeWidth="2.5"
          strokeDasharray={`${t * 650} 650`}
        />
        {/* Tokyo label */}
        <text x={startX} y={height - 2} textAnchor="middle" className="fill-navy text-xs font-medium">
          Tokyo
        </text>
        {/* KL label */}
        <text x={endX} y={height - 2} textAnchor="middle" className="fill-navy text-xs font-medium">
          Kuala Lumpur
        </text>
        {/* Airplane */}
        <text x={x} y={y} textAnchor="middle" fontSize="20" className="select-none">
          \u2708\ufe0f
        </text>
      </svg>
    </div>
  );
}
```

- [ ] **Step 6: Create task card component**

Create `components/task-card.tsx`:

```tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskStatus } from "@/lib/types";

const priorityStyles: Record<string, string> = {
  critical: "bg-primary/15 text-primary border-primary/30",
  high: "bg-gold/15 text-amber-700 border-gold/30",
  medium: "bg-navy/10 text-navy border-navy/20",
  low: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-muted text-muted-foreground",
  in_progress: "bg-gold/20 text-amber-700",
  done: "bg-success/15 text-success",
};

type TaskCardProps = {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== "done";
  const statuses: TaskStatus[] = ["todo", "in_progress", "done"];

  return (
    <Card className={`transition-all ${task.status === "done" ? "opacity-60" : ""} ${isOverdue ? "border-primary/50" : ""}`}>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge variant="outline" className={`text-[10px] ${priorityStyles[task.priority]}`}>
                {task.priority}
              </Badge>
              {task.assignee && (
                <Badge variant="outline" className="text-[10px]">
                  {task.assignee}
                </Badge>
              )}
              {task.dependsOn && task.dependsOn.length > 0 && (
                <span className="text-[10px] text-muted-foreground">
                  Needs: {task.dependsOn.join(", ")}
                </span>
              )}
            </div>
            <p className={`font-medium text-sm ${task.status === "done" ? "line-through text-muted-foreground" : "text-navy"}`}>
              <span className="text-muted-foreground mr-1.5 font-mono text-xs">{task.id}</span>
              {task.title}
            </p>
            {task.deadline && (
              <p className={`text-xs mt-1 ${isOverdue ? "text-primary font-medium" : "text-muted-foreground"}`}>
                {isOverdue ? "Overdue: " : "Due: "}
                {new Date(task.deadline).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
          <div className="flex rounded-lg overflow-hidden border border-border shrink-0">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => onStatusChange(task.id, s)}
                className={`px-2 py-1 text-[10px] font-medium transition-colors ${
                  task.status === s ? statusStyles[s] : "hover:bg-muted/50"
                }`}
              >
                {statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add components/progress-bar.tsx components/stat-card.tsx components/encouragement-banner.tsx components/countdown.tsx components/flight-path.tsx components/task-card.tsx
git commit -m "feat: add shared UI components (progress bar, stat card, countdown, flight path, task card)"
```

---

## Task 8: Dashboard Page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Build the dashboard page**

Replace `app/page.tsx` with:

```tsx
"use client";

import { useState, useEffect } from "react";
import { FlightPath } from "@/components/flight-path";
import { Countdown } from "@/components/countdown";
import { StatCard } from "@/components/stat-card";
import { EncouragementBanner } from "@/components/encouragement-banner";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task, SavingsEntry, VisaStep } from "@/lib/types";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [visaSteps, setVisaSteps] = useState<VisaStep[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/savings").then((r) => r.json()),
      fetch("/api/visa").then((r) => r.json()),
    ])
      .then(([tasksData, savingsData, visaData]) => {
        setTasks(tasksData);
        setSavings(savingsData);
        setVisaSteps(visaData.steps || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading your journey...</p>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const taskPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const latestSavings = savings[savings.length - 1];
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsTarget = 1200000;
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  const completedVisaSteps = visaSteps.filter((s) => s.status === "completed").length;
  const visaPercent = visaSteps.length > 0 ? Math.round((completedVisaSteps / visaSteps.length) * 100) : 0;

  const currentPhase = visaSteps.find((s) => s.status === "in_progress")?.phase ?? "A";
  const phaseLabels: Record<string, string> = {
    A: "Foundation",
    B: "Income Building",
    C: "Visa Application",
    D: "Relocation",
  };

  // Upcoming deadlines: next 5 undone tasks sorted by deadline
  const upcoming = tasks
    .filter((t) => t.status !== "done" && t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const categoryIcons: Record<string, string> = {
    visa: "\ud83d\udcc4",
    income: "\ud83d\udcb0",
    business: "\ud83d\ude80",
    life: "\ud83c\udfe0",
    tech: "\ud83d\udcbb",
  };

  return (
    <div className="space-y-6">
      {/* Flight Path Hero */}
      <Card className="overflow-hidden">
        <CardContent className="pt-6 pb-4">
          <h2 className="text-center text-navy font-bold text-lg mb-4">
            Your Journey to Malaysia
          </h2>
          <FlightPath />
        </CardContent>
      </Card>

      {/* Countdown + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Countdown />
        <StatCard
          icon="\u2705"
          label="Tasks Completed"
          value={`${taskPercent}%`}
          subtitle={`${doneTasks} of ${totalTasks} tasks`}
        />
        <StatCard
          icon="\ud83d\udcb0"
          label="Savings Progress"
          value={<Money amount={currentSavings} from="JPY" />}
          subtitle={`of \u00a51,200,000 target`}
        />
        <StatCard
          icon="\ud83d\udcc4"
          label="Visa Status"
          value={`Phase ${currentPhase}`}
          subtitle={`${phaseLabels[currentPhase]} \u2022 ${visaPercent}%`}
        />
      </div>

      {/* Progress Bars */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <ProgressBar value={taskPercent} label="Overall Progress" />
          <ProgressBar value={savingsPercent} label="Savings Target" />
          <ProgressBar value={visaPercent} label="Visa Steps" />
        </CardContent>
      </Card>

      {/* Encouragement */}
      <EncouragementBanner />

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-navy text-base">Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-muted-foreground text-sm">No upcoming deadlines \u2014 you're all caught up!</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span>{categoryIcons[task.category] || "\ud83d\udccc"}</span>
                    <div>
                      <p className="text-sm font-medium text-navy">
                        <span className="font-mono text-xs text-muted-foreground mr-1">{task.id}</span>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(task.deadline!).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      task.priority === "critical"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : task.priority === "high"
                        ? "bg-gold/10 text-amber-700 border-gold/30"
                        : ""
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 2: Verify dashboard renders**

```bash
npm run dev
```

Visit http://localhost:3000. The dashboard should render (data will be empty without KV connected). Verify no build errors.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: build dashboard page with flight path, countdown, stats, and deadlines"
```

---

## Task 9: Checklist Page

**Files:**
- Create: `app/checklist/page.tsx`

- [ ] **Step 1: Build the checklist page**

Create `app/checklist/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { TaskCard } from "@/components/task-card";
import { ProgressBar } from "@/components/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Task, TaskCategory, TaskStatus } from "@/lib/types";

const categories: { value: TaskCategory; label: string; icon: string }[] = [
  { value: "visa", label: "Visa & Legal", icon: "\ud83d\udcc4" },
  { value: "income", label: "Income", icon: "\ud83d\udcb0" },
  { value: "business", label: "Business", icon: "\ud83d\ude80" },
  { value: "life", label: "Life & Logistics", icon: "\ud83c\udfe0" },
  { value: "tech", label: "Tech", icon: "\ud83d\udcbb" },
];

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  useEffect(() => {
    fetch("/api/tasks")
      .then((r) => r.json())
      .then(setTasks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    const userName = localStorage.getItem("sakusen-user") || "Unknown";
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status, updatedBy: userName, updatedAt: new Date().toISOString() } : t
      )
    );
    try {
      const res = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, updatedBy: userName }),
      });
      const updated = await res.json();
      setTasks(updated);
    } catch {
      // Revert on error
      fetch("/api/tasks").then((r) => r.json()).then(setTasks);
    }
  };

  const assignees = useMemo(() => {
    const set = new Set(tasks.map((t) => t.assignee).filter(Boolean));
    return Array.from(set) as string[];
  }, [tasks]);

  const filterTasks = (categoryTasks: Task[]) => {
    return categoryTasks.filter((t) => {
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterAssignee !== "all" && t.assignee !== filterAssignee) return false;
      if (filterPriority !== "all" && t.priority !== filterPriority) return false;
      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading checklist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Checklist</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track every step of your Malaysia move
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssignee} onValueChange={setFilterAssignee}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Everyone</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[130px] h-8 text-sm">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue="visa">
        <TabsList className="w-full justify-start overflow-x-auto">
          {categories.map((cat) => {
            const catTasks = tasks.filter((t) => t.category === cat.value);
            const done = catTasks.filter((t) => t.status === "done").length;
            return (
              <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                <span className="mr-1">{cat.icon}</span>
                {cat.label}
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {done}/{catTasks.length}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map((cat) => {
          const catTasks = tasks.filter((t) => t.category === cat.value);
          const filtered = filterTasks(catTasks);
          const done = catTasks.filter((t) => t.status === "done").length;
          const percent = catTasks.length > 0 ? Math.round((done / catTasks.length) * 100) : 0;

          return (
            <TabsContent key={cat.value} value={cat.value} className="space-y-4 mt-4">
              <ProgressBar value={percent} label={`${cat.label} Progress`} />

              {percent === 100 && (
                <div className="text-center py-4 rounded-xl bg-success/10 border border-success/30">
                  <p className="text-2xl mb-1">\ud83c\udf89</p>
                  <p className="font-bold text-success">Boleh! Category complete!</p>
                </div>
              )}

              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    No tasks match your filters
                  </p>
                ) : (
                  filtered.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
```

- [ ] **Step 2: Verify checklist page renders**

```bash
npm run dev
```

Visit http://localhost:3000/checklist. Should show tabs and filter bar (empty data without KV).

- [ ] **Step 3: Commit**

```bash
git add app/checklist/page.tsx
git commit -m "feat: build checklist page with category tabs, filters, and task cards"
```

---

## Task 10: Finances Page

**Files:**
- Create: `app/finances/page.tsx`, `components/savings-table.tsx`, `components/cost-comparison.tsx`, `components/checkpoint-gate.tsx`

- [ ] **Step 1: Create savings table component**

Create `components/savings-table.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Money } from "@/components/money";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SavingsEntry } from "@/lib/types";

type SavingsTableProps = {
  savings: SavingsEntry[];
  onUpdate: (month: string, field: string, value: number) => void;
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatMonth(month: string): string {
  const [year, m] = month.split("-");
  return `${monthNames[parseInt(m) - 1]} ${year}`;
}

export function SavingsTable({ savings, onUpdate }: SavingsTableProps) {
  const [editing, setEditing] = useState<{ month: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEdit = (month: string, field: string, currentValue?: number) => {
    setEditing({ month, field });
    setEditValue(currentValue?.toString() ?? "");
  };

  const commitEdit = () => {
    if (!editing) return;
    const num = parseInt(editValue) || 0;
    onUpdate(editing.month, editing.field, num);
    setEditing(null);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead className="text-right">Salary (Projected)</TableHead>
            <TableHead className="text-right">Salary (Actual)</TableHead>
            <TableHead className="text-right">Side Income (Projected)</TableHead>
            <TableHead className="text-right">Side Income (Actual)</TableHead>
            <TableHead className="text-right">Cumulative (Projected)</TableHead>
            <TableHead className="text-right">Cumulative (Actual)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savings.map((entry) => {
            const actualCumulative = (entry.actualSalary ?? 0) + (entry.actualSideIncome ?? 0);
            return (
              <TableRow key={entry.month}>
                <TableCell className="font-medium">{formatMonth(entry.month)}</TableCell>
                <TableCell className="text-right">
                  <Money amount={entry.projectedSalary} from="JPY" />
                </TableCell>
                <TableCell
                  className="text-right cursor-pointer hover:bg-muted/50 rounded"
                  onClick={() => startEdit(entry.month, "actualSalary", entry.actualSalary)}
                >
                  {editing?.month === entry.month && editing.field === "actualSalary" ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                      className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className={entry.actualSalary ? "text-navy font-medium" : "text-muted-foreground"}>
                      {entry.actualSalary ? (
                        <Money amount={entry.actualSalary} from="JPY" />
                      ) : (
                        "Click to edit"
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Money amount={entry.projectedSideIncome} from="JPY" />
                </TableCell>
                <TableCell
                  className="text-right cursor-pointer hover:bg-muted/50 rounded"
                  onClick={() => startEdit(entry.month, "actualSideIncome", entry.actualSideIncome)}
                >
                  {editing?.month === entry.month && editing.field === "actualSideIncome" ? (
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEdit}
                      onKeyDown={(e) => e.key === "Enter" && commitEdit()}
                      className="w-24 text-right bg-background border rounded px-1 py-0.5 text-sm"
                      autoFocus
                    />
                  ) : (
                    <span className={entry.actualSideIncome ? "text-navy font-medium" : "text-muted-foreground"}>
                      {entry.actualSideIncome ? (
                        <Money amount={entry.actualSideIncome} from="JPY" />
                      ) : (
                        "Click to edit"
                      )}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Money amount={entry.projectedCumulative} from="JPY" />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {actualCumulative > 0 ? (
                    <Money amount={actualCumulative} from="JPY" className="text-navy" />
                  ) : (
                    <span className="text-muted-foreground">\u2014</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] **Step 2: Create cost comparison component**

Create `components/cost-comparison.tsx`:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/money";
import type { Currency } from "@/lib/types";

type CostItem = {
  label: string;
  tokyo: number;
  kl: number;
  currency: Currency;
};

const costs: CostItem[] = [
  { label: "Rent (1BR furnished)", tokyo: 120000, kl: 3000, currency: "JPY" },
  { label: "Utilities + Internet", tokyo: 15000, kl: 400, currency: "JPY" },
  { label: "Food", tokyo: 60000, kl: 2500, currency: "JPY" },
  { label: "Transport", tokyo: 10000, kl: 400, currency: "JPY" },
  { label: "Health Insurance", tokyo: 25000, kl: 650, currency: "JPY" },
  { label: "Misc / Entertainment", tokyo: 30000, kl: 1250, currency: "JPY" },
];

// KL costs are stored as MYR values displayed as JPY-equivalent for comparison
// Actual MYR values: Rent 3000, Utils 400, Food 2500, Transport 400, Health 650, Misc 1250
const klCostsMYR: Record<string, number> = {
  "Rent (1BR furnished)": 3000,
  "Utilities + Internet": 400,
  "Food": 2500,
  "Transport": 400,
  "Health Insurance": 650,
  "Misc / Entertainment": 1250,
};

export function CostComparison() {
  const tokyoTotal = costs.reduce((sum, c) => sum + c.tokyo, 0);
  const klTotal = Object.values(klCostsMYR).reduce((sum, v) => sum + v, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            \ud83c\uddef\ud83c\uddf5 Tokyo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {costs.map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <Money amount={item.tokyo} from="JPY" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">Total</span>
            <Money amount={tokyoTotal} from="JPY" className="text-navy" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-success/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base text-navy flex items-center gap-2">
            \ud83c\uddf2\ud83c\uddfe Mont Kiara, KL
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Object.entries(klCostsMYR).map(([label, amount]) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <Money amount={amount} from="MYR" className="font-medium" />
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span className="text-navy">Total</span>
            <Money amount={klTotal} from="MYR" className="text-success" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 3: Create checkpoint gate component**

Create `components/checkpoint-gate.tsx`:

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Money } from "@/components/money";
import type { SavingsEntry } from "@/lib/types";

type CheckpointGateProps = {
  savings: SavingsEntry[];
};

export function CheckpointGate({ savings }: CheckpointGateProps) {
  // Calculate cumulative actual savings through August
  const throughAug = savings.filter((s) => s.month <= "2026-08");
  const totalSaved = throughAug.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );

  // Latest month's side income
  const augEntry = savings.find((s) => s.month === "2026-08");
  const latestSideIncome = augEntry?.actualSideIncome ?? 0;

  const checks = [
    {
      label: "Savings \u2265 \u00a5400,000",
      target: 400000,
      actual: totalSaved,
      passed: totalSaved >= 400000,
      display: <Money amount={totalSaved} from="JPY" />,
    },
    {
      label: "Side income \u2265 \u00a580,000/mo",
      target: 80000,
      actual: latestSideIncome,
      passed: latestSideIncome >= 80000,
      display: <Money amount={latestSideIncome} from="JPY" />,
    },
  ];

  return (
    <Card className="border-gold/40 bg-gradient-to-br from-gold/5 to-transparent">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-navy flex items-center gap-2">
          \ud83d\udea6 August Checkpoint Gate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{check.passed ? "\u2705" : "\u274c"}</span>
              <span className="text-sm font-medium">{check.label}</span>
            </div>
            <span className={`text-sm font-bold ${check.passed ? "text-success" : "text-primary"}`}>
              {check.display}
            </span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground mt-2">
          If not met by August, delay move to December 2026.
        </p>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Build the finances page**

Create `app/finances/page.tsx`:

```tsx
"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "@/components/progress-bar";
import { Money } from "@/components/money";
import { SavingsTable } from "@/components/savings-table";
import { CostComparison } from "@/components/cost-comparison";
import { CheckpointGate } from "@/components/checkpoint-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SavingsEntry } from "@/lib/types";

export default function FinancesPage() {
  const [savings, setSavings] = useState<SavingsEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/savings")
      .then((r) => r.json())
      .then(setSavings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (month: string, field: string, value: number) => {
    // Optimistic update
    setSavings((prev) =>
      prev.map((s) => (s.month === month ? { ...s, [field]: value } : s))
    );
    try {
      const res = await fetch("/api/savings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, [field]: value }),
      });
      const updated = await res.json();
      setSavings(updated);
    } catch {
      fetch("/api/savings").then((r) => r.json()).then(setSavings);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading finances...</p>
      </div>
    );
  }

  const savingsTarget = 1200000;
  const currentSavings = savings.reduce(
    (sum, s) => sum + (s.actualSalary ?? 0) + (s.actualSideIncome ?? 0),
    0
  );
  const savingsPercent = Math.round((currentSavings / savingsTarget) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Finances</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your savings and compare costs
        </p>
      </div>

      {/* Savings Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Savings</p>
              <p className="text-3xl font-bold text-navy">
                <Money amount={currentSavings} from="JPY" />
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              Target: <Money amount={savingsTarget} from="JPY" />
            </p>
          </div>
          <ProgressBar value={savingsPercent} />
        </CardContent>
      </Card>

      {/* Income by Layer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 1: Immediate Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $1,000\u2013$2,800/mo</p>
            <p className="text-sm mt-1">DataAnnotation, Outlier, CrowdWorks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 2: Stability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $1,500\u2013$3,500/mo</p>
            <p className="text-sm mt-1">Freelance dev, translation, VA work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Layer 3: Scalable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Target: $2,000\u2013$10,000/mo</p>
            <p className="text-sm mt-1">SaaS, digital products, newsletter</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Savings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-navy">Monthly Savings Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <SavingsTable savings={savings} onUpdate={handleUpdate} />
        </CardContent>
      </Card>

      {/* Checkpoint Gate */}
      <CheckpointGate savings={savings} />

      {/* Cost of Living Comparison */}
      <div>
        <h2 className="text-lg font-bold text-navy mb-4">Cost of Living Comparison</h2>
        <CostComparison />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify finances page renders**

```bash
npm run dev
```

Visit http://localhost:3000/finances. Check the layout renders (empty data without KV).

- [ ] **Step 6: Commit**

```bash
git add components/savings-table.tsx components/cost-comparison.tsx components/checkpoint-gate.tsx app/finances/page.tsx
git commit -m "feat: build finances page with savings tracker, cost comparison, and checkpoint gate"
```

---

## Task 11: Visa Tracker Page

**Files:**
- Create: `app/visa/page.tsx`, `components/visa-timeline.tsx`, `components/document-checklist.tsx`

- [ ] **Step 1: Create visa timeline component**

Create `components/visa-timeline.tsx`:

```tsx
"use client";

import { Badge } from "@/components/ui/badge";
import type { VisaStep, VisaStepStatus } from "@/lib/types";

const phaseInfo: Record<string, { label: string; period: string }> = {
  A: { label: "Foundation", period: "Apr\u2013Jun 2026" },
  B: { label: "Income Building", period: "May\u2013Aug 2026" },
  C: { label: "Visa Application", period: "Aug\u2013Sep 2026" },
  D: { label: "Relocation", period: "Oct\u2013Nov 2026" },
};

const statusStyles: Record<VisaStepStatus, { bg: string; text: string; label: string }> = {
  pending: { bg: "bg-muted", text: "text-muted-foreground", label: "Pending" },
  in_progress: { bg: "bg-gold/20", text: "text-amber-700", label: "In Progress" },
  completed: { bg: "bg-success/15", text: "text-success", label: "Completed" },
  blocked: { bg: "bg-primary/15", text: "text-primary", label: "Blocked" },
};

const statusDotColors: Record<VisaStepStatus, string> = {
  pending: "bg-muted-foreground/30",
  in_progress: "bg-gold",
  completed: "bg-success",
  blocked: "bg-primary",
};

type VisaTimelineProps = {
  steps: VisaStep[];
  onToggle: (id: string, status: VisaStepStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
};

export function VisaTimeline({ steps, onToggle, onNotesChange }: VisaTimelineProps) {
  const phases = ["A", "B", "C", "D"] as const;

  return (
    <div className="space-y-8">
      {phases.map((phase) => {
        const phaseSteps = steps.filter((s) => s.phase === phase).sort((a, b) => a.sortOrder - b.sortOrder);
        const info = phaseInfo[phase];
        const completed = phaseSteps.filter((s) => s.status === "completed").length;

        return (
          <div key={phase}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                {phase}
              </div>
              <div>
                <h3 className="font-bold text-navy">{info.label}</h3>
                <p className="text-xs text-muted-foreground">
                  {info.period} \u2022 {completed}/{phaseSteps.length} done
                </p>
              </div>
            </div>

            <div className="ml-4 border-l-2 border-border pl-6 space-y-4">
              {phaseSteps.map((step) => {
                const style = statusStyles[step.status];
                const nextStatus: VisaStepStatus =
                  step.status === "pending"
                    ? "in_progress"
                    : step.status === "in_progress"
                    ? "completed"
                    : step.status === "completed"
                    ? "pending"
                    : "pending";

                return (
                  <div key={step.id} className="relative">
                    {/* Dot on the timeline line */}
                    <div
                      className={`absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-background ${statusDotColors[step.status]}`}
                    />

                    <div className={`rounded-lg border p-3 ${step.status === "completed" ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${step.status === "completed" ? "line-through text-muted-foreground" : "text-navy"}`}>
                            {step.title}
                          </p>
                          {step.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                          )}
                          {step.dueDate && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Due: {new Date(step.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => onToggle(step.id, nextStatus)}
                          className="shrink-0"
                        >
                          <Badge className={`${style.bg} ${style.text} border-0 cursor-pointer hover:opacity-80`}>
                            {style.label}
                          </Badge>
                        </button>
                      </div>

                      {/* Editable notes */}
                      <textarea
                        className="mt-2 w-full text-xs bg-transparent border border-border rounded px-2 py-1 resize-none placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
                        placeholder="Add notes..."
                        rows={1}
                        value={step.notes || ""}
                        onChange={(e) => onNotesChange(step.id, e.target.value)}
                        onFocus={(e) => { e.target.rows = 3; }}
                        onBlur={(e) => { if (!e.target.value) e.target.rows = 1; }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Create document checklist component**

Create `components/document-checklist.tsx`:

```tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TrackerDocument, DocumentStatus } from "@/lib/types";

const statusStyles: Record<DocumentStatus, { bg: string; text: string; label: string }> = {
  not_started: { bg: "bg-muted", text: "text-muted-foreground", label: "Not Started" },
  in_progress: { bg: "bg-gold/20", text: "text-amber-700", label: "In Progress" },
  ready: { bg: "bg-success/15", text: "text-success", label: "Ready" },
};

type DocumentChecklistProps = {
  documents: TrackerDocument[];
  onStatusChange: (id: string, status: DocumentStatus) => void;
};

export function DocumentChecklist({ documents, onStatusChange }: DocumentChecklistProps) {
  const ready = documents.filter((d) => d.status === "ready").length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-navy flex items-center justify-between">
          <span>\ud83d\udcc1 Required Documents</span>
          <span className="text-sm font-normal text-muted-foreground">
            {ready}/{documents.length} ready
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => {
          const style = statusStyles[doc.status];
          const nextStatus: DocumentStatus =
            doc.status === "not_started"
              ? "in_progress"
              : doc.status === "in_progress"
              ? "ready"
              : "not_started";

          return (
            <div
              key={doc.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">
                  {doc.status === "ready" ? "\u2705" : doc.status === "in_progress" ? "\ud83d\udfe1" : "\u2b55"}
                </span>
                <span className={`text-sm ${doc.status === "ready" ? "line-through text-muted-foreground" : "text-navy"}`}>
                  {doc.name}
                </span>
              </div>
              <button onClick={() => onStatusChange(doc.id, nextStatus)}>
                <Badge className={`${style.bg} ${style.text} border-0 cursor-pointer hover:opacity-80 text-xs`}>
                  {style.label}
                </Badge>
              </button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 3: Build the visa tracker page**

Create `app/visa/page.tsx`:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { VisaTimeline } from "@/components/visa-timeline";
import { DocumentChecklist } from "@/components/document-checklist";
import { Card, CardContent } from "@/components/ui/card";
import type { VisaStep, VisaStepStatus, TrackerDocument, DocumentStatus } from "@/lib/types";

const APPLICATION_DATE = new Date("2026-08-15");

export default function VisaPage() {
  const [steps, setSteps] = useState<VisaStep[]>([]);
  const [documents, setDocuments] = useState<TrackerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [daysUntilApp, setDaysUntilApp] = useState<number | null>(null);
  const notesTimeout = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    fetch("/api/visa")
      .then((r) => r.json())
      .then((data) => {
        setSteps(data.steps || []);
        setDocuments(data.documents || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    const diff = APPLICATION_DATE.getTime() - Date.now();
    setDaysUntilApp(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
  }, []);

  const handleStepToggle = async (id: string, status: VisaStepStatus) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "step", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, notes } : s)));

    // Debounce save
    if (notesTimeout.current[id]) clearTimeout(notesTimeout.current[id]);
    notesTimeout.current[id] = setTimeout(async () => {
      try {
        await fetch("/api/visa", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "step", id, notes }),
        });
      } catch {}
    }, 1000);
  };

  const handleDocStatusChange = async (id: string, status: DocumentStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    try {
      const res = await fetch("/api/visa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "document", id, status }),
      });
      const data = await res.json();
      setSteps(data.steps);
      setDocuments(data.documents);
    } catch {
      fetch("/api/visa").then((r) => r.json()).then((d) => { setSteps(d.steps); setDocuments(d.documents); });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Loading visa tracker...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Visa Tracker</h1>
        <p className="text-muted-foreground text-sm mt-1">
          DE Rantau Digital Nomad Pass progress
        </p>
      </div>

      {/* Application Countdown */}
      {daysUntilApp !== null && (
        <Card className="bg-gradient-to-r from-navy/5 to-primary/5 border-navy/20">
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Days until application target</p>
              <p className="text-3xl font-bold text-navy">{daysUntilApp}</p>
              <p className="text-xs text-muted-foreground mt-1">Target: August 15, 2026</p>
            </div>
            <span className="text-4xl">\ud83d\udcc4</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline (takes 2 cols) */}
        <div className="lg:col-span-2">
          <VisaTimeline
            steps={steps}
            onToggle={handleStepToggle}
            onNotesChange={handleNotesChange}
          />
        </div>

        {/* Document Checklist (sidebar) */}
        <div>
          <DocumentChecklist
            documents={documents}
            onStatusChange={handleDocStatusChange}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Verify visa page renders**

```bash
npm run dev
```

Visit http://localhost:3000/visa. Check layout renders.

- [ ] **Step 5: Commit**

```bash
git add components/visa-timeline.tsx components/document-checklist.tsx app/visa/page.tsx
git commit -m "feat: build visa tracker page with timeline, document checklist, and application countdown"
```

---

## Task 12: Build Verification + Deploy Prep

**Files:**
- Modify: `package.json` (if needed)

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Fix any TypeScript or build errors that arise. Common issues:
- Missing imports
- Type mismatches
- Client/server component boundary issues

- [ ] **Step 2: Verify all pages in dev mode**

```bash
npm run dev
```

Visit each page and confirm they render without console errors:
- http://localhost:3000 (Dashboard)
- http://localhost:3000/checklist (Checklist)
- http://localhost:3000/finances (Finances)
- http://localhost:3000/visa (Visa)

Note: Data will be empty without Vercel KV env vars. The pages should still render gracefully with empty states.

- [ ] **Step 3: Add env.example file**

Create `.env.example`:

```
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "feat: add env example and verify production build"
```

- [ ] **Step 5: Deploy to Vercel**

```bash
npx vercel
```

Follow the prompts to link the project. Then:

1. Go to Vercel dashboard → Project → Storage → Create KV Database
2. Connect KV to the project (auto-adds env vars)
3. Redeploy: `npx vercel --prod`
4. Visit the deployed URL
5. Seed data: `curl -X POST https://your-app.vercel.app/api/seed`
6. Verify all pages work with real data

- [ ] **Step 6: Commit any deploy-related changes**

```bash
git add -A
git commit -m "chore: vercel deployment configuration"
```
