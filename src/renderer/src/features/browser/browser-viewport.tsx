import { useLayoutEffect, useRef } from 'react'
import { useWorkspace } from '@/features/workspace/store'

export function BrowserViewport() {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useWorkspace((s) => s.overlays === 0 || s.freezing)
  const snapshot = useWorkspace((s) => s.snapshot)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const report = (): void => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        window.desktop.browser.setViewport({
          rect: {
            x: Math.round(r.left),
            y: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height)
          },
          visible
        })
      })
    }

    const observer = new ResizeObserver(report)
    observer.observe(el)
    window.addEventListener('resize', report)
    report()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', report)
      window.desktop.browser.setViewport({ rect: null, visible: false })
    }
  }, [visible])

  return (
    <div ref={ref} className="relative min-h-0 flex-1 overflow-hidden bg-panel">
      {snapshot && <img src={snapshot} alt="" draggable={false} className="absolute inset-0 size-full object-cover object-left-top" />}
    </div>
  )
}
