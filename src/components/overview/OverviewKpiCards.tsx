'use client'

import { BudgetPlan, VendorCategory, EventIdea } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'
import { DollarSign, CheckSquare, Users, ShieldCheck } from 'lucide-react'

interface OverviewKpiCardsProps {
  budget: BudgetPlan
  currencyCode: string
  precision: number
  taskPercent: number
  completedCount: number
  totalTasks: number
  bookedVendors: VendorCategory[]
  essentialVendors: VendorCategory[]
  ideas: EventIdea[]
}

export function OverviewKpiCards({
  budget,
  currencyCode,
  precision,
  taskPercent,
  completedCount,
  totalTasks,
  bookedVendors,
  essentialVendors,
  ideas,
}: OverviewKpiCardsProps) {
  const remainingVendors = essentialVendors.length - bookedVendors.length

  return (
    <section
      aria-labelledby="kpi-heading"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <h2 id="kpi-heading" className="sr-only">
        Key Event Performance Indicators
      </h2>

      {/* Metric 1: Budget Remaining */}
      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Budget Status</span>
          <DollarSign className="w-4 h-4 text-emerald-400" aria-hidden="true" />
        </div>
        <div className="text-2xl font-black text-white">
          {formatCurrency(budget.remaining, currencyCode, precision)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {budget.isOverBudget ? (
            <span className="text-rose-400 font-semibold">
              Over budget by {formatCurrency(budget.overBudgetAmount, currencyCode, precision)}
            </span>
          ) : (
            <span>Remaining of {formatCurrency(budget.totalBudget, currencyCode, precision)}</span>
          )}
        </p>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budget.isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.min(
                100,
                budget.totalBudget > 0
                  ? Math.round(
                      ((budget.totalActual > 0 ? budget.totalActual : budget.totalEstimated) /
                        budget.totalBudget) *
                        100,
                    )
                  : 0,
              )}%`,
            }}
          />
        </div>
      </article>

      {/* Metric 2: Planning Completion */}
      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Tasks Progress</span>
          <CheckSquare className="w-4 h-4 text-indigo-400" aria-hidden="true" />
        </div>
        <div className="text-2xl font-black text-white">{taskPercent}%</div>
        <p className="text-xs text-slate-400 mt-1">
          {completedCount} of {totalTasks} tasks completed
        </p>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${taskPercent}%` }}
          />
        </div>
      </article>

      {/* Metric 3: Vendor Booking Health */}
      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Essential Vendors</span>
          <Users className="w-4 h-4 text-purple-400" aria-hidden="true" />
        </div>
        <div className="text-2xl font-black text-white">
          {bookedVendors.length} / {essentialVendors.length}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {remainingVendors === 0
            ? 'All essential vendors booked'
            : `${remainingVendors} essential vendors remaining`}
        </p>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all duration-500"
            style={{
              width: `${
                essentialVendors.length > 0
                  ? Math.min(
                      100,
                      Math.round((bookedVendors.length / essentialVendors.length) * 100),
                    )
                  : 100
              }%`,
            }}
          />
        </div>
      </article>

      {/* Metric 4: Contingency Buffer */}
      <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Contingency Buffer</span>
          <ShieldCheck className="w-4 h-4 text-pink-400" aria-hidden="true" />
        </div>
        <div className="text-2xl font-black text-white">{budget.contingencyPercent}%</div>
        <p className="text-xs text-slate-400 mt-1">Protected reserve for unanticipated expenses</p>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-pink-300 font-medium">
          <span>{ideas.filter((i) => i.isSaved).length} ideas pinned</span>
        </div>
      </article>
    </section>
  )
}
