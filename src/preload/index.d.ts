import type { BrowserState, Fingerprint, Shortcut, Viewport } from '../shared/ipc'

export interface DesktopApi {
  platform: string
  browser: {
    create(input?: string): Promise<string>
    close(id: string): Promise<void>
    activate(id: string | null): Promise<void>
    navigate(id: string, input: string): Promise<void>
    back(id: string): Promise<void>
    forward(id: string): Promise<void>
    reload(id: string): Promise<void>
    stop(id: string): Promise<void>
    openDevTools(id: string): Promise<void>
    capture(id: string): Promise<string | null>
    fingerprint(id: string): Promise<Fingerprint | null>
    setViewport(viewport: Viewport): Promise<void>
    getState(): Promise<BrowserState>
    onState(callback: (state: BrowserState) => void): () => void
  }
  onShortcut(callback: (shortcut: Shortcut) => void): () => void
}

declare global {
  interface Window {
    desktop: DesktopApi
  }
}
