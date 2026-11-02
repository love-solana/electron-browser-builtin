import type { ReactElement, ReactNode } from 'react'
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { cn } from '@/lib/utils'
import { Kbd } from './kbd'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

interface TooltipContentProps {
  children: ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
}

function TooltipContent({ children, className, side = 'top', sideOffset = 6 }: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset} className="z-50">
        <TooltipPrimitive.Popup
          className={cn(
            'flex items-center gap-2 rounded-md border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg shadow-black/30',
            'origin-[var(--transform-origin)] transition-[opacity,transform] duration-100 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            className
          )}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

interface HintProps {
  label: ReactNode
  shortcut?: string
  side?: TooltipContentProps['side']
  children: ReactElement
}

function Hint({ label, shortcut, side, children }: HintProps) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent side={side}>
        {label}
        {shortcut && <Kbd>{shortcut}</Kbd>}
      </TooltipContent>
    </Tooltip>
  )
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Hint }
