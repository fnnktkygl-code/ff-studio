import { cn } from '../../utils/cn'

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  disabled = false,
  onClick,
  className,
  ...props
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all active:scale-95',
        {
          'bg-gradient-to-r from-brand-dark to-brand text-white shadow-lg shadow-brand-dark/25 hover:shadow-brand-dark/40': variant === 'primary',
          'bg-surface-elevated text-slate-200 hover:bg-surface-light': variant === 'secondary',
          'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200': variant === 'ghost',
          'bg-red-500/10 text-red-400 hover:bg-red-500/20': variant === 'danger',
        },
        {
          'h-14 px-8 text-base': size === 'lg',
          'h-11 px-6 text-sm': size === 'md',
          'h-9 px-4 text-xs': size === 'sm',
        },
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
