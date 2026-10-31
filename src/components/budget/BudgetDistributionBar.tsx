'use client'

import { BudgetCategory } from '@/lib/domain/types'
import { PieChart } from 'lucide-react'

interface BudgetDistributionBarProps {
  categories: BudgetCategory[]
}

const PALETTE = [
  'bg-indigo-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-emerald-500',
  'bg-cyan-500',
  'bg-amber-500',
  'bg-rose-500',
]

export function BudgetDistributionBar({ categories }: BudgetDistributionBarProps) {
  const totalPercent = categories.reduce((s, c) => s + c.allocationPercent, 0)

  return (
    <section
      aria-labelledby="distribution-heading"
      className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl space-y-3"
    >
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span id="distribution-heading" className="flex items-center gap-1.5">
          <PieChart className="w-4 h-4 text-indigo-400" aria-hidden="true" />
          Budget Distribution Preview
        </span>
        <span>{totalPercent}% of total allocated</span>
      </div>

      <div
        className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800"
        role="img"
        aria-label="Visual breakdown of category allocations"
      >
        {categories.map((cat, idx) => {
          const color = cat.isContingency ? 'bg-amber-400' : PALETTE[idx % PALETTE.length]
          return (
            <div
              key={cat.id}
              title={`${cat.name}: ${cat.allocationPercent}%`}
              className={`h-full transition-all duration-300 ${color}`}
              style={{ width: `${cat.allocationPercent}%` }}
            />
          )
        })}
      </div>
    </section>
  )
}
