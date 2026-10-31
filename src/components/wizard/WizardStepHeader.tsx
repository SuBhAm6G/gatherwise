'use client'

interface WizardStepHeaderProps {
  step: number
  onCancel?: () => void
}

export function WizardStepHeader({ step, onCancel }: WizardStepHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Create New Event Plan</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure your event context for automated budget allocation and timeline milestones.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel event plan creation"
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div
        className="flex items-center gap-2"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={4}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            aria-current={step === i ? 'step' : undefined}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              i < step
                ? 'bg-indigo-500'
                : i === step
                  ? 'bg-gradient-to-r from-indigo-500 to-pink-500'
                  : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div
        className="flex justify-between text-xs text-slate-400 mt-2 font-medium"
        aria-hidden="true"
      >
        <span className={step >= 1 ? 'text-indigo-400' : ''}>1. Event Type</span>
        <span className={step >= 2 ? 'text-indigo-400' : ''}>2. Date & Budget</span>
        <span className={step >= 3 ? 'text-indigo-400' : ''}>3. Style & Context</span>
        <span className={step >= 4 ? 'text-indigo-400' : ''}>4. Review</span>
      </div>
    </header>
  )
}
