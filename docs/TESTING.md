# GatherWise — Comprehensive Testing & Quality Verification Strategy

## 1. Overview of Test Architecture

GatherWise adheres to a test pyramid designed for rapid deterministic validation, complete boundary safety, and reliable AI gates:

```
          ▲
         / \
        /   \     E2E / Browser Verification
       /─────\    (Playwright & Interactive Browser Subagent)
      /       \
     /─────────\   Integration & Safety Gates
    /           \  (AI Zod Schema Gates, Prompt Builders, IndexedDB Store)
   /─────────────\
  /               \ Pure Engine Unit Tests
 /─────────────────\ (Budget, Timeline, Vendors, Change Impact, Domain Schemas)
```

- **Harness**: Vitest v5 with `@vitejs/plugin-react` and `jsdom`.
- **Database Mocking**: `fake-indexeddb/auto` for in-memory IndexedDB CRUD operations without requiring a live browser.
- **Date Mocking & Testing**: `date-fns` test cases covering leap years (e.g. Feb 29), month boundaries, and relative date arithmetic.
- **Test Count**: **128 passing tests** across 9 test suites covering all units, boundary edge cases, multi-currency formatting, offline resilience, and schema transitions.

---

## 2. Test Suites & Coverage (128 Tests Across 9 Suites)

### 2.1 Pure Deterministic Engines & Domain Models
| Test Suite | File | Tests | Key Cases Verified |
|------------|------|-------|--------------------|
| **Domain Schemas** | `src/tests/domain/schemas.test.ts` | **22** | Complete brief validation, null date handling, zero & negative budget bounds, minimum guest counts, ISO date formatting, currency length, UUID validation, category percentage limits, negative lead-time teardown tasks, composite `EventPlan` entities. |
| **Budget Engine** | `src/tests/engines/budget.test.ts` | **20** | Integer minor-unit arithmetic, multi-event category generation (wedding, birthday, community), zero budget, micro budget ($1.00), massive budget ($50,000,000.00), floor-division remainder sum conservation, actual spend overrun detection, percentage rebalancing, multi-currency formatting (USD, EUR, GBP, 0-decimal JPY). |
| **Timeline Engine** | `src/tests/engines/timeline.test.ts` | **16** | Stable UUID assignment, reverse lead-time derived due dates, accessibility task injection, null date unconfirmed handling, cleanup task negative day scheduling, overdue detection, upcoming task filtering (7, 14, 90 days), dependency blocking and unblocking upon prerequisite completion/skipping, leap year (2028-02-29) resilience, date rescheduling preserving custom tasks. |
| **Vendor Tracker** | `src/tests/engines/vendors.test.ts` | **12** | Event-specific vendor checklists, consultation questions array, contract protection checklists, pipeline progression across all statuses (`not-started`, `researching`, `contacted`, `quote-received`, `booked`, `not-needed`), numeric and null quote updates, immutability guarantees. |
| **Change Impact** | `src/tests/engines/change-impact.test.ts` | **12** | Budget increase and decrease ripple analysis, critical spend overrun detection when budget cut below recorded actuals, guest count increase/decrease ripple effects on per-guest categories, 10x capacity spikes, date shifts forward and backward, overdue compression threshold alerts triggering AI recommendations, date assignment and removal. |

### 2.2 AI Layer Safety & Fallback Gates
| Test Suite | File | Tests | Key Cases Verified |
|------------|------|-------|--------------------|
| **AI Schemas** | `src/tests/ai/schemas.test.ts` | **13** | Strict Zod validation of raw model JSON, validation of all allowed `effort` and `costCategory` enum values, rejection of invalid enums, rejection of missing required fields, minimum array size enforcement (rejects empty ideas), robust parsing of non-object / corrupt inputs without crashing. |
| **Prompt Builders & Guardrails** | `src/tests/ai/prompts.test.ts` | **10** | Context assembly for Ideas and Assistant endpoints, sparse brief fallbacks, token length caps, over-budget warning injection, null date safety (no `NaN`), booked vs pending vendor segregation, verification of anti-hallucination prompt guardrails prohibiting fabricated quotes or contradictory numbers. |
| **Offline Fallback Engine** | `src/tests/ai/fallback.test.ts` | **13** | Intent matching for urgent tasks, budget health, vendor status, and countdowns; uppercase and punctuation resilience; over-budget warning generation; countdown handling for past, today, future, and unscheduled events; fallback responses for unrecognized queries; deterministic offline ideas library for all archetypes. |

### 2.3 Storage & Persistence
| Test Suite | File | Tests | Key Cases Verified |
|------------|------|-------|--------------------|
| **Plan Store** | `src/tests/storage/plan-store.test.ts` | **10** | UUID generation, ISO timestamp generation, IndexedDB saving and retrieval, multi-plan persistence without duplication, updates overwriting cleanly, safe deletion by ID, graceful handling of non-existent IDs, evaluator demo plan seeding with `isDemoData` flag. |

---

## 3. Quality & Security Checks Summary

| Check | Tool / Command | Result | Details |
|-------|----------------|--------|---------|
| **Unit & Integration Tests** | `npx vitest run` | ✅ **128 / 128 PASSED** | 9 test suites, 0 failures, 100% pass rate in ~2.8s |
| **TypeScript Type Check** | `npx tsc --noEmit` | ✅ **0 ERRORS** | Strict type-safety across all domain, engine, UI, and test files |
| **ESLint Quality Check** | `npx eslint src/` | ✅ **0 ERRORS, 0 WARNINGS** | Clean code hygiene, React 19 hook safety, zero unused variables |
| **Production Build** | `npm run build` | ✅ **SUCCESSFUL (1.5s)** | Next.js 16.4.2 Turbopack optimized bundle, static prerendering |
| **Repository & Security Audit** | `npx tsx scripts/audit.ts` | ✅ **8 / 8 PASSED** | Zero leaked credentials, `.env.local` untracked, no unsafe `as any` in core |

---

## 4. Google Lighthouse Audit Metrics

Audited against `http://localhost:3000` via Chrome Headless Lighthouse:

```
┌────────────────────────────────────────────────────────┐
│               GOOGLE LIGHTHOUSE AUDIT REPORT           │
├─────────────────────────┬──────────────┬───────────────┤
│ Category                │ Score        │ Rating        │
├─────────────────────────┼──────────────┼───────────────┤
│ ♿ Accessibility         │ 100 / 100    │ PERFECT       │
│ 🔍 SEO                  │ 100 / 100    │ PERFECT       │
│ 🛡️ Best Practices       │ 96 / 100     │ EXCELLENT     │
│ 🤖 Agentic Browsing     │ 100 / 100    │ PERFECT       │
│ ⚡ Performance          │ 73 / 100     │ GOOD (Dev)    │
└─────────────────────────┴──────────────┴───────────────┘
```

### Accessibility Highlights
- **100/100 Accessibility Score**: Every button includes accessible names or explicit `aria-label` attributes for screen readers.
- **Form Association**: All input fields in the Event Wizard and interactive editors have explicit `id` and `htmlFor` pairings.
- **Focus Rings**: High-contrast, keyboard-navigable outline rings (`focus-visible:outline-2 focus-visible:outline-indigo-400`).
- **Semantic Structure**: Single `<h1>` per view, descriptive navigation landmarks (`<nav aria-label="Event sections">`), and aria-expanded/aria-controls state indicators.
- **Color Contrast**: Compliant foreground/background ratios exceeding WCAG AA requirements on dark theme.

---

## 5. Verification Commands

```bash
# 1. Run all 128 tests
npx vitest run

# 2. Run TypeScript type check
npx tsc --noEmit

# 3. Run ESLint check
npx eslint src/

# 4. Run pre-submission security and hygiene audit
npx tsx scripts/audit.ts

# 5. Build production bundle
npm run build
```
