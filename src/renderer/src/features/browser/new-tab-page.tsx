import type { ComponentType } from 'react'
import { Folder, GitCompare, SquareTerminal } from 'lucide-react'
import { Kbd } from '@/components/ui/kbd'
import { useWorkspace, type ToolKind } from '@/features/workspace/store'

const TOOLS: { kind: ToolKind; label: string; shortcut: string; icon: ComponentType<{ className?: string }> }[] = [
  { kind: 'changes', label: 'Changes', shortcut: 'Ctrl Shift G', icon: GitCompare },
  { kind: 'terminal', label: 'Terminal', shortcut: 'Ctrl `', icon: SquareTerminal },
  { kind: 'files', label: 'Files', shortcut: 'Ctrl P', icon: Folder }
]

const SUGGESTED = [
  { label: 'Google', url: 'https://www.google.com/' },
  { label: 'Elon Musk', url: 'https://www.google.com/search?q=elon+musk' },
  { label: 'GitHub', url: 'https://github.com/' },
  { label: 'Wikipedia', url: 'https://en.wikipedia.org/' },
  { label: 'Electron docs', url: 'https://www.electronjs.org/docs/latest' },
  { label: 'Base UI', url: 'https://base-ui.com/' }
]

function faviconFor(url: string): string {
  return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(url).hostname}`
}

export function NewTabPage({ tabId }: { tabId: string }) {
  const openTool = useWorkspace((s) => s.openTool)

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-8 py-10">
        <section>
          <h2 className="mb-3 text-xs font-medium text-muted-foreground">Tools</h2>
          <div className="grid grid-cols-2 gap-1.5">
            {TOOLS.map(({ kind, label, shortcut, icon: Icon }) => (
              <button
                key={kind}
                onClick={() => openTool(kind, tabId)}
                className="group flex h-9 items-center gap-2.5 rounded-lg px-3 text-left text-[13px] transition-colors hover:bg-accent"
              >
                <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                <span className="flex-1">{label}</span>
                <Kbd className="opacity-70">{shortcut}</Kbd>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-medium text-muted-foreground">Suggested</h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2">
            {SUGGESTED.map(({ label, url }) => (
              <button
                key={url}
                onClick={() => window.desktop.browser.navigate(tabId, url)}
                className="group flex flex-col items-center gap-2.5 rounded-xl px-2 py-4 transition-colors hover:bg-accent"
              >
                <span className="grid size-10 place-items-center rounded-full bg-muted ring-1 ring-border transition-transform group-hover:scale-105">
                  <img
                    src={faviconFor(url)}
                    alt=""
                    className="size-5"
                    onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
                  />
                </span>
                <span className="max-w-full truncate text-xs">{label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
