export type MiniIDELayoutProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function MiniIDELayout({ children, className = '', style }: MiniIDELayoutProps) {
  return (
    <div
      data-mini-ide-layout
      className={className}
      style={{
        background: '#020617',
        border: '1px solid #1e293b',
        borderRadius: 8,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)',
        display: 'grid',
        minHeight: 520,
        minWidth: 0,
        overflow: 'hidden',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
