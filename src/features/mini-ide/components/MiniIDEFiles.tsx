import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEFilesProps = {
  className?: string
}

export function MiniIDEFiles({ className = '' }: MiniIDEFilesProps) {
  const files = useMiniIDESelector((state) => state.files)
  const activeFile = useMiniIDESelector((state) => state.activeFile)
  const setActiveFile = useMiniIDESelector((state) => state.setActiveFile)

  return (
    <nav
      aria-label="IDE files"
      className={className}
      style={{
        background: '#020617',
        borderRight: '1px solid #1e293b',
        minWidth: 0,
        overflow: 'auto',
      }}
    >
      {Object.values(files).map((file) => {
        const isActive = file.path === activeFile

        return (
          <button
            key={file.path}
            type="button"
            style={{
              background: isActive ? '#1e293b' : 'transparent',
              border: 0,
              color: isActive ? '#ffffff' : '#cbd5e1',
              cursor: 'pointer',
              display: 'block',
              fontSize: 14,
              overflow: 'hidden',
              padding: '8px 12px',
              textAlign: 'left',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
            onClick={() => setActiveFile(file.path)}
            title={file.path}
          >
            {file.path}
          </button>
        )
      })}
    </nav>
  )
}
