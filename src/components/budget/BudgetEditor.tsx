'use client'

import { useState } from 'react'
import { BudgetPlan, EventBrief } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'
import { ShieldAlert, Edit2 } from 'lucide-react'
import { BudgetMetricsCards } from './BudgetMetricsCards'
import { BudgetDistributionBar } from './BudgetDistributionBar'
import { BudgetCategoryRow } from './BudgetCategoryRow'

interface BudgetEditorProps {
  brief: EventBrief
  budget: BudgetPlan
  onAdjustCategory: (categoryId: string, newPercent: number) => void
  onUpdateActualSpend: (categoryId: string, actualSpend: number) => void
  onChangeTotalBudget: (newBudgetAmount: number) => void
}

export function BudgetEditor({
  brief,
  budget,
  onAdjustCategory,
  onUpdateActualSpend,
  onChangeTotalBudget,
}: BudgetEditorProps) {
  const { currencyCode, currencyMinorUnits: precision } = brief
  const [editingTotal, setEditingTotal] = useState(false)
  const [totalInput, setTotalInput] = useState(
    (budget.totalBudget / Math.pow(10, precision)).toString(),
  )

  const handleTotalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(totalInput)
    if (!isNaN(val) && val >= 0) {
      const minor = Math.round(val * Math.pow(10, precision))
      onChangeTotalBudget(minor)
      setEditingTotal(false)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Summary Cards */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Budget Planner & Spend Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Allocations recalculate dynamically using integer minor units. Edit percentage
            allocations or record actual vendor invoices.
          </p>
        </div>

        {/* Change Total Budget Button / Form */}
        <div>
          {editingTotal ? (
            <form onSubmit={handleTotalSubmit} className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="10"
                value={totalInput}
                onChange={(e) => setTotalInput(e.target.value)}
                className="w-36 px-3 py-1.5 rounded-xl bg-slate-800 border border-indigo-500 text-white text-sm focus:outline-none"
                placeholder="Total budget"
                autoFocus
              />
              <button
                type="submit"
                aria-label="Save new total budget"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingTotal(false)}
                aria-label="Cancel editing total budget"
                className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setTotalInput((budget.totalBudget / Math.pow(10, precision)).toString())
                setEditingTotal(true)
              }}
              aria-label="Adjust Total Budget"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              Adjust Total Budget
            </button>
          )}
        </div>
      </header>

      {/* Over budget banner */}
      {budget.isOverBudget && (
        <aside
          role="alert"
          aria-labelledby="budget-overrun-heading"
          className="rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 sm:p-5 text-rose-200 backdrop-blur-xl flex items-center gap-3"
        >
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
            <ShieldAlert className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="budget-overrun-heading" className="font-bold text-sm sm:text-base text-white">
              Budget Overrun Detected (
              {formatCurrency(budget.overBudgetAmount, currencyCode, precision)})
            </h2>
            <p className="text-xs text-rose-300 mt-0.5">
              Your combined estimated or recorded actual expenditures exceed the allocated total.
              Adjust category percentages or review non-essential expenses.
            </p>
          </div>
        </aside>
      )}

      {/* Summary KPI Cards */}
      <BudgetMetricsCards budget={budget} currencyCode={currencyCode} precision={precision} />

      {/* Visual Distribution Bar */}
      <BudgetDistributionBar categories={budget.categories} />

      {/* Category Allocation Editor Table */}
      <section
        aria-labelledby="allocations-heading"
        className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden backdrop-blur-xl shadow-xl"
      >
        <div className="p-4 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 id="allocations-heading" className="text-base sm:text-lg font-bold text-white">
              Allocations by Category
            </h2>
            <p className="text-xs text-slate-400">
              Adjust percentage sliders to rebalance funds. Actual spend inputs update your
              remaining balance in real time.
            </p>
          </div>
          <span className="text-xs text-slate-500 italic">
            Amounts shown are planning estimates only
          </span>
        </div>

        <div className="divide-y divide-white/5">
          {budget.categories.map((cat) => (
            <BudgetCategoryRow
              key={cat.id}
              cat={cat}
              currencyCode={currencyCode}
              precision={precision}
              onAdjustCategory={onAdjustCategory}
              onUpdateActualSpend={onUpdateActualSpend}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
