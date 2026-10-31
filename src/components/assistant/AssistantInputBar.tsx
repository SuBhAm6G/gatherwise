'use client'

import React from 'react'
import { Send } from 'lucide-react'

interface AssistantInputBarProps {
  inputQuestion: string
  setInputQuestion: (q: string) => void
  onSend: () => void
  isLoading: boolean
}

export function AssistantInputBar({
  inputQuestion,
  setInputQuestion,
  onSend,
  isLoading,
}: AssistantInputBarProps) {
  return (
    <footer className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/90">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSend()
        }}
        className="flex items-center gap-3"
      >
        <label htmlFor="assistant-input-field" className="sr-only">Ask question or advice</label>
        <input
          id="assistant-input-field"
          type="text"
          value={inputQuestion}
          onChange={(e) => setInputQuestion(e.target.value)}
          placeholder="Ask about tasks, budget adjustments, vendor checklists…"
          disabled={isLoading}
          maxLength={2000}
          className="flex-1 px-4 py-3 rounded-2xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          aria-label="Send message to assistant"
          disabled={!inputQuestion.trim() || isLoading}
          className="p-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 hover:opacity-95 text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 shrink-0"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>

      <p className="text-2xs text-slate-500 text-center mt-2">
        AI responses are advisory recommendations grounded in your plan. Verify contracts, permits, and financial terms directly.
      </p>
    </footer>
  )
}
