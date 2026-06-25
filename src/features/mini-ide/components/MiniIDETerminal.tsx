import { useEffect, useRef, useState } from 'react'

import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDETerminalProps = {
  className?: string
  style?: React.CSSProperties
}

export function MiniIDETerminal({ className = '', style }: MiniIDETerminalProps) {
  const consoleLines = useMiniIDESelector((state) => state.consoleLines)
  const appendConsoleLine = useMiniIDESelector((state) => state.appendConsoleLine)
  const isRunning = useMiniIDESelector((state) => state.isRunning)
  const run = useMiniIDESelector((state) => state.run)
  const outputRef = useRef<HTMLDivElement | null>(null)
  const [command, setCommand] = useState('')

  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [consoleLines])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const normalizedCommand = command.trim().replace(/\s+/g, ' ')

    if (!normalizedCommand) {
      return
    }

    appendConsoleLine(`$ ${normalizedCommand}`)
    setCommand('')

    if (normalizedCommand === 'npm install') {
      appendConsoleLine('Dependencies are already installed in this browser lesson.')
      appendConsoleLine('Use npm run or npm run dev to run the current file/project.')
      return
    }

    if (normalizedCommand === 'npm run' || normalizedCommand === 'npm run dev') {
      appendConsoleLine('Starting MiniIDE runner...')
      void run()
      return
    }

    appendConsoleLine('[error] Only npm install, npm run, and npm run dev are available.')
  }

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
        ...style,
      }}
    >
      <div
        ref={outputRef}
        style={{
          height: 'calc(100% - 40px)',
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
      <form
        onSubmit={handleSubmit}
        style={{
          alignItems: 'center',
          borderTop: '1px solid #1f2937',
          display: 'flex',
          gap: 8,
          minHeight: 40,
          padding: '0 12px',
        }}
      >
        <span aria-hidden="true" style={{ color: '#94a3b8' }}>
          $
        </span>
        <input
          aria-label="Terminal command"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          disabled={isRunning}
          onChange={(event) => setCommand(event.target.value)}
          placeholder="npm install, npm run, or npm run dev"
          spellCheck={false}
          value={command}
          style={{
            background: 'transparent',
            border: 0,
            color: '#f8fafc',
            flex: 1,
            font: 'inherit',
            minWidth: 0,
            outline: 'none',
          }}
        />
      </form>
    </section>
  )
}
