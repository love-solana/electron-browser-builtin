import { Folder, GitCompare, Globe, LoaderCircle, Plus, SquareTerminal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hint } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useWorkspace, type WorkspaceTab } from './store'

const TOOL_META = {
  files: { title: 'Files', icon: Folder },
  terminal: { title: 'Terminal', icon: SquareTerminal },
  changes: { title: 'Changes', icon: GitCompare }
} as const

function TabLabel({ tab }: { tab: WorkspaceTab }) {
  const browserTab = useWorkspace((s) => s.browser.tabs.find((t) => t.id === tab.id))

  if (tab.kind !== 'browser') {
    const { title, icon: Icon } = TOOL_META[tab.kind]
    return (
      <>
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate">{title}</span>
      </>
    )
  }

  return (
    <>
      {browserTab?.loading ? (
        <LoaderCircle className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
      ) : browserTab?.favicon ? (
        <img src={browserTab.favicon} alt="" className="size-3.5 shrink-0 rounded-sm" />
      ) : (
        <Globe className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span className="truncate">{browserTab?.title || 'New tab'}</span>
    </>
  )
}

export function TabStrip() {
  const tabs = useWorkspace((s) => s.tabs)
  const activeId = useWorkspace((s) => s.activeId)
  const activate = useWorkspace((s) => s.activate)
  const closeTab = useWorkspace((s) => s.closeTab)
  const newTab = useWorkspace((s) => s.newTab)

  return (
    <div className="drag titlebar-inset-right flex h-10 shrink-0 items-center gap-1 border-b bg-background pl-2">
      <div className="no-drag flex min-w-0 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
        {tabs.map((tab) => {
          const active = tab.id === activeId
          return (
            <div
              key={tab.id}
              role="tab"
              aria-selected={active}
              onMouseDown={(e) => {
                if (e.button === 1) {
                  e.preventDefault()
                  closeTab(tab.id)
                } else if (e.button === 0) activate(tab.id)
              }}
              className={cn(
                'group flex h-7 w-44 min-w-24 shrink items-center gap-2 rounded-md px-2 text-xs transition-colors',
                active ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <TabLabel tab={tab} />
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Close tab"
                className={cn('ml-auto opacity-0 group-hover:opacity-100', active && 'opacity-70')}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => closeTab(tab.id)}
              >
                <X />
              </Button>
            </div>
          )
        })}
      </div>
      <Hint label="New tab" shortcut="Ctrl T" side="bottom">
        <Button variant="ghost" size="icon-sm" className="no-drag" aria-label="New tab" onClick={() => newTab()}>
          <Plus />
        </Button>
      </Hint>
    </div>
  )
}
