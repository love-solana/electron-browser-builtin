import { useState, type ReactNode } from 'react'
import { ArrowUp, ChevronDown, FolderOpen, GitBranch, Laptop, Mic, Plus, ShieldCheck, Sparkles, SquareTerminal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Hint } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const MODELS = ['Auto', 'Claude Sonnet', 'GPT', 'Gemini']

function Chip({ icon: Icon, children }: { icon: typeof Laptop; children: ReactNode }) {
  return (
    <button className="flex h-6 items-center gap-1.5 rounded-md px-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
      <Icon className="size-3.5" />
      {children}
    </button>
  )
}

function Composer() {
  const [value, setValue] = useState('')
  const [model, setModel] = useState(MODELS[0])
  const [autoApprove, setAutoApprove] = useState(false)

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-4">
      <div className="flex items-center gap-1 px-1 pb-1.5">
        <Chip icon={FolderOpen}>electron-browser-builtin</Chip>
        <Chip icon={Laptop}>Local</Chip>
        <Chip icon={GitBranch}>master</Chip>
        <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          <SquareTerminal className="size-3.5" /> Windows
          <span className="size-1.5 rounded-full bg-emerald-400" />
        </span>
      </div>

      <div className="rounded-2xl border bg-card shadow-lg shadow-black/20 transition-colors focus-within:border-ring">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={2}
          placeholder="Do anything"
          className="block max-h-60 min-h-14 w-full resize-none bg-transparent px-4 pt-3 text-[13px] outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-1 px-2 pb-2">
          <Hint label="Attach">
            <Button variant="ghost" size="icon-sm" aria-label="Attach">
              <Plus />
            </Button>
          </Hint>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoApprove((v) => !v)}
            className={cn(autoApprove && 'text-emerald-400 hover:text-emerald-300')}
          >
            <ShieldCheck /> Approve for me
          </Button>

          <div className="ml-auto flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" />}>
                <Sparkles /> {model} <ChevronDown className="size-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end">
                <DropdownMenuLabel>Model</DropdownMenuLabel>
                {MODELS.map((m) => (
                  <DropdownMenuItem key={m} onClick={() => setModel(m)}>
                    <Sparkles /> {m}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Hint label="Dictate">
              <Button variant="ghost" size="icon-sm" aria-label="Dictate">
                <Mic />
              </Button>
            </Hint>
            <Button variant="brand" size="icon-sm" className="rounded-full" disabled={!value.trim()} aria-label="Send">
              <ArrowUp />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ChatPanel() {
  return (
    <section className="flex h-full min-w-0 flex-col bg-panel">
      <header className="drag flex h-10 shrink-0 items-center border-b px-4">
        <span className="text-[13px] font-medium">Chat</span>
        <Button variant="ghost" size="sm" className="no-drag ml-auto text-brand hover:text-brand">
          <Sparkles /> Get Plus
        </Button>
      </header>

      <div className="grid min-h-0 flex-1 place-items-center px-6">
        <div className="flex flex-col items-center gap-5 text-center">
          <span className="grid size-12 place-items-center rounded-2xl border bg-muted/60 shadow-inner">
            <SquareTerminal className="size-5 text-muted-foreground" />
          </span>
          <h1 className="text-xl font-medium tracking-tight text-balance">
            What should we work on in <span className="underline decoration-muted-foreground/40 underline-offset-4">electron-browser-builtin</span>?
          </h1>
        </div>
      </div>

      <Composer />
    </section>
  )
}
