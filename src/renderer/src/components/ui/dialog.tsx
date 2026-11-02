import type { ComponentProps, ReactNode } from 'react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogClose = DialogPrimitive.Close

function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[min(560px,calc(100vw-48px))] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-5 text-card-foreground shadow-2xl shadow-black/50 outline-none',
          'transition-[opacity,scale] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
          className
        )}
      >
        {children}
        <DialogPrimitive.Close
          render={<Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" aria-label="Close" />}
        >
          <X />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

function DialogTitle({ className, ...props }: Omit<ComponentProps<typeof DialogPrimitive.Title>, 'className'> & { className?: string }) {
  return <DialogPrimitive.Title className={cn('text-sm font-semibold', className)} {...props} />
}

function DialogDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof DialogPrimitive.Description>, 'className'> & { className?: string }) {
  return <DialogPrimitive.Description className={cn('mt-1 text-xs text-muted-foreground', className)} {...props} />
}

export { Dialog, DialogTrigger, DialogClose, DialogContent, DialogTitle, DialogDescription }
