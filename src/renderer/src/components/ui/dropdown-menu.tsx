import type { ComponentProps, ReactNode } from 'react'
import { Menu as MenuPrimitive } from '@base-ui/react/menu'
import { cn } from '@/lib/utils'

const DropdownMenu = MenuPrimitive.Root
const DropdownMenuTrigger = MenuPrimitive.Trigger

interface DropdownMenuContentProps {
  children: ReactNode
  className?: string
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

function DropdownMenuContent({
  children,
  className,
  side = 'bottom',
  align = 'end',
  sideOffset = 6
}: DropdownMenuContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset} className="z-50 outline-none">
        <MenuPrimitive.Popup
          className={cn(
            'min-w-52 rounded-lg border bg-popover p-1 text-popover-foreground shadow-xl shadow-black/40 outline-none',
            'origin-[var(--transform-origin)] transition-[opacity,transform] duration-100 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
            className
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

type DropdownMenuItemProps = Omit<ComponentProps<typeof MenuPrimitive.Item>, 'className'> & {
  className?: string
  destructive?: boolean
}

function DropdownMenuItem({ className, destructive, ...props }: DropdownMenuItemProps) {
  return (
    <MenuPrimitive.Item
      className={cn(
        "flex h-8 cursor-default items-center gap-2 rounded-md px-2 text-[13px] outline-none select-none data-[highlighted]:bg-accent data-[disabled]:opacity-40 [&_svg]:size-4 [&_svg]:text-muted-foreground",
        destructive && 'text-destructive [&_svg]:text-destructive',
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({ className }: { className?: string }) {
  return <MenuPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} />
}

function DropdownMenuLabel({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-2 py-1.5 text-[11px] font-medium text-muted-foreground', className)} {...props} />
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('ml-auto font-mono text-[11px] text-muted-foreground', className)} {...props} />
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut
}
