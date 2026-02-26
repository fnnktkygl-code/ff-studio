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
          'bg-gradient-to-r from-brand-dark to-brand text-white shadow-lg shadow-brand/25 hover:shadow-brand/40': variant === 'primary',
          'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50': variant === 'secondary',
          'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800': variant === 'ghost',
          'bg-red-50 text-red-500 hover:bg-red-100': variant === 'danger',
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
