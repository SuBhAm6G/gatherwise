import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getGeminiProvider, GEMINI_MODEL, FALLBACK_GEMINI_MODEL, AI_CONFIG } from '@/lib/ai/provider'
import { AIAssistantResponseSchema, parseAssistantResponse } from '@/lib/ai/schemas'
import { ASSISTANT_SYSTEM_PROMPT, buildAssistantContext } from '@/lib/ai/prompts'
import { EventBriefSchema, BudgetPlanSchema, PlanTaskSchema, VendorCategorySchema } from '@/lib/domain/schemas'

const RequestBodySchema = z.object({
  brief: EventBriefSchema,
  budget: BudgetPlanSchema,
  tasks: z.array(PlanTaskSchema).max(200),
  vendors: z.array(VendorCategorySchema).max(30),
  question: z.string().min(1).max(AI_CONFIG.maxUserContentChars),
  requestId: z.string().uuid(),
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentLength = Number(req.headers.get('content-length') ?? '0')
  if (contentLength > 100_000) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parseResult = RequestBodySchema.safeParse(body)
  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parseResult.error.issues },
      { status: 400 },
    )
  }

  const { brief, budget, tasks, vendors, question, requestId } = parseResult.data

  const sanitizedQuestion = question.trim().slice(0, AI_CONFIG.maxUserContentChars)
  const planContext = buildAssistantContext(brief, budget, tasks, vendors)

  const callModel = async (modelName: string) => {
    const google = getGeminiProvider()
    return generateObject({
      model: google(modelName),
      schema: AIAssistantResponseSchema,
      system: ASSISTANT_SYSTEM_PROMPT,
      prompt: `Current plan context:\n${planContext}\n\nOrganizer question: ${sanitizedQuestion}`,
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
    })
  }

  try {
    let result
    try {
      result = await callModel(GEMINI_MODEL)
    } catch (primaryErr) {
      console.warn(`[GatherWise] Model ${GEMINI_MODEL} failed, attempting ${FALLBACK_GEMINI_MODEL}:`, primaryErr)
      result = await callModel(FALLBACK_GEMINI_MODEL)
    }

    const validated = parseAssistantResponse(result.object)
    if (!validated) {
      return NextResponse.json({ error: 'AI response validation failed', requestId }, { status: 502 })
    }

    return NextResponse.json({ ...validated, requestId })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    if (message.includes('GEMINI_API_KEY') || message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service not configured', code: 'AI_NOT_CONFIGURED', requestId },
        { status: 503 },
      )
    }

    console.error('[GatherWise] Assistant API error:', message)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable', code: 'AI_ERROR', requestId },
      { status: 503 },
    )
  }
}
