# Contributing to GatherWise

Thank you for your interest in contributing to GatherWise!

## Quality Standards
Every pull request and commit must adhere to our zero-compromise engineering quality gates:

1. **Strict TypeScript**:
   - `tsconfig.json` runs in full strict mode with `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, and `noUnusedParameters`.
   - Never use the `any` type or `@ts-ignore` / `@ts-nocheck` suppressions.
2. **Deterministic Architecture**:
   - Keep business arithmetic in `src/lib/engines/` as pure, side-effect-free TypeScript functions.
   - Separate data templates into `src/lib/domain/templates/`.
   - Keep every source file under 200–250 lines.
3. **Automated Verification**:
   - Run `npm run check` before submitting a PR.
   - All tests (`npm test`) must pass 100%.
   - Linting (`npm run lint`) must report 0 errors and 0 warnings.
   - Code must pass formatting checks (`npm run format:check`).
4. **Accessibility (WCAG 2.1 AA)**:
   - All interactive controls require semantic HTML and ARIA labels.
   - Never remove keyboard navigation handlers or color contrast guarantees.

## Development Workflow
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run dev server
npm run dev

# 3. Run full verification suite
npm run check
```

