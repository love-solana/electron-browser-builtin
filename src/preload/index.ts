import { contextBridge, ipcRenderer, type IpcRendererEvent } from 'electron'
import { IPC, type BrowserState, type Fingerprint, type Shortcut, type Viewport } from '@shared/ipc'

function subscribe<T>(channel: string, callback: (payload: T) => void): () => void {
  const listener = (_event: IpcRendererEvent, payload: T): void => callback(payload)
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeListener(channel, listener)
}

const api = {
  platform: process.platform,
  browser: {
    create: (input?: string): Promise<string> => ipcRenderer.invoke(IPC.browser.create, input),
    close: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.close, id),
    activate: (id: string | null): Promise<void> => ipcRenderer.invoke(IPC.browser.activate, id),
    navigate: (id: string, input: string): Promise<void> =>
      ipcRenderer.invoke(IPC.browser.navigate, id, input),
    back: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.back, id),
    forward: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.forward, id),
    reload: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.reload, id),
    stop: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.stop, id),
    openDevTools: (id: string): Promise<void> => ipcRenderer.invoke(IPC.browser.openDevTools, id),
    capture: (id: string): Promise<string | null> => ipcRenderer.invoke(IPC.browser.capture, id),
    fingerprint: (id: string): Promise<Fingerprint | null> =>
      ipcRenderer.invoke(IPC.browser.fingerprint, id),
    setViewport: (viewport: Viewport): Promise<void> =>
      ipcRenderer.invoke(IPC.browser.setViewport, viewport),
    getState: (): Promise<BrowserState> => ipcRenderer.invoke(IPC.browser.state),
    onState: (callback: (state: BrowserState) => void) => subscribe(IPC.browser.state, callback)
  },
  onShortcut: (callback: (shortcut: Shortcut) => void) => subscribe(IPC.app.shortcut, callback)
}

contextBridge.exposeInMainWorld('desktop', api)
