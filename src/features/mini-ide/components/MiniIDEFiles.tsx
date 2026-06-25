import { useMemo, useState } from 'react'

import type { IDEFile } from '../../../core/ide/models/ideTypes'
import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEFilesProps = {
  className?: string
  style?: React.CSSProperties
}

type TreeNode = {
  name: string
  path: string
  type: 'file' | 'folder'
  file?: IDEFile
  children: TreeNode[]
}

function createFolderNode(name: string, path: string): TreeNode {
  return {
    name,
    path,
    type: 'folder',
    children: [],
  }
}

function buildTree(files: Record<string, IDEFile>, folders: string[]): TreeNode[] {
  const root = createFolderNode('', '')
  const folderPaths = new Set<string>()

  for (const folder of folders) {
    folderPaths.add(normalizePath(folder))
  }

  for (const filePath of Object.keys(files)) {
    const parts = normalizePath(filePath).split('/').filter(Boolean)

    parts.slice(0, -1).forEach((_, index) => {
      folderPaths.add(`/${parts.slice(0, index + 1).join('/')}`)
    })
  }

  for (const folderPath of Array.from(folderPaths).sort((a, b) => a.localeCompare(b))) {
    ensureFolder(root, folderPath)
  }

  for (const file of Object.values(files)) {
    const normalizedPath = normalizePath(file.path)
    const parts = normalizedPath.split('/').filter(Boolean)
    const fileName = parts.at(-1) ?? normalizedPath
    const parentPath = `/${parts.slice(0, -1).join('/')}`.replace(/\/$/, '')
    const parent = parentPath === '/' ? root : ensureFolder(root, parentPath)

    parent.children.push({
      name: fileName,
      path: normalizedPath,
      type: 'file',
      file,
      children: [],
    })
  }

  sortTree(root.children)

  return root.children
}

function ensureFolder(root: TreeNode, path: string): TreeNode {
  const parts = normalizePath(path).split('/').filter(Boolean)
  let current = root

  parts.forEach((part, index) => {
    const folderPath = `/${parts.slice(0, index + 1).join('/')}`
    let next = current.children.find(
      (child) => child.type === 'folder' && child.path === folderPath,
    )

    if (!next) {
      next = createFolderNode(part, folderPath)
      current.children.push(next)
    }

    current = next
  })

  return current
}

function sortTree(nodes: TreeNode[]) {
  nodes.sort((first, second) => {
    if (first.type !== second.type) {
      return first.type === 'folder' ? -1 : 1
    }

    return first.name.localeCompare(second.name)
  })

  nodes.forEach((node) => sortTree(node.children))
}

function normalizePath(path: string): string {
  const trimmed = path.trim().replaceAll('\\', '/').replace(/\/+/g, '/')

  if (!trimmed || trimmed === '/') {
    return ''
  }

  return trimmed.startsWith('/') ? trimmed.replace(/\/$/, '') : `/${trimmed.replace(/\/$/, '')}`
}

function getDefaultFilePath(parentPath = '') {
  const prefix = parentPath ? `${parentPath}/` : '/'

  return `${prefix}untitled.js`
}

function getDefaultFolderPath(parentPath = '') {
  const prefix = parentPath ? `${parentPath}/` : '/'

  return `${prefix}folder`
}

function getParentPath(path: string) {
  const parts = normalizePath(path).split('/').filter(Boolean)

  return parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : ''
}

export function MiniIDEFiles({ className = '', style }: MiniIDEFilesProps) {
  const files = useMiniIDESelector((state) => state.files)
  const folders = useMiniIDESelector((state) => state.folders)
  const activeFile = useMiniIDESelector((state) => state.activeFile)
  const setActiveFile = useMiniIDESelector((state) => state.setActiveFile)
  const createFile = useMiniIDESelector((state) => state.createFile)
  const createFolder = useMiniIDESelector((state) => state.createFolder)
  const renamePath = useMiniIDESelector((state) => state.renamePath)
  const deletePath = useMiniIDESelector((state) => state.deletePath)
  const [openFolders, setOpenFolders] = useState<Set<string>>(() => new Set(['/src']))
  const [focusedPath, setFocusedPath] = useState('')
  const [draft, setDraft] = useState<{
    type: 'file' | 'folder'
    parentPath: string
    value: string
  } | null>(null)
  const tree = useMemo(() => buildTree(files, folders), [files, folders])

  function startCreate(type: 'file' | 'folder', parentPath = '') {
    setDraft({
      type,
      parentPath,
      value: type === 'file' ? 'untitled.js' : 'folder',
    })

    if (parentPath) {
      setOpenFolders((current) => {
        const next = new Set(current)
        next.add(parentPath)
        return next
      })
    }
  }

  function commitDraft() {
    if (!draft) {
      return
    }

    const value = draft.value.trim()

    if (!value) {
      setDraft(null)
      return
    }

    const nextPath = normalizePath(
      value.startsWith('/') ? value : `${draft.parentPath || ''}/${value}`,
    )

    if (draft.type === 'file') {
      createFile(nextPath)
    } else {
      createFolder(nextPath)
    }

    openParentFolders(nextPath)
    setDraft(null)
  }

  function askForRename(path: string) {
    const nextPath = window.prompt('Rename path', path)

    if (nextPath) {
      renamePath(path, nextPath)
      openParentFolders(nextPath)
    }
  }

  function confirmDelete(path: string) {
    if (window.confirm(`Delete ${path}?`)) {
      deletePath(path)
    }
  }

  function openParentFolders(path: string) {
    const parentPath = getParentPath(path)

    if (!parentPath) {
      return
    }

    const parts = parentPath.split('/').filter(Boolean)
    setOpenFolders((current) => {
      const next = new Set(current)
      parts.forEach((_, index) => {
        next.add(`/${parts.slice(0, index + 1).join('/')}`)
      })
      return next
    })
  }

  function toggleFolder(path: string) {
    setOpenFolders((current) => {
      const next = new Set(current)

      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }

      return next
    })
  }

  function renderNode(node: TreeNode, depth = 0): React.ReactNode {
    const isFolder = node.type === 'folder'
    const isOpen = openFolders.has(node.path)
    const isActive = node.path === activeFile
    const isFocused = node.path === focusedPath

    return (
      <div key={node.path}>
        <div
          onMouseEnter={() => setFocusedPath(node.path)}
          style={{
            alignItems: 'center',
            background: isActive ? '#37373d' : isFocused ? '#2a2d2e' : 'transparent',
            color: isActive ? '#ffffff' : '#cccccc',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto',
            minHeight: 22,
            paddingLeft: 8 + depth * 12,
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (isFolder) {
                toggleFolder(node.path)
              } else {
                setActiveFile(node.path)
              }
            }}
            title={node.path}
            style={{
              alignItems: 'center',
              background: 'transparent',
              border: 0,
              color: 'inherit',
              cursor: 'pointer',
              display: 'flex',
              fontSize: 13,
              gap: 5,
              minHeight: 22,
              minWidth: 0,
              overflow: 'hidden',
              padding: '0 3px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: '#8a8a8a', width: 10 }}>
              {isFolder ? (isOpen ? '▾' : '▸') : ''}
            </span>
            <span style={{ width: 15 }}>
              {isFolder ? (isOpen ? '▣' : '▢') : getFileIcon(node.name)}
            </span>
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {node.name}
            </span>
          </button>

          <div style={{ display: 'flex', opacity: 1 }}>
            {isFolder ? (
              <>
                <button
                  type="button"
                  onClick={() => startCreate('file', node.path)}
                  title="New file"
                  style={iconButtonStyle}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => startCreate('folder', node.path)}
                  title="New folder"
                  style={iconButtonStyle}
                >
                  ▢
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => askForRename(node.path)}
              title="Rename"
              style={iconButtonStyle}
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(node.path)}
              title="Delete"
              style={{ ...iconButtonStyle, color: '#fca5a5' }}
            >
              ×
            </button>
          </div>
        </div>

        {isFolder && isOpen ? (
          <>
            {draft?.parentPath === node.path ? renderDraft(depth + 1) : null}
            {node.children.map((child) => renderNode(child, depth + 1))}
          </>
        ) : null}
      </div>
    )
  }

  function renderDraft(depth = 0): React.ReactNode {
    if (!draft) {
      return null
    }

    return (
      <form
        onSubmit={(event) => {
          event.preventDefault()
          commitDraft()
        }}
        style={{
          alignItems: 'center',
          background: '#37373d',
          display: 'flex',
          minHeight: 24,
          paddingLeft: 24 + depth * 12,
          paddingRight: 6,
        }}
      >
        <span style={{ color: draft.type === 'folder' ? '#dcb67a' : '#8ab4f8', width: 20 }}>
          {draft.type === 'folder' ? '▢' : getFileIcon(draft.value)}
        </span>
        <input
          autoFocus
          value={draft.value}
          onBlur={commitDraft}
          onChange={(event) => setDraft({ ...draft, value: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault()
              setDraft(null)
            }
          }}
          style={{
            background: '#3c3c3c',
            border: '1px solid #007acc',
            color: '#ffffff',
            flex: 1,
            fontSize: 13,
            minHeight: 22,
            minWidth: 0,
            outline: 'none',
            padding: '0 4px',
          }}
        />
      </form>
    )
  }

  return (
    <nav
      aria-label="IDE files"
      className={className}
      style={{
        background: '#252526',
        borderRight: '1px solid #1e1e1e',
        color: '#cccccc',
        minWidth: 0,
        overflow: 'auto',
        ...style,
      }}
    >
      <div
        style={{
          alignItems: 'center',
          borderBottom: '1px solid #1e1e1e',
          display: 'flex',
          gap: 4,
          minHeight: 32,
          padding: '0 8px',
        }}
      >
        <span
          style={{
            color: '#bbbbbb',
            flex: 1,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          Explorer
        </span>
        <button type="button" onClick={() => startCreate('file')} title="New file" style={toolbarButtonStyle}>
          +
        </button>
        <button type="button" onClick={() => startCreate('folder')} title="New folder" style={toolbarButtonStyle}>
          ▢
        </button>
      </div>

      <div style={{ padding: '4px 0' }}>
        {draft?.parentPath === '' ? renderDraft(0) : null}
        {tree.length > 0 ? (
          tree.map((node) => renderNode(node))
        ) : (
          <div style={{ color: '#8a8a8a', fontSize: 13, padding: 12 }}>
            No files. Create a file to start.
          </div>
        )}
      </div>
    </nav>
  )
}

const iconButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  color: '#9ca3af',
  cursor: 'pointer',
  fontSize: 13,
  lineHeight: 1,
  minHeight: 22,
  minWidth: 22,
  padding: 0,
}

const toolbarButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: 0,
  color: '#d4d4d4',
  cursor: 'pointer',
  fontSize: 15,
  lineHeight: 1,
  minHeight: 24,
  minWidth: 24,
  padding: 0,
}

function getFileIcon(name: string): string {
  if (name.endsWith('.tsx') || name.endsWith('.ts')) return 'TS'
  if (name.endsWith('.jsx') || name.endsWith('.js')) return 'JS'
  if (name.endsWith('.html')) return '<>'
  if (name.endsWith('.css')) return '#'
  if (name.endsWith('.json')) return '{}'

  return '•'
}
