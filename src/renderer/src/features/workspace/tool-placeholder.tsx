import { Folder, GitCompare, SquareTerminal } from 'lucide-react'
import type { ToolKind } from './store'

const COPY: Record<ToolKind, { title: string; body: string; icon: typeof Folder }> = {
  files: { title: 'Files', body: 'A file tree and editor will live here.', icon: Folder },
  terminal: { title: 'Terminal', body: 'An integrated terminal (node-pty + xterm) will live here.', icon: SquareTerminal },
  changes: { title: 'Changes', body: 'Git diffs for the current project will live here.', icon: GitCompare }
}

export function ToolPlaceholder({ kind }: { kind: ToolKind }) {
  const { title, body, icon: Icon } = COPY[kind]
  return (
    <div className="grid min-h-0 flex-1 place-items-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border bg-muted/60">
          <Icon className="size-5 text-muted-foreground" />
        </span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  )
}
