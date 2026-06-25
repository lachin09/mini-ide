import Editor from '@monaco-editor/react'
import { useEffect, useRef } from 'react'

import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEEditorProps = {
  autoFormatOnBlur?: boolean
  className?: string
  height?: string
  style?: React.CSSProperties
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
  autoFormatOnBlur = false,
  className = '',
  height = '100%',
  style,
  theme = 'vs-dark',
}: MiniIDEEditorProps) {
  const editorRef = useRef<any>(null)
  const activeFilePath = useMiniIDESelector((state) => state.activeFile)
  const activeFile = useMiniIDESelector((state) => state.files[state.activeFile])
  const formatRequestId = useMiniIDESelector((state) => state.formatRequestId)
  const setFile = useMiniIDESelector((state) => state.setFile)

  async function formatDocument() {
    const editor = editorRef.current

    if (!editor) {
      return
    }

    const action = editor.getAction('editor.action.formatDocument')

    if (action?.isSupported()) {
      await action.run()
    }
  }

  useEffect(() => {
    if (formatRequestId > 0) {
      void formatDocument()
    }
  }, [formatRequestId])

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
        ...style,
      }}
    >
      <Editor
        height={height}
        language={getMonacoLanguage(activeFile.language)}
        onMount={(editor) => {
          editorRef.current = editor
          if (autoFormatOnBlur) {
            editor.onDidBlurEditorText(() => {
              void formatDocument()
            })
          }
        }}
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
