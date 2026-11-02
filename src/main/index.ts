import { app, BrowserWindow } from 'electron'
import { createMainWindow } from './window'
import { BrowserManager } from './browser/browser-manager'
import { registerIpc, unregisterIpc } from './ipc'
import { attachShortcuts } from './shortcuts'

if (!app.requestSingleInstanceLock()) app.quit()

let mainWindow: BrowserWindow | null = null

function openMainWindow(): void {
  const win = createMainWindow()
  const browser = new BrowserManager(win)
  registerIpc(win, browser)
  attachShortcuts(win.webContents, win)

  win.on('closed', () => {
    unregisterIpc()
    mainWindow = null
  })
  mainWindow = win
}

app.on('second-instance', () => {
  if (!mainWindow) return
  if (mainWindow.isMinimized()) mainWindow.restore()
  mainWindow.focus()
})

app.whenReady().then(() => {
  app.setAppUserModelId('com.yuser1.electron-browser-builtin')
  openMainWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) openMainWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
