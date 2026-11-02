import { create } from 'zustand'
import type { BrowserState, BrowserTabState } from '@shared/ipc'

export type ToolKind = 'files' | 'terminal' | 'changes'
export type WorkspaceTabKind = 'browser' | ToolKind

export interface WorkspaceTab {
  id: string
  kind: WorkspaceTabKind
}

interface WorkspaceStore {
  tabs: WorkspaceTab[]
  activeId: string | null
  browser: BrowserState
  overlays: number
  freezing: boolean
  snapshot: string | null
  addressFocusToken: number

  applyBrowserState(state: BrowserState): void
  newTab(input?: string): Promise<void>
  openTool(kind: ToolKind, replaceId?: string): void
  activate(id: string | null): void
  closeTab(id: string): void
  focusAddress(): void
  pushOverlay(): Promise<void>
  popOverlay(): void
}

const api = () => window.desktop.browser
let toolCounter = 0

export const useWorkspace = create<WorkspaceStore>((set, get) => ({
  tabs: [],
  activeId: null,
  browser: { tabs: [], activeId: null },
  overlays: 0,
  freezing: false,
  snapshot: null,
  addressFocusToken: 0,

  applyBrowserState(state) {
    const prev = get()
    const ids = new Set(state.tabs.map((t) => t.id))
    const tabs = prev.tabs.filter((t) => t.kind !== 'browser' || ids.has(t.id))
    for (const t of state.tabs) {
      if (!tabs.some((x) => x.id === t.id)) tabs.push({ id: t.id, kind: 'browser' })
    }

    let activeId = prev.activeId
    if (state.activeId && state.activeId !== prev.browser.activeId) activeId = state.activeId
    if (activeId && !tabs.some((t) => t.id === activeId)) activeId = tabs.at(-1)?.id ?? null

    set({ browser: state, tabs, activeId })
  },

  async newTab(input) {
    const id = await api().create(input)
    get().activate(id)
    get().focusAddress()
  },

  openTool(kind, replaceId) {
    const id = `${kind}-${++toolCounter}`
    const { tabs } = get()
    const replaced = replaceId ? tabs.find((t) => t.id === replaceId) : undefined
    const next = replaced
      ? tabs.map((t) => (t.id === replaceId ? { id, kind } : t))
      : [...tabs, { id, kind }]
    set({ tabs: next })
    if (replaced?.kind === 'browser') api().close(replaced.id)
    get().activate(id)
  },

  activate(id) {
    const tab = get().tabs.find((t) => t.id === id)
    set({ activeId: tab ? tab.id : null })
    api().activate(tab?.kind === 'browser' ? tab.id : null)
  },

  closeTab(id) {
    const { tabs, activeId } = get()
    const index = tabs.findIndex((t) => t.id === id)
    if (index === -1) return
    const closing = tabs[index]
    const rest = tabs.filter((t) => t.id !== id)
    const next = activeId === id ? (rest[index] ?? rest[index - 1] ?? null) : rest.find((t) => t.id === activeId)
    set({ tabs: rest })
    if (closing.kind === 'browser') api().close(id)
    get().activate(next?.id ?? null)
  },

  focusAddress() {
    set((s) => ({ addressFocusToken: s.addressFocusToken + 1 }))
  },

  async pushOverlay() {
    const overlays = get().overlays + 1
    set({ overlays, freezing: overlays === 1 })
    if (overlays !== 1) return

    const tab = activeBrowserTab(get())
    const snapshot = tab?.url ? await api().capture(tab.id).catch(() => null) : null
    if (get().overlays > 0) set({ snapshot, freezing: false })
    else set({ freezing: false })
  },

  popOverlay() {
    const overlays = Math.max(0, get().overlays - 1)
    set({ overlays })
    if (overlays === 0) {
      setTimeout(() => {
        if (get().overlays === 0) set({ snapshot: null })
      }, 120)
    }
  }
}))

export function activeBrowserTab(state: Pick<WorkspaceStore, 'activeId' | 'tabs' | 'browser'>): BrowserTabState | null {
  const tab = state.tabs.find((t) => t.id === state.activeId)
  if (!tab || tab.kind !== 'browser') return null
  return state.browser.tabs.find((t) => t.id === tab.id) ?? null
}

export function useActiveBrowserTab(): BrowserTabState | null {
  return useWorkspace((s) => activeBrowserTab(s))
}
