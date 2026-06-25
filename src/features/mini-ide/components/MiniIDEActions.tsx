export type MiniIDEActionsProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MiniIDEActions({ children, className = '', style }: MiniIDEActionsProps) {
  return (
    <div
      className={className}
      style={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
