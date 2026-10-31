import { describe, it, expect } from 'vitest'
import {
  parseIdeasResponse,
  parseAssistantResponse,
  AIIdeasResponseSchema,
  AIAssistantResponseSchema,
} from '@/lib/ai/schemas'

describe('AI Schema Validation & Parsing', () => {
  describe('AIIdeasResponseSchema', () => {
    const validIdea = {
      title: 'Cozy Photo Booth',
      explanation: 'Set up an instant camera with themed props for guests.',
      whyItFits: 'Matches small budget and casual atmosphere.',
      effort: 'low' as const,
      costCategory: 'budget-friendly' as const,
      planningStage: '2 weeks before',
      potentialConstraints: ['Adequate lighting required'],
      alternatives: ['Digital smartphone QR album'],
    }

    it('accepts valid ideas response', () => {
      const parsed = parseIdeasResponse({ ideas: [validIdea] })
      expect(parsed).not.toBeNull()
      expect(parsed?.ideas[0]?.title).toBe('Cozy Photo Booth')
      expect(parsed?.ideas[0]?.effort).toBe('low')
    })

    it('validates all allowed effort enum values', () => {
      const efforts = ['minimal', 'low', 'medium', 'high'] as const
      for (const effort of efforts) {
        const res = AIIdeasResponseSchema.safeParse({
          ideas: [{ ...validIdea, effort }],
        })
        expect(res.success).toBe(true)
      }
    })

    it('validates all allowed costCategory enum values', () => {
      const costs = ['free', 'budget-friendly', 'moderate', 'premium'] as const
      for (const costCategory of costs) {
        const res = AIIdeasResponseSchema.safeParse({
          ideas: [{ ...validIdea, costCategory }],
        })
        expect(res.success).toBe(true)
      }
    })

    it('rejects ideas response with invalid effort enum', () => {
      const raw = {
        ideas: [{ ...validIdea, effort: 'super-hard-not-in-enum' }],
      }
      const parsed = parseIdeasResponse(raw)
      expect(parsed).toBeNull()
    })

    it('rejects ideas response with invalid costCategory enum', () => {
      const raw = {
        ideas: [{ ...validIdea, costCategory: 'dirt-cheap' }],
      }
      const parsed = parseIdeasResponse(raw)
      expect(parsed).toBeNull()
    })

    it('rejects idea missing required explanation field', () => {
      const raw = {
        ideas: [{ ...validIdea, explanation: undefined }],
      }
      const parsed = parseIdeasResponse(raw)
      expect(parsed).toBeNull()
    })

    it('rejects empty ideas array (min 1 idea required)', () => {
      const res = AIIdeasResponseSchema.safeParse({ ideas: [] })
      expect(res.success).toBe(false)
    })

    it('rejects non-object or null input to parseIdeasResponse', () => {
      expect(parseIdeasResponse(null)).toBeNull()
      expect(parseIdeasResponse(undefined)).toBeNull()
      expect(parseIdeasResponse('string-not-json')).toBeNull()
      expect(parseIdeasResponse(12345)).toBeNull()
    })
  })

  describe('AIAssistantResponseSchema', () => {
    const validAssistant = {
      answer: 'You have 2 essential vendors remaining to book: Venue and Catering.',
      evidence: ['Venue: status not-started', 'Catering: status not-started'],
      suggestedActions: ['Shortlist 3 venues', 'Request sample menus'],
      isInsufficientContext: false,
    }

    it('accepts valid assistant response with evidence and suggested actions', () => {
      const parsed = parseAssistantResponse(validAssistant)
      expect(parsed).not.toBeNull()
      expect(parsed?.evidence.length).toBe(2)
      expect(parsed?.suggestedActions.length).toBe(2)
      expect(parsed?.isInsufficientContext).toBe(false)
    })

    it('accepts assistant response when isInsufficientContext is true', () => {
      const res = AIAssistantResponseSchema.safeParse({
        ...validAssistant,
        isInsufficientContext: true,
        answer: 'I need to know your expected guest count before recommending catering packages.',
      })
      expect(res.success).toBe(true)
    })

    it('rejects malformed assistant response missing answer field', () => {
      const raw = {
        evidence: ['Some fact'],
        isInsufficientContext: false,
      }
      const parsed = parseAssistantResponse(raw)
      expect(parsed).toBeNull()
    })

    it('rejects assistant response with non-array evidence', () => {
      const res = AIAssistantResponseSchema.safeParse({
        ...validAssistant,
        evidence: 'not-an-array',
      })
      expect(res.success).toBe(false)
    })

    it('rejects non-object or null input to parseAssistantResponse', () => {
      expect(parseAssistantResponse(null)).toBeNull()
      expect(parseAssistantResponse(undefined)).toBeNull()
      expect(parseAssistantResponse(true)).toBeNull()
      expect(parseAssistantResponse('plain string')).toBeNull()
    })
  })
})
