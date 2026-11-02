import { join } from 'node:path'
import { BrowserWindow, shell } from 'electron'

export const TITLEBAR_HEIGHT = 40
const BACKGROUND = '#131313'

export function createMainWindow(): BrowserWindow {
  const isMac = process.platform === 'darwin'

  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 560,
    show: false,
    backgroundColor: BACKGROUND,
    title: 'Electron Browser Builtin',
    titleBarStyle: 'hidden',
    ...(isMac
      ? { trafficLightPosition: { x: 14, y: 13 } }
      : { titleBarOverlay: { color: BACKGROUND, symbolColor: '#a3a3a3', height: TITLEBAR_HEIGHT } }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  win.removeMenu()
  win.once('ready-to-show', () => win.show())

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url)
    return { action: 'deny' }
  })
  win.webContents.on('will-navigate', (event) => event.preventDefault())

  const devUrl = process.env['ELECTRON_RENDERER_URL']
  if (devUrl) win.loadURL(devUrl)
  else win.loadFile(join(__dirname, '../renderer/index.html'))

  return win
}
