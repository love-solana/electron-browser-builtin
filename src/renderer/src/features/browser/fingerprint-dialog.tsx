import { useEffect, useState } from 'react'
import { CircleCheck, CircleAlert } from 'lucide-react'
import type { Fingerprint } from '@shared/ipc'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { useOverlay } from '@/features/workspace/use-overlay'

interface FingerprintDialogProps {
  tabId: string
  open: boolean
  onOpenChange(open: boolean): void
}

export function FingerprintDialog({ tabId, open, onOpenChange }: FingerprintDialogProps) {
  const [data, setData] = useState<Fingerprint | null>(null)
  useOverlay(open)

  useEffect(() => {
    if (!open) return
    setData(null)
    window.desktop.browser.fingerprint(tabId).then(setData).catch(() => setData(null))
  }, [open, tabId])

  const rows: [string, string][] = data
    ? [
        ['User agent', data.userAgent],
        ['Brands', data.brands?.join(', ') ?? 'n/a'],
        ['Languages', data.languages.join(', ')],
        ['Plugins', String(data.plugins)],
        ['WebGL', data.webgl ?? 'n/a']
      ]
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Page fingerprint</DialogTitle>
        <DialogDescription>What the current page sees about this browser.</DialogDescription>

        {!data ? (
          <p className="mt-5 text-xs text-muted-foreground">Reading from page…</p>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-xs">
              {data.webdriver ? (
                <CircleAlert className="size-4 text-destructive" />
              ) : (
                <CircleCheck className="size-4 text-emerald-400" />
              )}
              <span>
                navigator.webdriver = <code className="font-mono">{String(data.webdriver)}</code>
              </span>
            </div>
            <dl className="divide-y rounded-lg border">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[96px_1fr] gap-3 px-3 py-2 text-xs">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-mono text-[11px] break-all select-text">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
