import { createStore } from 'zustand/vanilla'

import type { ExecutionEngine } from '../../../core/ide/interfaces/ExecutionEngine'
import type { FileMap, IDEState, MiniIDEOptions } from '../../../core/ide/models/ideTypes'
import {
  cloneFileMap,
  getDefaultActiveFile,
  normalizeFileMap,
} from '../../../core/ide/services/fileMap'

export type IDEActions = {
  setFile: (path: string, code: string) => void
  setActiveFile: (path: string) => void
  createFile: (path: string) => void
  createFolder: (path: string) => void
  renamePath: (oldPath: string, newPath: string) => void
  deletePath: (path: string) => void
  run: () => Promise<void>
  reset: () => Promise<void>
  requestFormat: () => void
  clearConsole: () => void
  appendConsoleLine: (line: string) => void
  setPreviewUrl: (url: string | null) => void
}

export type IDEStore = IDEState & IDEActions

export type CreateIDEStoreInput = MiniIDEOptions & {
  executionEngine: ExecutionEngine
}

export function createIDEStore({
  activeFile,
  executionEngine,
  files,
  folders = [],
}: CreateIDEStoreInput) {
  const normalizedFiles = normalizeFileMap(files)
  const initialActiveFile = getDefaultActiveFile(normalizedFiles, activeFile)
  const initialFiles = cloneFileMap(normalizedFiles)
  const normalizedFolders = normalizeFolders(folders)

  return createStore<IDEStore>((set, get) => ({
    files: normalizedFiles,
    initialFiles,
    folders: normalizedFolders,
    initialFolders: [...normalizedFolders],
    activeFile: initialActiveFile,
    initialActiveFile,
    consoleLines: [],
    isRunning: false,
    previewUrl: null,
    formatRequestId: 0,

    setFile: (path, code) => {
      set((state) => {
        const currentFile = state.files[path]

        if (!currentFile || currentFile.readonly) {
          return state
        }

        return {
          files: {
            ...state.files,
            [path]: {
              ...currentFile,
              code,
            },
          },
        }
      })
    },

    setActiveFile: (path) => {
      if (get().files[path]) {
        set({ activeFile: path })
      }
    },

    createFile: (path) => {
      const normalizedPath = normalizePath(path)

      if (!normalizedPath || get().files[normalizedPath]) {
        return
      }

      set((state) => ({
        files: {
          ...state.files,
          [normalizedPath]: {
            path: normalizedPath,
            language: getLanguageFromPath(normalizedPath),
            code: '',
          },
        },
        folders: mergeFolders(state.folders, getParentFolders(normalizedPath)),
        activeFile: normalizedPath,
      }))
    },

    createFolder: (path) => {
      const normalizedPath = normalizePath(path)

      if (!normalizedPath) {
        return
      }

      set((state) => ({
        folders: mergeFolders(state.folders, [
          ...getParentFolders(normalizedPath),
          normalizedPath,
        ]),
      }))
    },

    renamePath: (oldPath, newPath) => {
      const normalizedOldPath = normalizePath(oldPath)
      const normalizedNewPath = normalizePath(newPath)

      if (!normalizedOldPath || !normalizedNewPath || normalizedOldPath === normalizedNewPath) {
        return
      }

      set((state) => {
        const isFile = Boolean(state.files[normalizedOldPath])
        const isFolder = state.folders.includes(normalizedOldPath) || hasChildren(state, normalizedOldPath)

        if (!isFile && !isFolder) {
          return state
        }

        if (isFile && state.files[normalizedNewPath]) {
          return state
        }

        const nextFiles = Object.entries(state.files).reduce((result, [path, file]) => {
          if (path === normalizedOldPath || path.startsWith(`${normalizedOldPath}/`)) {
            const renamedPath = `${normalizedNewPath}${path.slice(normalizedOldPath.length)}`
            result[renamedPath] = {
              ...file,
              path: renamedPath,
              language: file.language ?? getLanguageFromPath(renamedPath),
            }
            return result
          }

          result[path] = file
          return result
        }, {} as FileMap)
        const nextFolders = state.folders.map((folder) =>
          folder === normalizedOldPath || folder.startsWith(`${normalizedOldPath}/`)
            ? `${normalizedNewPath}${folder.slice(normalizedOldPath.length)}`
            : folder,
        )
        const activeFile =
          state.activeFile === normalizedOldPath ||
          state.activeFile.startsWith(`${normalizedOldPath}/`)
            ? `${normalizedNewPath}${state.activeFile.slice(normalizedOldPath.length)}`
            : state.activeFile

        return {
          files: nextFiles,
          folders: mergeFolders(nextFolders, getParentFolders(normalizedNewPath)),
          activeFile: nextFiles[activeFile]
            ? activeFile
            : getDefaultActiveFile(nextFiles, Object.keys(nextFiles)[0]),
        }
      })
    },

    deletePath: (path) => {
      const normalizedPath = normalizePath(path)

      if (!normalizedPath) {
        return
      }

      set((state) => {
        const nextFiles = Object.fromEntries(
          Object.entries(state.files).filter(
            ([filePath]) =>
              filePath !== normalizedPath && !filePath.startsWith(`${normalizedPath}/`),
          ),
        ) as FileMap
        const nextFolders = state.folders.filter(
          (folder) => folder !== normalizedPath && !folder.startsWith(`${normalizedPath}/`),
        )
        const activeFileStillExists = Boolean(nextFiles[state.activeFile])
        const nextActiveFile = activeFileStillExists
          ? state.activeFile
          : getDefaultActiveFile(nextFiles, Object.keys(nextFiles)[0])

        return {
          files: nextFiles,
          folders: nextFolders,
          activeFile: nextActiveFile,
        }
      })
    },

    run: async () => {
      set({ isRunning: true })

      try {
        await executionEngine.run(get().files, get().activeFile)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        get().appendConsoleLine(`[error] ${message}`)
      } finally {
        set({ isRunning: false })
      }
    },

    reset: async () => {
      const restoredFiles: FileMap = cloneFileMap(get().initialFiles)

      set({
        files: restoredFiles,
        folders: [...get().initialFolders],
        activeFile: get().initialActiveFile,
        consoleLines: [],
        previewUrl: null,
        isRunning: false,
        formatRequestId: 0,
      })

      try {
        await executionEngine.reset(restoredFiles)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        get().appendConsoleLine(`[error] ${message}`)
      }
    },

    requestFormat: () => {
      set((state) => ({ formatRequestId: state.formatRequestId + 1 }))
    },

    clearConsole: () => set({ consoleLines: [] }),

    appendConsoleLine: (line) => {
      set((state) => ({
        consoleLines: [...state.consoleLines, line],
      }))
    },

    setPreviewUrl: (url) => set({ previewUrl: url }),
  }))
}

function normalizePath(path: string): string {
  const trimmed = path.trim().replaceAll('\\', '/').replace(/\/+/g, '/')

  if (!trimmed || trimmed === '/') {
    return ''
  }

  return trimmed.startsWith('/') ? trimmed.replace(/\/$/, '') : `/${trimmed.replace(/\/$/, '')}`
}

function normalizeFolders(folders: string[]): string[] {
  return mergeFolders([], folders.map(normalizePath).filter(Boolean))
}

function mergeFolders(currentFolders: string[], nextFolders: string[]): string[] {
  return Array.from(new Set([...currentFolders, ...nextFolders.map(normalizePath).filter(Boolean)]))
    .sort((first, second) => first.localeCompare(second))
}

function getParentFolders(path: string): string[] {
  const parts = normalizePath(path).split('/').filter(Boolean)

  return parts.slice(0, -1).map((_, index) => `/${parts.slice(0, index + 1).join('/')}`)
}

function hasChildren(state: IDEStore, path: string): boolean {
  return (
    Object.keys(state.files).some((filePath) => filePath.startsWith(`${path}/`)) ||
    state.folders.some((folder) => folder.startsWith(`${path}/`))
  )
}

function getLanguageFromPath(path: string) {
  if (path.endsWith('.html')) return 'html'
  if (path.endsWith('.css')) return 'css'
  if (path.endsWith('.ts')) return 'typescript'
  if (path.endsWith('.tsx')) return 'tsx'
  if (path.endsWith('.jsx')) return 'jsx'
  if (path.endsWith('.js')) return 'javascript'
  if (path.endsWith('.json')) return 'json'

  return 'plaintext'
}
