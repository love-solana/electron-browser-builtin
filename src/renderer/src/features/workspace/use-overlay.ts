import { useEffect } from 'react'
import { useWorkspace } from './store'

/**
 * The native browser view is always painted above the DOM, so any popup that
 * can overlap it must hide the view while open. A snapshot of the page is
 * shown in its place so the swap is invisible.
 */
export function useOverlay(open: boolean): void {
  const pushOverlay = useWorkspace((s) => s.pushOverlay)
  const popOverlay = useWorkspace((s) => s.popOverlay)

  useEffect(() => {
    if (!open) return
    pushOverlay()
    return () => popOverlay()
  }, [open, pushOverlay, popOverlay])
}
