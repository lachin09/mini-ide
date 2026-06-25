import type { FileMap } from '../models/ideTypes'

export interface ExecutionEngine {
  initialize(files: FileMap): Promise<void>

  run(files?: FileMap): Promise<void>

  reset(files?: FileMap): Promise<void>

  destroy(): Promise<void>

  onConsole(callback: (line: string) => void): () => void

  onPreview(callback: (url: string | null) => void): () => void
}
