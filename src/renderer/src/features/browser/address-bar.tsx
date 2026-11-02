import { useEffect, useRef, useState } from 'react'
import { Globe, Lock, Search } from 'lucide-react'
import type { BrowserTabState } from '@shared/ipc'
import { useWorkspace } from '@/features/workspace/store'
import { cn } from '@/lib/utils'

function displayUrl(url: string): string {
  return url.startsWith('about:blank') ? '' : url
}

export function AddressBar({ tab }: { tab: BrowserTabState }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState(displayUrl(tab.url))
  const [focused, setFocused] = useState(false)
  const focusToken = useWorkspace((s) => s.addressFocusToken)

  useEffect(() => {
    if (!focused) setDraft(displayUrl(tab.url))
  }, [tab.url, tab.id, focused])

  useEffect(() => {
    if (focusToken === 0) return
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [focusToken])

  const secure = tab.url.startsWith('https://')
  const Icon = focused || !tab.url ? Search : secure ? Lock : Globe

  return (
    <form
      className={cn(
        'group flex h-8 min-w-0 flex-1 items-center gap-2 rounded-full border border-transparent bg-muted px-3 transition-colors',
        'hover:bg-accent/70 focus-within:border-ring focus-within:bg-background'
      )}
      onSubmit={(e) => {
        e.preventDefault()
        if (!draft.trim()) return
        window.desktop.browser.navigate(tab.id, draft)
        inputRef.current?.blur()
      }}
    >
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <input
        ref={inputRef}
        value={draft}
        spellCheck={false}
        placeholder="Search or enter a URL"
        className="h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground"
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => {
          setFocused(true)
          e.target.select()
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setDraft(displayUrl(tab.url))
            e.currentTarget.blur()
          }
        }}
      />
    </form>
  )
}
