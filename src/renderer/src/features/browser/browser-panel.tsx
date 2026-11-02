import { TriangleAlert } from 'lucide-react'
import type { BrowserTabState } from '@shared/ipc'
import { BrowserToolbar } from './browser-toolbar'
import { BrowserViewport } from './browser-viewport'
import { NewTabPage } from './new-tab-page'

export function BrowserPanel({ tab }: { tab: BrowserTabState }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <BrowserToolbar tab={tab} />
      {tab.error && !tab.loading && (
        <div className="flex items-center gap-2 border-b bg-destructive/10 px-3 py-1.5 text-xs text-destructive">
          <TriangleAlert className="size-3.5 shrink-0" />
          <span className="truncate">{tab.error}</span>
        </div>
      )}
      {tab.url ? <BrowserViewport /> : <NewTabPage tabId={tab.id} />}
    </div>
  )
}
