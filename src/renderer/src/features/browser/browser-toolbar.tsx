import { ArrowLeft, ArrowRight, RotateCw, X } from 'lucide-react'
import type { BrowserTabState } from '@shared/ipc'
import { Button } from '@/components/ui/button'
import { Hint } from '@/components/ui/tooltip'
import { AddressBar } from './address-bar'
import { BrowserMenu } from './browser-menu'

export function BrowserToolbar({ tab }: { tab: BrowserTabState }) {
  const api = window.desktop.browser

  return (
    <div className="relative flex h-11 shrink-0 items-center gap-1 border-b px-2">
      <Hint label="Back" shortcut="Alt ←">
        <Button variant="ghost" size="icon-sm" disabled={!tab.canGoBack} onClick={() => api.back(tab.id)}>
          <ArrowLeft />
        </Button>
      </Hint>
      <Hint label="Forward" shortcut="Alt →">
        <Button variant="ghost" size="icon-sm" disabled={!tab.canGoForward} onClick={() => api.forward(tab.id)}>
          <ArrowRight />
        </Button>
      </Hint>
      {tab.loading ? (
        <Hint label="Stop">
          <Button variant="ghost" size="icon-sm" onClick={() => api.stop(tab.id)}>
            <X />
          </Button>
        </Hint>
      ) : (
        <Hint label="Reload" shortcut="Ctrl R">
          <Button variant="ghost" size="icon-sm" disabled={!tab.url} onClick={() => api.reload(tab.id)}>
            <RotateCw />
          </Button>
        </Hint>
      )}

      <div className="mx-1 flex min-w-0 flex-1">
        <AddressBar tab={tab} />
      </div>

      <BrowserMenu tab={tab} />

      {tab.loading && (
        <div className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden">
          <div className="h-full w-1/4 bg-brand animate-[progress-indeterminate_1.1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  )
}
