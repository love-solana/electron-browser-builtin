import { Globe, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { BrowserPanel } from '@/features/browser/browser-panel'
import { useActiveBrowserTab, useWorkspace } from './store'
import { TabStrip } from './tab-strip'
import { ToolPlaceholder } from './tool-placeholder'

function EmptyWorkspace() {
  const newTab = useWorkspace((s) => s.newTab)
  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border bg-muted/60">
          <Globe className="size-5 text-muted-foreground" />
        </span>
        <p className="text-xs text-muted-foreground">No tabs open</p>
        <Button variant="secondary" size="sm" onClick={() => newTab()}>
          <Plus /> New tab <Kbd>Ctrl T</Kbd>
        </Button>
      </div>
    </div>
  )
}

export function WorkspacePanel() {
  const active = useWorkspace((s) => s.tabs.find((t) => t.id === s.activeId))
  const browserTab = useActiveBrowserTab()

  return (
    <section className="flex h-full min-w-0 flex-col bg-panel">
      <TabStrip />
      {!active ? (
        <EmptyWorkspace />
      ) : active.kind === 'browser' ? (
        browserTab && <BrowserPanel tab={browserTab} />
      ) : (
        <ToolPlaceholder kind={active.kind} />
      )}
    </section>
  )
}
