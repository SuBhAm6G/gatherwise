import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import {
  getGeminiProvider,
  GEMINI_MODEL,
  FALLBACK_GEMINI_MODEL,
  AI_CONFIG,
} from '@/lib/ai/provider'
import { AIIdeasResponseSchema, parseIdeasResponse } from '@/lib/ai/schemas'
import { IDEAS_SYSTEM_PROMPT, buildIdeasContext } from '@/lib/ai/prompts'
import { EventBriefSchema, BudgetPlanSchema } from '@/lib/domain/schemas'

const RequestBodySchema = z.object({
  brief: EventBriefSchema,
  budget: BudgetPlanSchema,
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  const contentLength = Number(req.headers.get('content-length') ?? '0')
  if (contentLength > 50_000) {
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

  const { brief, budget } = parseResult.data
  const planContext = buildIdeasContext(brief, budget)

  const callModel = async (modelName: string) => {
    const google = getGeminiProvider()
    return generateObject({
      model: google(modelName),
      schema: AIIdeasResponseSchema,
      system: IDEAS_SYSTEM_PROMPT,
      prompt: `Generate personalized event ideas for this plan:\n\n${planContext}`,
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
    })
  }

  try {
    let result
    try {
      result = await callModel(GEMINI_MODEL)
    } catch {
      console.warn('[GatherWise] Primary model call failed in ideas, attempting fallback')
      result = await callModel(FALLBACK_GEMINI_MODEL)
    }

    const validated = parseIdeasResponse(result.object)
    if (!validated) {
      return NextResponse.json({ error: 'AI response validation failed' }, { status: 502 })
    }

    return NextResponse.json({ ideas: validated.ideas })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    if (message.includes('GEMINI_API_KEY') || message.includes('not configured')) {
      return NextResponse.json(
        { error: 'AI service not configured', code: 'AI_NOT_CONFIGURED' },
        { status: 503 },
      )
    }

    console.error('[GatherWise] Ideas API invocation error')
    return NextResponse.json(
      { error: 'AI service temporarily unavailable', code: 'AI_ERROR' },
      { status: 503 },
    )
  }
}
