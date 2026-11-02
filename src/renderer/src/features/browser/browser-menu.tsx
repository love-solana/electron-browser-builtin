import { useState } from 'react'
import { Bug, Copy, Ellipsis, ExternalLink, Fingerprint, RotateCw } from 'lucide-react'
import type { BrowserTabState } from '@shared/ipc'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { useOverlay } from '@/features/workspace/use-overlay'
import { FingerprintDialog } from './fingerprint-dialog'

export function BrowserMenu({ tab }: { tab: BrowserTabState }) {
  const [open, setOpen] = useState(false)
  const [fingerprintOpen, setFingerprintOpen] = useState(false)
  const api = window.desktop.browser
  const hasPage = Boolean(tab.url)
  useOverlay(open)

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="More" />}>
          <Ellipsis />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled={!hasPage} onClick={() => api.reload(tab.id)}>
            <RotateCw /> Reload <DropdownMenuShortcut>Ctrl R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!hasPage} onClick={() => navigator.clipboard.writeText(tab.url)}>
            <Copy /> Copy URL
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!hasPage} onClick={() => window.open(tab.url, '_blank')}>
            <ExternalLink /> Open in system browser
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={!hasPage} onClick={() => setFingerprintOpen(true)}>
            <Fingerprint /> Check fingerprint
          </DropdownMenuItem>
          <DropdownMenuItem disabled={!hasPage} onClick={() => api.openDevTools(tab.id)}>
            <Bug /> Developer tools <DropdownMenuShortcut>F12</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <FingerprintDialog tabId={tab.id} open={fingerprintOpen} onOpenChange={setFingerprintOpen} />
    </>
  )
}
