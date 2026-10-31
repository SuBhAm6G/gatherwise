'use client'

import { ChangeImpactReport } from '@/lib/domain/types'
import { Clock, ArrowRight } from 'lucide-react'

interface ChangeImpactModalProps {
  report: ChangeImpactReport | null
  onClose: () => void
}

export function ChangeImpactModal({ report, onClose }: ChangeImpactModalProps) {
  if (!report) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-slate-900 p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white">Change Impact Recalculation</h2>
            <p className="text-xs text-slate-400">{report.summary}</p>
          </div>
        </div>

        {/* Affected Items List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Impact Analysis:
          </span>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {report.affectedItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-semibold text-white block mb-0.5">{item.description}</span>
                  <div className="text-slate-400 text-2xs flex items-center gap-1.5">
                    <span className="capitalize">{item.area}</span>
                    <span>•</span>
                    <span>
                      {item.previousValue} →{' '}
                      <strong className="text-indigo-300">{item.newValue}</strong>
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider shrink-0 ${
                    item.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : item.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {item.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recalculated Areas */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 space-y-1.5">
          <span className="font-bold text-white block">Engine Recalculations:</span>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300">
            {report.whatWasRecalculated.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>

        {/* Suggested Next Actions */}
        {report.suggestedNextActions.length > 0 && (
          <div className="text-xs space-y-1.5">
            <span className="font-bold text-slate-300 block">Recommended Next Actions:</span>
            <ul className="space-y-1">
              {report.suggestedNextActions.map((act, i) => (
                <li key={i} className="flex items-center gap-1.5 text-slate-300">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  )
}
