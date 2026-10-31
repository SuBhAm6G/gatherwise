import { z } from 'zod'

// ─── Ideas Response Schema ─────────────────────────────────────────────────

export const AIIdeaSchema = z.object({
  title: z.string().min(1).max(100),
  explanation: z.string().min(1).max(500),
  whyItFits: z.string().min(1).max(300),
  effort: z.enum(['minimal', 'low', 'medium', 'high']),
  costCategory: z.enum(['free', 'budget-friendly', 'moderate', 'premium']),
  planningStage: z.string().max(100),
  potentialConstraints: z.array(z.string().max(200)).max(5),
  alternatives: z.array(z.string().max(200)).max(3),
})

export const AIIdeasResponseSchema = z.object({
  ideas: z.array(AIIdeaSchema).min(1).max(8),
})

export type AIIdeasResponse = z.infer<typeof AIIdeasResponseSchema>

// ─── Assistant Response Schema ─────────────────────────────────────────────

export const AIAssistantResponseSchema = z.object({
  answer: z.string().min(1).max(3000),
  evidence: z.array(z.string().max(200)).max(8),
  suggestedActions: z.array(z.string().max(200)).max(5),
  isInsufficientContext: z.boolean(),
})

export type AIAssistantResponse = z.infer<typeof AIAssistantResponseSchema>

// ─── Validation helpers ────────────────────────────────────────────────────

export function parseIdeasResponse(raw: unknown): AIIdeasResponse | null {
  const result = AIIdeasResponseSchema.safeParse(raw)
  if (!result.success) {
    console.warn('[GatherWise AI] Ideas response validation failed:', result.error.issues)
    return null
  }
  return result.data
}

export function parseAssistantResponse(raw: unknown): AIAssistantResponse | null {
  const result = AIAssistantResponseSchema.safeParse(raw)
  if (!result.success) {
    console.warn('[GatherWise AI] Assistant response validation failed:', result.error.issues)
    return null
  }
  return result.data
}
