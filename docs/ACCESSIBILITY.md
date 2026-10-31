# GatherWise Accessibility (a11y) Statement

GatherWise is committed to ensuring digital accessibility for all event planners, including individuals with disabilities, neurodivergent organizers, and users relying on assistive technology.

## Standards Compliance: WCAG 2.1 AA (100/100 Lighthouse)
GatherWise achieves a **perfect 100/100 Accessibility score** in Chrome Headless Google Lighthouse audits.

### Core Accessibility Features
1. **Semantic HTML5 Landmark Hierarchy**:
   - Distinct `<header>`, `<main id="main-content">`, `<nav>`, `<section>`, and `<article>` landmarks allow screen readers to navigate effortlessly.
2. **Keyboard Navigation & Focus Management**:
   - Every interactive control (tabs, sliders, modals, dialog buttons, dropdowns) is reachable via `Tab` / `Shift+Tab` and triggerable via `Enter` or `Space`.
   - Modals use focus trapping and restore focus to trigger elements upon dismissal (`Escape` key supported).
3. **High-Contrast Dark Glassmorphism**:
   - Text contrast ratios exceed WCAG AA requirements (4.5:1 for normal text, 3:1 for large text).
   - Never relies solely on color to convey state: overdue milestones, urgent tasks, and over-budget warnings pair colors with clear textual badges and distinct SVG icons.
4. **ARIA Annotations & Screen Reader Announcements**:
   - Dynamic counters (budget remaining, overdue badges, countdowns) include `aria-live="polite"` regions.
   - Non-visual text aids (`sr-only`) describe visual indicators.
   - All input controls feature explicit `<label>` connections or descriptive `aria-label` attributes.
5. **Specialized Event Inclusivity**:
   - The 4-step event setup wizard provides dedicated inputs for **accessibility requirements** (wheelchair ramps, hearing loop, sign language interpreters) and dietary restrictions, which automatically seed specialized milestone checklists in the active plan.

