'use client'

interface AssistantQuickPromptsProps {
  prompts: string[]
  isLoading: boolean
  onSelectPrompt: (p: string) => void
}

export function AssistantQuickPrompts({
  prompts,
  isLoading,
  onSelectPrompt,
}: AssistantQuickPromptsProps) {
  return (
    <nav
      aria-label="Suggested quick questions"
      className="px-6 py-2 border-t border-white/5 bg-slate-900/40 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs"
    >
      <span className="text-slate-500 font-semibold text-2xs shrink-0">Suggestions:</span>
      {prompts.map((q, idx) => (
        <button
          key={idx}
          type="button"
          disabled={isLoading}
          onClick={() => onSelectPrompt(q)}
          aria-label={`Ask question: ${q}`}
          className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap text-2xs border border-white/5 transition-colors disabled:opacity-50"
        >
          {q}
        </button>
      ))}
    </nav>
  )
}
