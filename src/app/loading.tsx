export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-screen bg-[#070814] flex flex-col items-center justify-center p-6 space-y-4"
    >
      <div className="w-10 h-10 border-3 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-sm font-medium text-slate-400 animate-pulse">Loading event workspace...</p>
      <span className="sr-only">Loading...</span>
    </div>
  )
}
