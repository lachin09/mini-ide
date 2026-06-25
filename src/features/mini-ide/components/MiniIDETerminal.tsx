import { useEffect, useRef } from 'react'

import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDETerminalProps = {
  className?: string
}

export function MiniIDETerminal({ className = '' }: MiniIDETerminalProps) {
  const consoleLines = useMiniIDESelector((state) => state.consoleLines)
  const outputRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [consoleLines])

  return (
    <section
      aria-label="IDE terminal"
      className={className}
      style={{
        background: '#000000',
        color: '#f1f5f9',
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 12,
        minHeight: 128,
        overflow: 'hidden',
      }}
    >
      <div
        ref={outputRef}
        style={{
          height: '100%',
          minHeight: 128,
          overflow: 'auto',
          padding: 12,
        }}
      >
        {consoleLines.length > 0 ? (
          consoleLines.map((line, index) => (
            <div
              key={`${line}-${index}`}
              style={{
                color: line.startsWith('[error]')
                  ? '#fca5a5'
                  : line.startsWith('[warn]')
                    ? '#fcd34d'
                    : '#f1f5f9',
              }}
            >
              {line}
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b' }}>Console output will appear here.</div>
        )}
      </div>
    </section>
  )
}
