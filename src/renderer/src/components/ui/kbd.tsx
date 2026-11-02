import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-[18px] min-w-[18px] items-center justify-center rounded border bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
