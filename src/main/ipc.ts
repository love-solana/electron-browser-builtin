import { ipcMain, type BrowserWindow, type IpcMainInvokeEvent } from 'electron'
import { IPC, type Viewport } from '@shared/ipc'
import type { BrowserManager } from './browser/browser-manager'

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function isViewport(value: unknown): value is Viewport {
  if (!value || typeof value !== 'object') return false
  const { rect, visible } = value as Viewport
  if (typeof visible !== 'boolean') return false
  if (rect === null) return true
  return ['x', 'y', 'width', 'height'].every((k) => Number.isFinite((rect as never)[k]))
}

export function registerIpc(win: BrowserWindow, browser: BrowserManager): void {
  const handle = (channel: string, fn: (...args: unknown[]) => unknown): void => {
    ipcMain.handle(channel, (event: IpcMainInvokeEvent, ...args: unknown[]) => {
      if (event.sender !== win.webContents) throw new Error('Unauthorized IPC sender')
      return fn(...args)
    })
  }
  const withId = (fn: (id: string) => unknown) => (id: unknown) => {
    if (isString(id)) return fn(id)
    return undefined
  }

  handle(IPC.browser.create, (input) => browser.create(isString(input) ? input : undefined))
  handle(IPC.browser.close, withId((id) => browser.close(id)))
  handle(IPC.browser.activate, (id) => browser.activate(isString(id) ? id : null))
  handle(IPC.browser.navigate, (id, input) => {
    if (isString(id) && isString(input)) browser.navigate(id, input)
  })
  handle(IPC.browser.back, withId((id) => browser.back(id)))
  handle(IPC.browser.forward, withId((id) => browser.forward(id)))
  handle(IPC.browser.reload, withId((id) => browser.reload(id)))
  handle(IPC.browser.stop, withId((id) => browser.stop(id)))
  handle(IPC.browser.openDevTools, withId((id) => browser.openDevTools(id)))
  handle(IPC.browser.capture, withId((id) => browser.capture(id)))
  handle(IPC.browser.fingerprint, withId((id) => browser.fingerprint(id)))
  handle(IPC.browser.setViewport, (viewport) => {
    if (isViewport(viewport)) browser.setViewport(viewport)
  })
  handle(IPC.browser.state, () => browser.snapshot())
}

export function unregisterIpc(): void {
  for (const channel of Object.values(IPC.browser)) ipcMain.removeHandler(channel)
}
