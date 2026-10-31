'use client'

import React from 'react'
import { BudgetCategory } from '@/lib/domain/types'
import { formatCurrency } from '@/lib/engines/budget'
import { ShieldCheck } from 'lucide-react'

interface BudgetCategoryRowProps {
  cat: BudgetCategory
  currencyCode: string
  precision: number
  onAdjustCategory: (categoryId: string, newPercent: number) => void
  onUpdateActualSpend: (categoryId: string, actualSpend: number) => void
}

export function BudgetCategoryRow({
  cat,
  currencyCode,
  precision,
  onAdjustCategory,
  onUpdateActualSpend,
}: BudgetCategoryRowProps) {
  return (
    <article className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Category info & badges */}
        <div className="min-w-0 lg:w-1/3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-white truncate">{cat.name}</span>
            {cat.isContingency && (
              <span className="px-2 py-0.5 text-2xs font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" aria-hidden="true" /> Contingency Reserve
              </span>
            )}
            {cat.isPerGuest && (
              <span className="px-2 py-0.5 text-2xs font-medium rounded-full bg-purple-500/20 text-purple-300">
                Per guest
              </span>
            )}
            {cat.isUserAdjusted && (
              <span className="px-1.5 py-0.5 text-2xs font-medium rounded bg-white/10 text-slate-300">
                Customized
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.description}</p>
        </div>

        {/* Middle: Percentage slider & Allocated Amount */}
        <div className="lg:w-1/3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Target Allocation</span>
            <span className="font-bold text-indigo-300">
              {cat.allocationPercent}% ({formatCurrency(cat.allocatedAmount, currencyCode, precision)})
            </span>
          </div>
          <label htmlFor={`slider-${cat.id}`} className="sr-only">
            {cat.name} allocation percentage slider
          </label>
          <input
            id={`slider-${cat.id}`}
            type="range"
            min="0"
            max="100"
            disabled={cat.isContingency}
            value={cat.allocationPercent}
            onChange={(e) => onAdjustCategory(cat.id, parseInt(e.target.value, 10))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
          />
        </div>

        {/* Right: Actual Spend Input */}
        <div className="lg:w-1/4 flex flex-col sm:flex-row sm:items-center justify-end gap-3 text-xs">
          <div>
            <label htmlFor={`spend-${cat.id}`} className="text-slate-400 block mb-1">
              Actual Invoiced
            </label>
            <input
              id={`spend-${cat.id}`}
              type="number"
              min="0"
              step="1"
              value={cat.actualSpend > 0 ? (cat.actualSpend / Math.pow(10, precision)).toString() : ''}
              onChange={(e) => {
                const val = parseFloat(e.target.value || '0')
                onUpdateActualSpend(
                  cat.id,
                  isNaN(val) ? 0 : Math.round(val * Math.pow(10, precision)),
                )
              }}
              placeholder="0.00"
              className="w-28 px-3 py-1.5 rounded-xl bg-slate-800 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="text-right sm:pl-2">
            <span className="text-slate-500 block">Est. Allocation</span>
            <span className="font-semibold text-slate-200">
              {formatCurrency(cat.estimatedSpend, currencyCode, precision)}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
