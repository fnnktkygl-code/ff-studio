import { cn } from '../../utils/cn'

export function OptionSelector({ label, options, value, onChange }) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
        {label}
      </h3>
      <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 -mx-1 px-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              'whitespace-nowrap px-4 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 active:scale-95',
              value === opt.value
                ? 'bg-gradient-to-r from-brand-dark to-brand text-white shadow-md shadow-brand-dark/20'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
