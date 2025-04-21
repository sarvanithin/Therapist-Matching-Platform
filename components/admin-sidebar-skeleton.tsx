export function AdminSidebarSkeleton() {
  return (
    <div className="flex h-full flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <div className="h-8 w-8 rounded-full bg-muted-foreground/20"></div>
        <div className="ml-2 h-4 w-20 bg-muted-foreground/20 rounded"></div>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
            >
              <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
              <div className="h-4 w-20 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="h-9 w-full bg-muted-foreground/20 rounded-md" />
      </div>
    </div>
  )
}
