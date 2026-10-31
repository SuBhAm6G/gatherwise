import { createGoogleGenerativeAI } from '@ai-sdk/google'

/**
 * Returns Google Generative AI provider instance.
 * Server-side ONLY. Never expose GEMINI_API_KEY to client bundle.
 */
export function getGeminiProvider() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not configured. ' +
        'Copy .env.example to .env.local and add your key from https://aistudio.google.com/',
    )
  }
  return createGoogleGenerativeAI({ apiKey })
}

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
export const FALLBACK_GEMINI_MODEL = 'gemini-3.5-flash-lite'

export const AI_CONFIG = {
  maxOutputTokens: Number(process.env.AI_MAX_TOKENS ?? '2048'),
  timeoutMs: Number(process.env.AI_TIMEOUT_MS ?? '30000'),
  maxUserContentChars: 4000,
  maxPlanContextChars: 3000,
}
