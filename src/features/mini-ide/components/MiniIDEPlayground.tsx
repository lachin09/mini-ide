import type { MiniIDEOptions } from '../../../core/ide/models/ideTypes'
import { useEffect, useRef } from 'react'
import { MiniIDEEditor } from './MiniIDEEditor'
import { MiniIDEFiles } from './MiniIDEFiles'
import { MiniIDELayout } from './MiniIDELayout'
import { MiniIDEPreview } from './MiniIDEPreview'
import { MiniIDEResizeHandle } from './MiniIDEResizeHandle'
import { MiniIDETerminal } from './MiniIDETerminal'
import { MiniIDERoot } from '../containers/MiniIDERoot'
import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEPlaygroundProps = Omit<MiniIDEOptions, 'engine'> & {
  engine?: MiniIDEOptions['engine']
  autoRun?: boolean
  title?: string
  subtitle?: string
  height?: string | number
  className?: string
}

const layoutStyle = {
  '--mini-ide-sidebar-width': '240px',
  '--mini-ide-preview-width': '380px',
  '--mini-ide-terminal-height': '180px',
} as React.CSSProperties

function PlaygroundButton({
  children,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const button = buttonRef.current

    if (!button || disabled) {
      return
    }

    function handleNativeClick() {
      onClick()
    }

    button.addEventListener('click', handleNativeClick)

    return () => {
      button.removeEventListener('click', handleNativeClick)
    }
  }, [disabled, onClick])

  return (
    <button
      ref={buttonRef}
      type="button"
      disabled={disabled}
      style={{
        alignItems: 'center',
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: 6,
        color: '#f8fafc',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'inline-flex',
        fontSize: 14,
        fontWeight: 500,
        justifyContent: 'center',
        minHeight: 36,
        opacity: disabled ? 0.55 : 1,
        padding: '0 12px',
      }}
    >
      {children}
    </button>
  )
}

function PlaygroundToolbar() {
  const isRunning = useMiniIDESelector((state) => state.isRunning)
  const run = useMiniIDESelector((state) => state.run)
  const reset = useMiniIDESelector((state) => state.reset)
  const clearConsole = useMiniIDESelector((state) => state.clearConsole)
  const requestFormat = useMiniIDESelector((state) => state.requestFormat)

  return (
    <div
      style={{
        alignItems: 'center',
        background: '#0f172a',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        gridColumn: '1 / 4',
        padding: 8,
      }}
    >
      <PlaygroundButton disabled={isRunning} onClick={() => void run()}>
        {isRunning ? 'Running...' : 'Run'}
      </PlaygroundButton>
      <PlaygroundButton onClick={() => void reset()}>
        Reset
      </PlaygroundButton>
      <PlaygroundButton onClick={clearConsole}>
        Clear Console
      </PlaygroundButton>
      <PlaygroundButton onClick={requestFormat}>
        Format
      </PlaygroundButton>
    </div>
  )
}

function PlaygroundAutoRunner({ enabled }: { enabled: boolean }) {
  const files = useMiniIDESelector((state) => state.files)
  const activeFile = useMiniIDESelector((state) => state.activeFile)
  const run = useMiniIDESelector((state) => state.run)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      void run()
    }, 250)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [activeFile, files, enabled, run])

  return null
}

export function MiniIDEPlayground({
  activeFile,
  autoRun = true,
  className = '',
  engine = 'auto',
  files,
  folders,
  height = 'min(78vh, 820px)',
  subtitle = 'Browser playground',
  title = 'MiniIDE',
}: MiniIDEPlaygroundProps) {
  return (
    <section
      className={className}
      style={{
        background: '#1e1e1e',
        border: '1px solid #2b2b2b',
        borderRadius: 6,
        boxShadow: '0 24px 80px rgba(0, 0, 0, 0.24)',
        color: '#cccccc',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          background: '#3c3c3c',
          borderBottom: '1px solid #2b2b2b',
          display: 'flex',
          fontSize: 12,
          height: 36,
          padding: '0 12px',
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ background: '#ff5f57', borderRadius: 999, height: 12, width: 12 }} />
          <span style={{ background: '#ffbd2e', borderRadius: 999, height: 12, width: 12 }} />
          <span style={{ background: '#28c840', borderRadius: 999, height: 12, width: 12 }} />
        </div>
        <div
          style={{
            color: '#e5e5e5',
            flex: 1,
            overflow: 'hidden',
            padding: '0 16px',
            textAlign: 'center',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </div>
        <div style={{ color: '#a7a7a7' }}>{subtitle}</div>
      </div>

      <div style={{ display: 'flex', minHeight: 0 }}>
        <aside
          style={{
            alignItems: 'center',
            background: '#333333',
            borderRight: '1px solid #2b2b2b',
            color: '#c5c5c5',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            gap: 4,
            padding: '8px 0',
            width: 48,
          }}
        >
          {['Files', 'Search', 'Git'].map((label, index) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              style={{
                background: 'transparent',
                border: 0,
                borderLeft: index === 0 ? '2px solid #007acc' : '2px solid transparent',
                color: index === 0 ? '#ffffff' : '#bdbdbd',
                cursor: 'default',
                fontSize: 11,
                height: 40,
                minHeight: 40,
                width: 48,
              }}
            >
              {label.slice(0, 1)}
            </button>
          ))}
          <button
            type="button"
            aria-label="Settings"
            style={{
              background: 'transparent',
              border: 0,
              color: '#bdbdbd',
              cursor: 'default',
              fontSize: 15,
              height: 40,
              marginTop: 'auto',
              minHeight: 40,
              width: 48,
            }}
          >
            ⚙
          </button>
        </aside>

        <div style={{ minWidth: 0, flex: 1 }}>
          <MiniIDERoot activeFile={activeFile} engine={engine} files={files} folders={folders}>
            <MiniIDELayout
              style={{
                ...layoutStyle,
                border: 0,
                borderRadius: 0,
                boxShadow: 'none',
                gridTemplateColumns:
                  'var(--mini-ide-sidebar-width) minmax(0, 1fr) var(--mini-ide-preview-width)',
                gridTemplateRows: 'auto minmax(0, 1fr) var(--mini-ide-terminal-height)',
                height,
                minHeight: 620,
              }}
            >
              <PlaygroundAutoRunner enabled={autoRun} />
              <PlaygroundToolbar />

              <MiniIDEFiles style={{ gridColumn: 1, gridRow: '2 / 4' }} />
              <MiniIDEEditor autoFormatOnBlur style={{ gridColumn: 2, gridRow: 2, minHeight: 0 }} />
              <MiniIDEPreview style={{ gridColumn: 3, gridRow: '2 / 4', minHeight: 0 }} />
              <MiniIDETerminal style={{ gridColumn: 2, gridRow: 3, minHeight: 0 }} />

              <MiniIDEResizeHandle
                direction="horizontal"
                target="--mini-ide-sidebar-width"
                min={160}
                max={360}
                className="mini-ide-sidebar-resize"
                style={{
                  bottom: 0,
                  left: 'var(--mini-ide-sidebar-width)',
                  position: 'absolute',
                  top: 44,
                  width: 4,
                  zIndex: 10,
                }}
              />
              <MiniIDEResizeHandle
                direction="horizontal"
                target="--mini-ide-preview-width"
                min={260}
                max={640}
                invert
                className="mini-ide-preview-resize"
                style={{
                  bottom: 0,
                  position: 'absolute',
                  right: 'var(--mini-ide-preview-width)',
                  top: 44,
                  width: 4,
                  zIndex: 10,
                }}
              />
              <MiniIDEResizeHandle
                direction="vertical"
                target="--mini-ide-terminal-height"
                min={128}
                max={340}
                invert
                className="mini-ide-terminal-resize"
                style={{
                  bottom: 'var(--mini-ide-terminal-height)',
                  height: 4,
                  left: 'var(--mini-ide-sidebar-width)',
                  position: 'absolute',
                  right: 'var(--mini-ide-preview-width)',
                  zIndex: 10,
                }}
              />
            </MiniIDELayout>
          </MiniIDERoot>
        </div>
      </div>

      <footer
        style={{
          alignItems: 'center',
          background: '#007acc',
          color: '#ffffff',
          display: 'flex',
          fontSize: 11,
          gap: 16,
          height: 24,
          padding: '0 12px',
        }}
      >
        <span>{engine}</span>
        <span>browser runtime</span>
        <span style={{ marginLeft: 'auto' }}>Tailwind preview supported</span>
      </footer>
    </section>
  )
}
