import type { BrowserWindow, Input, WebContents } from 'electron'
import { IPC, type Shortcut } from '@shared/ipc'

function match(input: Input): Shortcut | null {
  const ctrl = input.control || input.meta
  const key = input.key.toLowerCase()
  if (ctrl && !input.shift && key === 'l') return 'focus-address'
  if (ctrl && !input.shift && key === 't') return 'new-tab'
  if (ctrl && !input.shift && key === 'w') return 'close-tab'
  if ((ctrl && !input.shift && key === 'r') || key === 'f5') return 'reload'
  if (input.alt && key === 'arrowleft') return 'back'
  if (input.alt && key === 'arrowright') return 'forward'
  if (key === 'f12') return 'devtools'
  return null
}

export function attachShortcuts(source: WebContents, win: BrowserWindow): void {
  source.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return

    if ((input.control || input.meta) && input.shift && input.key.toLowerCase() === 'i') {
      event.preventDefault()
      win.webContents.toggleDevTools()
      return
    }

    const shortcut = match(input)
    if (!shortcut) return
    event.preventDefault()
    if (!win.isDestroyed()) win.webContents.send(IPC.app.shortcut, shortcut)
  })
}
