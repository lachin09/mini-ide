import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEPreviewProps = {
  className?: string
}

export function MiniIDEPreview({ className = '' }: MiniIDEPreviewProps) {
  const previewUrl = useMiniIDESelector((state) => state.previewUrl)

  return (
    <section
      className={className}
      aria-label="IDE preview"
      style={{
        background: '#ffffff',
        minHeight: 256,
        overflow: 'hidden',
      }}
    >
      {previewUrl ? (
        <iframe
          title="Mini IDE preview"
          src={previewUrl}
          sandbox="allow-scripts"
          style={{
            background: '#ffffff',
            border: 0,
            height: '100%',
            minHeight: 256,
            width: '100%',
          }}
        />
      ) : (
        <div
          style={{
            alignItems: 'center',
            background: '#f1f5f9',
            color: '#64748b',
            display: 'flex',
            fontSize: 14,
            height: '100%',
            justifyContent: 'center',
            minHeight: 256,
            padding: '0 16px',
            textAlign: 'center',
          }}
        >
          Run the code to render a preview.
        </div>
      )}
    </section>
  )
}
