import { cn } from '../../utils/cn'

export function OptionSelector({ label, options, value, onChange, disabledValues = [] }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-bold uppercase tracking-widest px-1 theme-text-muted">
        {label}
      </h3>
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-1 px-1">
        {options.map((opt) => {
          const isDisabled = disabledValues.includes(opt.value)
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => !isDisabled && onChange(opt.value)}
              disabled={isDisabled}
              title={isDisabled ? 'Not compatible with current selection' : undefined}
              className={cn(
                'whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95 border',
                isDisabled
                  ? 'opacity-30 cursor-not-allowed theme-card theme-border theme-text-sec'
                  : isSelected
                    ? 'bg-gradient-to-r from-brand-dark to-brand text-white shadow-md shadow-brand/25 border-transparent'
                    : 'theme-card theme-border theme-text-sec hover:opacity-80'
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
