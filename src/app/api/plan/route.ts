import { NextRequest, NextResponse } from 'next/server'
import { EventBriefSchema } from '@/lib/domain/schemas'
import { createPlanFromBrief } from '@/lib/storage/plan-store'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json()
    const parsed = EventBriefSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid brief parameters', details: parsed.error.issues },
        { status: 400 },
      )
    }

    const plan = createPlanFromBrief(parsed.data)
    return NextResponse.json({ plan })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
