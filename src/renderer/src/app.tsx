import { useEffect } from 'react'
import { ActivityRail } from '@/components/layout/activity-rail'
import { SplitPane } from '@/components/layout/split-pane'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ChatPanel } from '@/features/chat/chat-panel'
import { activeBrowserTab, useWorkspace } from '@/features/workspace/store'
import { WorkspacePanel } from '@/features/workspace/workspace-panel'

let booted = false

function useDesktopBindings(): void {
  useEffect(() => {
    const { browser, onShortcut } = window.desktop
    const store = useWorkspace.getState

    const offState = browser.onState((state) => store().applyBrowserState(state))
    browser.getState().then((state) => {
      store().applyBrowserState(state)
      if (!booted && state.tabs.length === 0) store().newTab()
      booted = true
    })

    const offShortcut = onShortcut((shortcut) => {
      const s = store()
      const tab = activeBrowserTab(s)
      switch (shortcut) {
        case 'new-tab':
          return s.newTab()
        case 'close-tab':
          return s.activeId && s.closeTab(s.activeId)
        case 'focus-address':
          return tab ? s.focusAddress() : s.newTab()
        case 'reload':
          return tab?.url && browser.reload(tab.id)
        case 'back':
          return tab && browser.back(tab.id)
        case 'forward':
          return tab && browser.forward(tab.id)
        case 'devtools':
          return tab?.url && browser.openDevTools(tab.id)
      }
    })

    return () => {
      offState()
      offShortcut()
    }
  }, [])
}

export function App() {
  useDesktopBindings()

  return (
    <TooltipProvider delay={400}>
      <div className="flex h-full">
        <ActivityRail />
        <SplitPane storageKey="layout:split" defaultRatio={0.46} left={<ChatPanel />} right={<WorkspacePanel />} />
      </div>
    </TooltipProvider>
  )
}
