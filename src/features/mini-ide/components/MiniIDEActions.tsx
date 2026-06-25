export type MiniIDEActionsProps = {
  children: React.ReactNode
  className?: string
}

export function MiniIDEActions({ children, className = '' }: MiniIDEActionsProps) {
  return (
    <div
      className={className}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      {children}
    </div>
  )
}
