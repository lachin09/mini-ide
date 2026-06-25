import Editor from '@monaco-editor/react'

import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEEditorProps = {
  className?: string
  height?: string
  theme?: 'vs-dark' | 'light'
}

function getMonacoLanguage(language?: string): string {
  if (language === 'jsx') {
    return 'javascript'
  }

  if (language === 'tsx') {
    return 'typescript'
  }

  return language ?? 'plaintext'
}

export function MiniIDEEditor({
  className = '',
  height = '100%',
  theme = 'vs-dark',
}: MiniIDEEditorProps) {
  const activeFilePath = useMiniIDESelector((state) => state.activeFile)
  const activeFile = useMiniIDESelector((state) => state.files[state.activeFile])
  const setFile = useMiniIDESelector((state) => state.setFile)

  if (!activeFile) {
    return (
      <div
        className={className}
        style={{
          alignItems: 'center',
          background: '#020617',
          color: '#94a3b8',
          display: 'flex',
          fontSize: 14,
          justifyContent: 'center',
          minHeight: 256,
        }}
      >
        No file selected.
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        background: '#020617',
        minHeight: 256,
        minWidth: 0,
        overflow: 'hidden',
      }}
    >
      <Editor
        height={height}
        language={getMonacoLanguage(activeFile.language)}
        onChange={(value = '') => setFile(activeFilePath, value)}
        path={activeFile.path}
        theme={theme}
        value={activeFile.code}
        options={{
          automaticLayout: true,
          fontSize: 14,
          formatOnPaste: true,
          minimap: { enabled: false },
          readOnly: activeFile.readonly,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  )
}
