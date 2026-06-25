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
  run: () => Promise<void>
  reset: () => Promise<void>
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
}: CreateIDEStoreInput) {
  const normalizedFiles = normalizeFileMap(files)
  const initialActiveFile = getDefaultActiveFile(normalizedFiles, activeFile)
  const initialFiles = cloneFileMap(normalizedFiles)

  return createStore<IDEStore>((set, get) => ({
    files: normalizedFiles,
    initialFiles,
    activeFile: initialActiveFile,
    initialActiveFile,
    consoleLines: [],
    isRunning: false,
    previewUrl: null,

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

    run: async () => {
      set({ isRunning: true })

      try {
        await executionEngine.run(get().files)
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
        activeFile: get().initialActiveFile,
        consoleLines: [],
        previewUrl: null,
        isRunning: false,
      })

      try {
        await executionEngine.reset(restoredFiles)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        get().appendConsoleLine(`[error] ${message}`)
      }
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
