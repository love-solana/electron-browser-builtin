import { useState, type ComponentType } from 'react'
import { Bot, FolderGit2, GitBranch, History, House, LayoutGrid, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hint } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const ITEMS: { id: string; label: string; icon: ComponentType }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'agents', label: 'Agents', icon: Bot },
  { id: 'history', label: 'History', icon: History },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'apps', label: 'Apps', icon: LayoutGrid },
  { id: 'git', label: 'Source control', icon: GitBranch }
]

export function ActivityRail() {
  const [active, setActive] = useState('home')

  return (
    <nav className="flex h-full w-12 shrink-0 flex-col items-center border-r bg-background">
      <div className="drag h-10 w-full shrink-0" />
      <div className="flex flex-col items-center gap-1">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <Hint key={id} label={label} side="right">
            <Button
              variant="ghost"
              size="icon"
              aria-label={label}
              onClick={() => setActive(id)}
              className={cn('relative', active === id && 'bg-accent text-foreground')}
            >
              <Icon />
            </Button>
          </Hint>
        ))}
      </div>
      <div className="mt-auto flex flex-col items-center gap-1 pb-3">
        <Hint label="Settings" side="right">
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings />
          </Button>
        </Hint>
        <span className="mt-1 grid size-7 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 text-[11px] font-semibold text-white">
          Y
        </span>
      </div>
    </nav>
  )
}
