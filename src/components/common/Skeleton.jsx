import { cn } from '../../utils/cn'

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-2xl', className)}
      style={{ background: 'var(--bg-elevated)' }}
      {...props}
    />
  )
}
