'use client'

import { PlanningUrgency } from '@/lib/domain/types'
import { SUPPORTED_CURRENCIES } from '@/lib/domain/constants'
import { ShieldAlert } from 'lucide-react'

interface WizardStep2BudgetProps {
  eventDate: string
  setEventDate: (d: string) => void
  hasNoDateYet: boolean
  setHasNoDateYet: (b: boolean) => void
  guestCount: string
  setGuestCount: (g: string) => void
  budgetAmountMajor: string
  setBudgetAmountMajor: (b: string) => void
  currencyCode: string
  setCurrencyCode: (c: string) => void
  planningUrgency: PlanningUrgency
  setPlanningUrgency: (u: PlanningUrgency) => void
  errors: Record<string, string>
}

export function WizardStep2Budget({
  eventDate,
  setEventDate,
  hasNoDateYet,
  setHasNoDateYet,
  guestCount,
  setGuestCount,
  budgetAmountMajor,
  setBudgetAmountMajor,
  currencyCode,
  setCurrencyCode,
  planningUrgency,
  setPlanningUrgency,
  errors,
}: WizardStep2BudgetProps) {
  return (
    <section aria-labelledby="step2-heading" className="space-y-6">
      <h2 id="step2-heading" className="text-lg font-bold text-white mb-2">
        Step 2: Date, Scale & Budget
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventDate" className="block text-sm font-semibold text-slate-200 mb-1">
            Event Date
          </label>
          <input
            id="eventDate"
            type="date"
            disabled={hasNoDateYet}
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-40"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              id="noDate"
              type="checkbox"
              checked={hasNoDateYet}
              onChange={(e) => {
                setHasNoDateYet(e.target.checked)
                if (e.target.checked) setEventDate('')
              }}
              className="rounded bg-slate-800 border-white/20 text-indigo-500 focus:ring-indigo-500"
            />
            <label htmlFor="noDate" className="text-xs text-slate-400 cursor-pointer">
              Decide or confirm date later
            </label>
          </div>
          {errors.eventDate && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1" role="alert">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> {errors.eventDate}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="guestCount" className="block text-sm font-semibold text-slate-200 mb-1">
            Expected Guests{' '}
            <span className="text-rose-400" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="guestCount"
            type="number"
            min="1"
            max="10000"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.guestCount && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1" role="alert">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> {errors.guestCount}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="budgetAmount" className="block text-sm font-semibold text-slate-200 mb-1">
            Total Budget{' '}
            <span className="text-rose-400" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id="budgetAmount"
            type="number"
            min="0"
            step="10"
            value={budgetAmountMajor}
            onChange={(e) => setBudgetAmountMajor(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          {errors.budgetAmount && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1" role="alert">
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" /> {errors.budgetAmount}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="currencyCode" className="block text-sm font-semibold text-slate-200 mb-1">
            Currency
          </label>
          <select
            id="currencyCode"
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="urgency" className="block text-sm font-semibold text-slate-200 mb-1">
          Planning Urgency
        </label>
        <select
          id="urgency"
          value={planningUrgency}
          onChange={(e) => setPlanningUrgency(e.target.value as PlanningUrgency)}
          className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        >
          <option value="relaxed">Relaxed (Plenty of lead time)</option>
          <option value="normal">Normal pace</option>
          <option value="urgent">Urgent (Upcoming soon)</option>
          <option value="last-minute">Last-minute sprint</option>
        </select>
      </div>
    </section>
  )
}
