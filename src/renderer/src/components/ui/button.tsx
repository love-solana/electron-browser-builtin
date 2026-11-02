import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        brand: 'bg-brand text-brand-foreground hover:bg-brand/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-accent',
        outline: 'border bg-transparent hover:bg-accent hover:text-accent-foreground',
        ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[popup-open]:bg-accent',
        link: 'text-brand underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-8 px-3 text-[13px]',
        sm: 'h-7 px-2.5 text-xs',
        lg: 'h-9 px-4',
        icon: 'size-8',
        'icon-sm': 'size-7',
        'icon-xs': "size-5 rounded [&_svg:not([class*='size-'])]:size-3.5"
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
)

type ButtonProps = Omit<ButtonPrimitive.Props, 'className'> &
  VariantProps<typeof buttonVariants> & { className?: string }

function Button({ className, variant, size, ...props }: ButtonProps) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button, buttonVariants }
