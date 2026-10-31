'use client'

import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

interface WizardFooterNavProps {
  step: number
  onBack: () => void
  onNext: () => void
  onFinish: () => void
}

export function WizardFooterNav({ step, onBack, onNext, onFinish }: WizardFooterNavProps) {
  return (
    <footer className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          aria-label="Previous step"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
        </button>
      ) : (
        <div />
      )}

      {step < 4 ? (
        <button
          type="button"
          onClick={onNext}
          aria-label="Next step"
          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
        >
          Next Step <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onFinish}
          aria-label="Generate complete event plan"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 text-white shadow-xl shadow-indigo-500/30 transition-all"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" /> Generate Plan
        </button>
      )}
    </footer>
  )
}
