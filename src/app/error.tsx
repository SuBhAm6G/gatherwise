'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Error caught by boundary - state maintained cleanly without leakage
  }, [error])

  return (
    <div
      role="alert"
      className="min-h-screen bg-[#070814] text-slate-100 flex items-center justify-center p-4 sm:p-6"
    >
      <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertTriangle className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            GatherWise encountered an unexpected error while updating your event workspace. Your
            saved plan in local storage remains safe.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
