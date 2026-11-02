import { randomUUID } from 'node:crypto'
import { BrowserWindow, WebContentsView, session, type Session, type WebContents } from 'electron'
import { IPC, type BrowserState, type BrowserTabState, type Fingerprint, type Viewport } from '@shared/ipc'
import { toNavigableUrl } from './url'
import { attachShortcuts } from '../shortcuts'

const PARTITION = 'persist:browser'
const ALLOWED_PERMISSIONS = new Set(['clipboard-sanitized-write', 'fullscreen', 'pointerLock'])

interface Tab {
  view: WebContentsView
  state: BrowserTabState
}

let configuredSession: Session | null = null

function browserSession(): Session {
  if (configuredSession) return configuredSession
  const ses = session.fromPartition(PARTITION)
  ses.setUserAgent(ses.getUserAgent().replace(/ (Electron|electron-browser-builtin)\/\S+/g, ''))
  ses.setPermissionRequestHandler((_wc, permission, callback) => {
    callback(ALLOWED_PERMISSIONS.has(permission))
  })
  configuredSession = ses
  return ses
}

export class BrowserManager {
  private readonly tabs = new Map<string, Tab>()
  private activeId: string | null = null
  private attachedId: string | null = null
  private viewport: Viewport = { rect: null, visible: false }

  constructor(private readonly win: BrowserWindow) {
    win.on('closed', () => this.destroyAll())
  }

  create(input?: string): string {
    const id = randomUUID()
    const view = new WebContentsView({
      webPreferences: {
        session: browserSession(),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true
      }
    })
    view.setBackgroundColor('#00000000')

    const tab: Tab = {
      view,
      state: {
        id,
        url: '',
        title: 'New tab',
        favicon: null,
        loading: false,
        canGoBack: false,
        canGoForward: false,
        error: null
      }
    }
    this.tabs.set(id, tab)
    this.wire(tab)
    this.activeId = id

    if (input) this.navigate(id, input)
    else this.sync()
    return id
  }

  close(id: string): void {
    const tab = this.tabs.get(id)
    if (!tab) return
    if (this.attachedId === id) this.detach()
    this.tabs.delete(id)
    tab.view.webContents.close()
    if (this.activeId === id) this.activeId = null
    this.sync()
  }

  activate(id: string | null): void {
    if (id !== null && !this.tabs.has(id)) return
    this.activeId = id
    this.sync()
  }

  navigate(id: string, input: string): void {
    const tab = this.tabs.get(id)
    const url = toNavigableUrl(input)
    if (!tab || !url) return
    tab.state.url = url
    tab.state.error = null
    tab.view.webContents.loadURL(url).catch(() => {})
    this.sync()
  }

  back(id: string): void {
    this.withContents(id, (wc) => wc.navigationHistory.canGoBack() && wc.navigationHistory.goBack())
  }

  forward(id: string): void {
    this.withContents(id, (wc) => wc.navigationHistory.canGoForward() && wc.navigationHistory.goForward())
  }

  reload(id: string): void {
    this.withContents(id, (wc) => wc.reload())
  }

  stop(id: string): void {
    this.withContents(id, (wc) => wc.stop())
  }

  openDevTools(id: string): void {
    this.withContents(id, (wc) => wc.openDevTools({ mode: 'detach' }))
  }

  setViewport(viewport: Viewport): void {
    this.viewport = viewport
    this.sync()
  }

  async capture(id: string): Promise<string | null> {
    const tab = this.tabs.get(id)
    if (!tab || this.attachedId !== id) return null
    const image = await tab.view.webContents.capturePage()
    return image.isEmpty() ? null : image.toDataURL()
  }

  async fingerprint(id: string): Promise<Fingerprint | null> {
    const tab = this.tabs.get(id)
    if (!tab || !tab.state.url) return null
    return tab.view.webContents.executeJavaScript(`(() => ({
      userAgent: navigator.userAgent,
      webdriver: navigator.webdriver,
      brands: navigator.userAgentData ? navigator.userAgentData.brands.map(b => b.brand + ' ' + b.version) : null,
      languages: navigator.languages,
      plugins: navigator.plugins.length,
      webgl: (() => {
        try {
          const gl = document.createElement('canvas').getContext('webgl')
          const ext = gl.getExtension('WEBGL_debug_renderer_info')
          return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)
        } catch { return null }
      })()
    }))()`)
  }

  snapshot(): BrowserState {
    return {
      tabs: [...this.tabs.values()].map((t) => ({ ...t.state })),
      activeId: this.activeId
    }
  }

  private wire(tab: Tab): void {
    const wc = tab.view.webContents
    const { state } = tab
    const refresh = (): void => {
      state.url = wc.getURL() || state.url
      state.title = wc.getTitle() || state.url || 'New tab'
      state.loading = wc.isLoading()
      state.canGoBack = wc.navigationHistory.canGoBack()
      state.canGoForward = wc.navigationHistory.canGoForward()
      this.emit()
    }

    wc.setWindowOpenHandler(({ url }) => {
      this.create(url)
      return { action: 'deny' }
    })
    wc.on('did-start-loading', () => {
      state.error = null
      refresh()
    })
    wc.on('did-stop-loading', refresh)
    wc.on('did-navigate', refresh)
    wc.on('did-navigate-in-page', refresh)
    wc.on('page-title-updated', refresh)
    wc.on('page-favicon-updated', (_e, favicons) => {
      state.favicon = favicons[0] ?? null
      this.emit()
    })
    wc.on('did-fail-load', (_e, code, description, url, isMainFrame) => {
      if (!isMainFrame || code === -3) return
      state.error = `${description} (${code}) ${url}`
      refresh()
    })
    wc.on('render-process-gone', (_e, details) => {
      state.error = `Page crashed: ${details.reason}`
      refresh()
    })
    attachShortcuts(wc, this.win)
  }

  private sync(): void {
    const tab = this.activeId ? this.tabs.get(this.activeId) : undefined
    const { rect, visible } = this.viewport

    if (!tab || !tab.state.url || !visible || !rect || rect.width <= 0 || rect.height <= 0) {
      this.detach()
    } else {
      if (this.attachedId !== tab.state.id) {
        this.detach()
        this.win.contentView.addChildView(tab.view)
        this.attachedId = tab.state.id
      }
      tab.view.setBounds(rect)
    }
    this.emit()
  }

  private detach(): void {
    if (!this.attachedId) return
    const tab = this.tabs.get(this.attachedId)
    if (tab && !this.win.isDestroyed()) this.win.contentView.removeChildView(tab.view)
    this.attachedId = null
  }

  private withContents(id: string, fn: (wc: WebContents) => unknown): void {
    const tab = this.tabs.get(id)
    if (tab && !tab.view.webContents.isDestroyed()) fn(tab.view.webContents)
  }

  private emit(): void {
    if (this.win.isDestroyed()) return
    this.win.webContents.send(IPC.browser.state, this.snapshot())
  }

  private destroyAll(): void {
    for (const tab of this.tabs.values()) {
      if (!tab.view.webContents.isDestroyed()) tab.view.webContents.close()
    }
    this.tabs.clear()
    this.attachedId = null
  }
}
