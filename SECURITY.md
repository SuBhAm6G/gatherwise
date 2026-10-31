# GatherWise Security Policy

## Supported Versions
GatherWise receives active security updates on the main branch.

| Version | Supported |
|---|:---:|
| 1.1.x | Yes |
| 1.0.x | Yes |

## Reporting a Vulnerability
If you discover a security issue or vulnerability, please report it via GitHub Security Advisories or privately to the project maintainers. Do not open public issues for sensitive security findings.

## Security Controls Summary
1. **Zero Key Exposure**: `GEMINI_API_KEY` is strictly server-side and never bundled in client assets.
2. **Strict Zod Gates**: Every external request and every LLM output is validated against strict Zod schemas.
3. **Prompt Injection Barrier**: User inputs are treated strictly as isolated data delimiters inside immutable system prompts.
4. **Local-First Privacy**: User plan details, vendor quotes, and budget allocations are persisted exclusively on-device in IndexedDB.
5. **Hardened HTTP Headers**: Strict CSP, HSTS, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, and Referrer-Policy configured on all routes.

