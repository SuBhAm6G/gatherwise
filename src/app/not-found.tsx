import Link from 'next/link'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070814] text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl text-center space-y-6">
        <div className="w-14 h-14 mx-auto rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <Compass className="w-7 h-7" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-wider uppercase text-violet-400">
            404 Error
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">Plan Page Not Found</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The event plan or page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-600/25 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Return to Workspace</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
