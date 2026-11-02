import { Separator as SeparatorPrimitive } from '@base-ui/react/separator'
import { cn } from '@/lib/utils'

function Separator({
  className,
  orientation = 'horizontal'
}: {
  className?: string
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <SeparatorPrimitive
      orientation={orientation}
      className={cn('shrink-0 bg-border', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className)}
    />
  )
}

export { Separator }
