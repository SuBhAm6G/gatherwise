# GatherWise — Technical Architecture

## 1. Architectural Philosophy: The Core/Shell Pattern

GatherWise is architected around a strict separation between **deterministic correctness** and **probabilistic intelligence**:

```
┌────────────────────────────────────────────────────────┐
│                      User Interface                    │
│   (Wizard, Overview, Budget, Timeline, Vendors, Ideas)  │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┴────────────────────┐
       ▼                                         ▼
┌───────────────────────────┐         ┌───────────────────────────┐
│     Deterministic Core    │         │       AI Layer Shell      │
│  (Pure functions, zero AI)│         │ (Server-side Gemini 3.1)  │
│                           │         │                           │
│  • budget.ts (minor units)│         │  • ideas/route.ts         │
│  • timeline.ts (date-fns) │         │  • assistant/route.ts     │
│  • vendors.ts (checklists)│         │  • Zod schema gates       │
│  • change-impact.ts       │         │  • Focused context builder│
│  • db.ts (IndexedDB)      │         │  • Offline fallbacks      │
└───────────────────────────┘         └───────────────────────────┘
```

### Why Deterministic Logic Handles Core Planning
- **Budget calculations** must never hallucinate numbers, miscalculate sums, or round floating-point currency silently. All arithmetic runs in integer minor units (e.g. cents/pence) using floor-division allocation and binary-accurate overrun alerts.
- **Milestone schedules** require calendar arithmetic (handling leap years, month boundaries, and lead-time constraints) driven by `date-fns`.
- **Change impact analysis** computes deterministic deltas whenever core parameters (budget, guest count, dates) shift.
- **Offline continuity**: If internet connectivity is interrupted, 100% of the planning logic continues to function seamlessly.

### Why Gemini 3 Handles Creative & Explanatory Reasoning
- **Personalized Ideas**: Tailoring creative themes, dietary workarounds, and entertainment concepts to the specific ambiance, age group, and budget category.
- **Planning Q&A**: Explaining tradeoffs, contextualizing next steps, and answering questions grounded strictly in the plan's verified data.

---

## 2. Component Architecture & Data Flow

### 2.1 State Management (`usePlan` Hook)
- Plan state is centralized in [`src/lib/hooks/use-plan.ts`](file:///E:/PromptWars/Challenge%205/gatherwise/src/lib/hooks/use-plan.ts).
- Mutations invoke pure engine functions (`adjustCategoryAllocation`, `updateActualSpend`, `refreshTaskStatuses`, `analyzeBudgetChange`).
- Auto-save is debounced by 800ms to persist cleanly to IndexedDB without UI stuttering.
- Save status state machine: `saved` → `unsaved` → `saving` → `saved` (or `error`).

### 2.2 Client-Server AI Security Boundary
1. Client components **never** import `@ai-sdk/google` or access `GEMINI_API_KEY`.
2. Client sends a request to `/api/ai/assistant` or `/api/ai/ideas` with a unique `requestId` (UUIDv4) and sanitized plan context.
3. Server route:
   - Validates incoming payload using Zod.
   - Enforces 413 payload limits.
   - Generates compact context string (capped at 3,000 chars) via `buildAssistantContext` or `buildIdeasContext`.
   - Calls Gemini (`gemini-3.1-flash-lite` with automatic fallback to `gemini-3.5-flash-lite`).
   - Validates output structure with `AIAssistantResponseSchema` or `AIIdeasResponseSchema`.
   - Echoes `requestId` back to client so stale responses are discarded if a newer request was dispatched.

---

## 3. Persistence & Offline Strategy

### 3.1 IndexedDB Layer (`idb`)
- Database: `gatherwise`, Version: 1, Store: `plans` (keyPath: `id`, index: `by-updated`).
- On read: Every record loaded from IndexedDB is validated against `EventPlanSchema`. Corrupted or unversioned records are safely isolated.
- Storage failures trigger `storage-degraded` state in `connectivityManager`.

### 3.2 Connectivity State Machine
- Monitored by [`src/lib/storage/connectivity.ts`](file:///E:/PromptWars/Challenge%205/gatherwise/src/lib/storage/connectivity.ts).
- States: `online`, `offline`, `reconnecting`, `ai-unavailable`, `storage-degraded`.
- Floating status component ([`ConnectivityIndicator.tsx`](file:///E:/PromptWars/Challenge%205/gatherwise/src/components/ui/ConnectivityIndicator.tsx)) uses `aria-live="polite"` so screen readers are informed without interrupting the user.

---

## 4. Design System & Accessibility
- **Styling**: Tailwind CSS v4 with dark glassmorphism palette and accessible contrast tokens (`--brand-primary: #6366f1`, `--brand-secondary: #ec4899`, `--brand-accent: #38bdf8`).
- **Focus Rings**: Universal `*:focus-visible` with 2px offset cyan outline, ensuring non-color-dependent keyboard focus.
- **Keyboard Navigation**: Skip-to-main-content anchor, tab-navigable wizard steps, modal focus trapping, and native semantic inputs.
- **Accessible Indicators**: Status alerts, overdue banners, and budget health bars always combine icons and text descriptions—never relying on color alone.
