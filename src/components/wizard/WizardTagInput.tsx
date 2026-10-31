'use client'

interface WizardTagInputProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (val: string) => void
  tags: string[]
  onAdd: () => void
  onRemove: (idx: number) => void
  colorScheme?: 'indigo' | 'amber' | 'purple' | 'rose'
}

export function WizardTagInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  tags,
  onAdd,
  onRemove,
  colorScheme = 'indigo',
}: WizardTagInputProps) {
  const badgeClasses = {
    indigo: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    rose: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  }[colorScheme]

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-200 mb-1">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              onAdd()
            }
          }}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Add ${label} tag`}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-white/10"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border ${badgeClasses}`}
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                aria-label={`Remove tag: ${tag}`}
                className="hover:text-white font-bold ml-1 text-slate-400"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
