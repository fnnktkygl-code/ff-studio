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
  const variantStyles = {
    secondary: { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' },
    ghost: { color: 'var(--text-muted)' },
    danger: { background: 'rgba(239,68,68,0.1)', color: '#ef4444' },
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold rounded-full transition-all active:scale-95',
        variant === 'primary' && 'bg-gradient-to-r from-brand-dark to-brand text-white shadow-lg shadow-brand/25 hover:shadow-brand/40',
        variant !== 'primary' && 'hover:opacity-80',
        {
          'h-14 px-8 text-base': size === 'lg',
          'h-11 px-6 text-sm': size === 'md',
          'h-9 px-4 text-xs': size === 'sm',
        },
        disabled && 'opacity-40 pointer-events-none',
        className
      )}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  )
}
