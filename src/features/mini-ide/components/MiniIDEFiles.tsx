import { useMemo, useState } from 'react'

import type { IDEFile } from '../../../core/ide/models/ideTypes'
import { useMiniIDESelector } from '../containers/MiniIDEContext'

export type MiniIDEFilesProps = {
  className?: string
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

export function MiniIDEFiles({ className = '' }: MiniIDEFilesProps) {
  const files = useMiniIDESelector((state) => state.files)
  const folders = useMiniIDESelector((state) => state.folders)
  const activeFile = useMiniIDESelector((state) => state.activeFile)
  const setActiveFile = useMiniIDESelector((state) => state.setActiveFile)
  const createFile = useMiniIDESelector((state) => state.createFile)
  const createFolder = useMiniIDESelector((state) => state.createFolder)
  const renamePath = useMiniIDESelector((state) => state.renamePath)
  const deletePath = useMiniIDESelector((state) => state.deletePath)
  const [openFolders, setOpenFolders] = useState<Set<string>>(() => new Set(['/src']))
  const tree = useMemo(() => buildTree(files, folders), [files, folders])

  function askForFile(parentPath = '') {
    const nextPath = window.prompt('New file path', getDefaultFilePath(parentPath))

    if (nextPath) {
      createFile(nextPath)
      openParentFolders(nextPath)
    }
  }

  function askForFolder(parentPath = '') {
    const nextPath = window.prompt('New folder path', getDefaultFolderPath(parentPath))

    if (nextPath) {
      createFolder(nextPath)
      openParentFolders(nextPath)
    }
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

    return (
      <div key={node.path}>
        <div
          style={{
            alignItems: 'center',
            background: isActive ? '#37373d' : 'transparent',
            color: isActive ? '#ffffff' : '#cccccc',
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto',
            minHeight: 24,
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
              gap: 6,
              minHeight: 24,
              minWidth: 0,
              overflow: 'hidden',
              padding: '0 4px',
              textAlign: 'left',
            }}
          >
            <span style={{ color: '#8a8a8a', width: 12 }}>
              {isFolder ? (isOpen ? 'v' : '>') : ''}
            </span>
            <span style={{ color: isFolder ? '#dcb67a' : '#8ab4f8', width: 14 }}>
              {isFolder ? '[d]' : '[f]'}
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

          <div style={{ display: 'flex', opacity: 0.9 }}>
            {isFolder ? (
              <>
                <button
                  type="button"
                  onClick={() => askForFile(node.path)}
                  title="New file"
                  style={iconButtonStyle}
                >
                  +f
                </button>
                <button
                  type="button"
                  onClick={() => askForFolder(node.path)}
                  title="New folder"
                  style={iconButtonStyle}
                >
                  +d
                </button>
              </>
            ) : null}
            <button
              type="button"
              onClick={() => askForRename(node.path)}
              title="Rename"
              style={iconButtonStyle}
            >
              rn
            </button>
            <button
              type="button"
              onClick={() => confirmDelete(node.path)}
              title="Delete"
              style={{ ...iconButtonStyle, color: '#fca5a5' }}
            >
              x
            </button>
          </div>
        </div>

        {isFolder && isOpen ? node.children.map((child) => renderNode(child, depth + 1)) : null}
      </div>
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
        <button type="button" onClick={() => askForFile()} title="New file" style={toolbarButtonStyle}>
          + File
        </button>
        <button type="button" onClick={() => askForFolder()} title="New folder" style={toolbarButtonStyle}>
          + Folder
        </button>
      </div>

      <div style={{ padding: '4px 0' }}>
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
  fontSize: 11,
  minHeight: 24,
  padding: '0 4px',
}

const toolbarButtonStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #3c3c3c',
  color: '#d4d4d4',
  cursor: 'pointer',
  fontSize: 11,
  minHeight: 24,
  padding: '0 6px',
}
