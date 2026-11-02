export const IPC = {
  browser: {
    create: 'browser:create',
    close: 'browser:close',
    activate: 'browser:activate',
    navigate: 'browser:navigate',
    back: 'browser:back',
    forward: 'browser:forward',
    reload: 'browser:reload',
    stop: 'browser:stop',
    setViewport: 'browser:set-viewport',
    capture: 'browser:capture',
    openDevTools: 'browser:open-devtools',
    fingerprint: 'browser:fingerprint',
    state: 'browser:state'
  },
  app: {
    shortcut: 'app:shortcut'
  }
} as const

export interface BrowserTabState {
  id: string
  url: string
  title: string
  favicon: string | null
  loading: boolean
  canGoBack: boolean
  canGoForward: boolean
  error: string | null
}

export interface BrowserState {
  tabs: BrowserTabState[]
  activeId: string | null
}

export interface ViewportRect {
  x: number
  y: number
  width: number
  height: number
}

export interface Viewport {
  rect: ViewportRect | null
  visible: boolean
}

export type Shortcut =
  | 'focus-address'
  | 'new-tab'
  | 'close-tab'
  | 'reload'
  | 'back'
  | 'forward'
  | 'devtools'

export interface Fingerprint {
  userAgent: string
  webdriver: boolean
  brands: string[] | null
  languages: readonly string[]
  plugins: number
  webgl: string | null
}
