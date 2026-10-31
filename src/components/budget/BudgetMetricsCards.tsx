'use client'

import { BudgetPlan } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'

interface BudgetMetricsCardsProps {
  budget: BudgetPlan
  currencyCode: string
  precision: number
}

export function BudgetMetricsCards({ budget, currencyCode, precision }: BudgetMetricsCardsProps) {
  return (
    <section
      aria-labelledby="budget-summary-heading"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <h2 id="budget-summary-heading" className="sr-only">
        Budget Summary Metrics
      </h2>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Total Budget</span>
        <span className="text-xl sm:text-2xl font-black text-white">
          {formatCurrency(budget.totalBudget, currencyCode, precision)}
        </span>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Total Allocated</span>
        <span className="text-xl sm:text-2xl font-black text-slate-200">
          {formatCurrency(budget.totalAllocated, currencyCode, precision)}
        </span>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Actual Invoiced</span>
        <span className="text-xl sm:text-2xl font-black text-purple-300">
          {formatCurrency(budget.totalActual, currencyCode, precision)}
        </span>
      </article>

      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-xl">
        <span className="text-xs font-semibold text-slate-400 block mb-1">Remaining Balance</span>
        <span
          className={`text-xl sm:text-2xl font-black ${
            budget.isOverBudget ? 'text-rose-400' : 'text-emerald-400'
          }`}
        >
          {formatCurrency(budget.remaining, currencyCode, precision)}
        </span>
      </article>
    </section>
  )
}
