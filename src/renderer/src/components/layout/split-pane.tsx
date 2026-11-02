import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react'
import { useOverlay } from '@/features/workspace/use-overlay'
import { cn } from '@/lib/utils'

interface SplitPaneProps {
  left: ReactNode
  right: ReactNode
  storageKey: string
  defaultRatio?: number
  minLeft?: number
  minRight?: number
}

export function SplitPane({ left, right, storageKey, defaultRatio = 0.5, minLeft = 340, minRight = 420 }: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(() => {
    const saved = Number(localStorage.getItem(storageKey))
    return saved > 0 && saved < 1 ? saved : defaultRatio
  })
  const [dragging, setDragging] = useState(false)
  useOverlay(dragging)

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const container = containerRef.current
      if (!container) return
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      setDragging(true)

      const rect = container.getBoundingClientRect()
      let latest = ratio
      const onMove = (ev: PointerEvent): void => {
        const x = Math.min(Math.max(ev.clientX - rect.left, minLeft), rect.width - minRight)
        latest = x / rect.width
        setRatio(latest)
      }
      const onUp = (): void => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        localStorage.setItem(storageKey, String(latest))
        setDragging(false)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [ratio, minLeft, minRight, storageKey]
  )

  return (
    <div ref={containerRef} className={cn('flex h-full min-w-0 flex-1', dragging && 'cursor-col-resize select-none')}>
      <div className="h-full min-w-0" style={{ width: `${ratio * 100}%`, minWidth: minLeft }}>
        {left}
      </div>
      <div
        role="separator"
        aria-orientation="vertical"
        onPointerDown={onPointerDown}
        onDoubleClick={() => {
          setRatio(defaultRatio)
          localStorage.setItem(storageKey, String(defaultRatio))
        }}
        className="group relative z-10 w-px shrink-0 cursor-col-resize bg-border"
      >
        <div
          className={cn(
            'absolute inset-y-0 -left-1 w-[9px] transition-colors group-hover:bg-brand/40',
            dragging && 'bg-brand/60'
          )}
        />
      </div>
      <div className="h-full min-w-0 flex-1" style={{ minWidth: minRight }}>
        {right}
      </div>
    </div>
  )
}
