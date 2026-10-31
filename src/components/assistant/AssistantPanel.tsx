'use client'

import { useState, useRef, useEffect } from 'react'
import { EventPlan, AssistantMessage } from '@/lib/domain/types'
import { getOfflineFallbackResponse } from '@/lib/ai/fallback'
import { Sparkles, RefreshCw, ShieldCheck, Bot } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { AssistantMessageBubble } from './AssistantMessageBubble'
import { AssistantQuickPrompts } from './AssistantQuickPrompts'
import { AssistantInputBar } from './AssistantInputBar'

interface AssistantPanelProps {
  plan: EventPlan
}

const QUICK_PROMPTS = [
  'What tasks are most urgent right now?',
  'Is my budget at risk of an overrun?',
  'Which essential vendors need immediate attention?',
  'What should I prioritize this week?',
]

function createInitialAssistantMessage(plan: EventPlan): AssistantMessage {
  return {
    id: uuidv4(),
    role: 'assistant',
    content: `Hello! I am your GatherWise planning assistant for "${plan.brief.eventName}". I have full context on your budget, timeline deadlines, and vendor progress. How can I help you make progress today?`,
    source: 'ai',
    createdAt: new Date().toISOString(),
    requestId: null,
    isStreaming: false,
    evidence: [
      `Event: ${plan.brief.eventName} (${plan.brief.eventType})`,
      `Guests: ${plan.brief.guestCount}`,
      `Budget: ${plan.brief.currencyCode} ${(plan.budget.totalBudget / 100).toLocaleString()}`,
    ],
    suggestedActions: [
      'Ask about overdue tasks',
      'Review budget breakdown',
      'Check vendor booking status',
    ],
  }
}

export function AssistantPanel({ plan }: AssistantPanelProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    createInitialAssistantMessage(plan),
  ])
  const [inputQuestion, setInputQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatBottomRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (textToSend?: string) => {
    const question = (textToSend || inputQuestion).trim()
    if (!question || isLoading) return

    const requestId = uuidv4()
    const userMsg: AssistantMessage = {
      id: uuidv4(),
      role: 'user',
      content: question,
      source: 'ai',
      createdAt: new Date().toISOString(),
      requestId,
      isStreaming: false,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuestion('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: plan.brief,
          budget: plan.budget,
          tasks: plan.tasks,
          vendors: plan.vendors,
          question,
          requestId,
        }),
      })

      if (!res.ok) {
        throw new Error(`Assistant API failed with status ${res.status}`)
      }

      const data = await res.json()
      if (data.answer) {
        const assistantMsg: AssistantMessage = {
          id: uuidv4(),
          role: 'assistant',
          content: data.answer,
          source: 'ai',
          createdAt: new Date().toISOString(),
          requestId: data.requestId ?? requestId,
          isStreaming: false,
          evidence: data.evidence ?? [],
          suggestedActions: data.suggestedActions ?? [],
        }
        setMessages((prev) => [...prev, assistantMsg])
        return
      }

      throw new Error('Invalid format returned from assistant API')
    } catch {
      const fallback = getOfflineFallbackResponse(plan, question)
      const assistantMsg: AssistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: fallback.answer,
        source: 'deterministic',
        createdAt: new Date().toISOString(),
        requestId,
        isStreaming: false,
        evidence: fallback.evidence,
        suggestedActions: fallback.suggestedActions,
      }
      setMessages((prev) => [...prev, assistantMsg])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section
      aria-label="AI Event Planning Assistant"
      className="flex flex-col h-[750px] max-w-5xl mx-auto rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-2xl"
    >
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25"
            aria-hidden="true"
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-white">
              Event Planning Assistant
            </h1>
            <p className="text-2xs text-slate-400">
              Grounded in your live budget, tasks, and vendor pipeline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-2xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span className="hidden sm:inline">Context-Grounded Verification</span>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin">
        {messages.map((msg) => (
          <AssistantMessageBubble
            key={msg.id}
            msg={msg}
            onSelectAction={(action) => handleSendMessage(action)}
          />
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start" aria-live="polite">
            <div
              className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0"
              aria-hidden="true"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" aria-hidden="true" />
              <span>Analyzing plan data and verifying constraints…</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Bar */}
      <AssistantQuickPrompts
        prompts={QUICK_PROMPTS}
        isLoading={isLoading}
        onSelectPrompt={(p) => handleSendMessage(p)}
      />

      {/* Input Area */}
      <AssistantInputBar
        inputQuestion={inputQuestion}
        setInputQuestion={setInputQuestion}
        onSend={() => handleSendMessage()}
        isLoading={isLoading}
      />
    </section>
  )
}
