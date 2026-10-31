'use client'

import React from 'react'
import { AssistantMessage } from '@/lib/domain/types'
import { Bot, User, Lightbulb, ArrowRight } from 'lucide-react'

interface AssistantMessageBubbleProps {
  msg: AssistantMessage
  onSelectAction: (action: string) => void
}

export function AssistantMessageBubble({ msg, onSelectAction }: AssistantMessageBubbleProps) {
  const isUser = msg.role === 'user'

  return (
    <article className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`} aria-label={isUser ? 'User message' : 'Assistant message'}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0 mt-1" aria-hidden="true">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
            : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
        }`}
      >
        {/* Source Badge if offline */}
        {!isUser && msg.source === 'deterministic' && (
          <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Lightbulb className="w-3 h-3" aria-hidden="true" /> Offline Assistant
          </div>
        )}

        <div className="leading-relaxed whitespace-pre-wrap">{msg.content}</div>

        {/* Grounding Evidence Chips */}
        {!isUser && msg.evidence && msg.evidence.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <span className="text-2xs font-semibold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Verified Plan Evidence:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {msg.evidence.map((ev, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-2xs text-slate-300"
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Follow-up Actions */}
        {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap gap-2">
            {msg.suggestedActions.map((act, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onSelectAction(act)}
                aria-label={`Ask suggested question: ${act}`}
                className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 flex items-center gap-1 transition-colors text-left"
              >
                <ArrowRight className="w-3 h-3" aria-hidden="true" /> {act}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0 mt-1" aria-hidden="true">
          <User className="w-4 h-4" />
        </div>
      )}
    </article>
  )
}
