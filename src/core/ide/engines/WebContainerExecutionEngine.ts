import type { ExecutionEngine } from '../interfaces/ExecutionEngine'
import type { FileMap } from '../models/ideTypes'

export class WebContainerExecutionEngine implements ExecutionEngine {
  async initialize(_files: FileMap): Promise<void> {
    throw new Error('WebContainerExecutionEngine is planned for Phase 4.')
  }

  async run(): Promise<void> {
    throw new Error('WebContainerExecutionEngine is planned for Phase 4.')
  }

  async reset(): Promise<void> {
    throw new Error('WebContainerExecutionEngine is planned for Phase 4.')
  }

  async destroy(): Promise<void> {}

  onConsole(): () => void {
    return () => {}
  }

  onPreview(): () => void {
    return () => {}
  }
}
