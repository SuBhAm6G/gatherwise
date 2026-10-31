# GatherWise — Security & Privacy Architecture

## 1. Threat Model & Security Posture

GatherWise is designed under the assumption that AI outputs are untrusted and client environments are variable. The security model enforces strict isolation at every boundary:

```
[Client Browser]
       │
       ▼ (HTTPS / Strict Payload Limits)
[Next.js API Gateway]
  ├── Zod Request Schema Validation
  ├── Payload Size Limit (413 Payload Too Large)
  ├── User Content Sanitization (Prompt Injection Barrier)
       │
       ▼ (Server-to-Server with TLS)
[Google Generative AI (Gemini 3.1 Flash Lite)]
       │
       ▼ (Raw Model Response)
[Zod Output Gatekeeper]
  ├── Structured Validation (parseIdeasResponse / parseAssistantResponse)
  └── Fail-Safe Rejection (Invalid output rejected, never rendered into state)
```

---

## 2. API Key Protection
- **Server-Side Exclusivity**: `GEMINI_API_KEY` is only read within `src/lib/ai/provider.ts` during server-side API execution.
- **Client Bundle Isolation**: Build outputs in `.next/static/` are audited to verify that no environment secrets or API keys are leaked to the client bundle.
- **Git Hygiene**: `.env.local` is ignored in `.gitignore`. Only `.env.example` with harmless placeholder tokens is tracked in version control.

---

## 3. Input Validation & Prompt Injection Defense
- **Payload Size Limits**:
  - `POST /api/ai/ideas`: Maximum 50 KB payload size.
  - `POST /api/ai/assistant`: Maximum 100 KB payload size.
- **Length Caps**: User input text is capped at `AI_CONFIG.maxUserContentChars` (4,000 characters) to prevent token exhaustion and context window overflow.
- **Data vs. Instruction Separation**: User inputs are embedded strictly inside designated labeled sections (e.g., `Organizer question: <sanitizedQuestion>`) under immutable system prompts that instruct the model to ground answers exclusively in the verified plan context.
- **Zod Request Validation**: Every API route parses the body using `RequestBodySchema.safeParse()`. Any malformed or unauthorized fields return `HTTP 400 Bad Request` with structured error details.

---

## 4. AI Output Validation
- **Structured Schema Enforcing**: AI responses are validated via `AIIdeasResponseSchema` and `AIAssistantResponseSchema`.
- **Zero Hallucination Arithmetic**: AI responses are never permitted to recalculate or override budget math, task status, due dates, or vendor spend. Those numbers are managed exclusively by the deterministic engines.
- **Traceable Error Handling**: If an AI call fails, times out, or returns invalid JSON, the server returns an explicit status code (502 for validation failure, 503 for service unavailable) and triggers a deterministic offline fallback labeled clearly as "Offline Planning Assistance".

---

## 5. Security Headers
Configured in `next.config.ts`:
- **`X-Content-Type-Options: nosniff`**: Prevents MIME-sniffing exploits.
- **`X-Frame-Options: DENY`**: Protects against clickjacking attacks.
- **`X-XSS-Protection: 1; mode=block`**: Enforces legacy browser XSS filters.
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Prevents leaking full URLs to external domains.

---

## 6. Privacy & Local Storage
- **Browser-Local Storage**: Event plans are stored in IndexedDB on the user's browser. GatherWise operates with zero tracking cookies and zero remote analytics.
- **Context Minimization**: When querying the AI, only relevant summary metrics (event type, budget totals, upcoming tasks, booked vendors) are sent—never raw personal notes or sensitive contact information.
- **Offline Integrity**: Users can disconnect from the internet entirely and retain 100% functionality of budget math, timeline schedules, and vendor tracking without transmitting any packets.
