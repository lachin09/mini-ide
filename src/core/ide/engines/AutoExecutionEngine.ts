import type { ExecutionEngine } from '../interfaces/ExecutionEngine'
import type { FileMap } from '../models/ideTypes'
import { HtmlExecutionEngine } from './HtmlExecutionEngine'
import { ReactExecutionEngine } from './ReactExecutionEngine'

export class AutoExecutionEngine implements ExecutionEngine {
  private readonly htmlEngine = new HtmlExecutionEngine()
  private readonly reactEngine = new ReactExecutionEngine()
  private files: FileMap = {}
  private activeEngine: ExecutionEngine = this.htmlEngine
  private readonly consoleCallbacks = new Set<(line: string) => void>()
  private readonly previewCallbacks = new Set<(url: string | null) => void>()
  private didWireEngines = false

  async initialize(files: FileMap): Promise<void> {
    this.files = files

    if (!this.didWireEngines) {
      this.didWireEngines = true
      this.htmlEngine.onConsole((line) => this.emitConsole(line))
      this.reactEngine.onConsole((line) => this.emitConsole(line))
      this.htmlEngine.onPreview((url) => {
        if (this.activeEngine === this.htmlEngine) {
          this.emitPreview(url)
        }
      })
      this.reactEngine.onPreview((url) => {
        if (this.activeEngine === this.reactEngine) {
          this.emitPreview(url)
        }
      })
    }

    await Promise.all([this.htmlEngine.initialize(files), this.reactEngine.initialize(files)])
  }

  async run(files = this.files, activeFile?: string): Promise<void> {
    this.files = files
    this.activeEngine = this.detectEngine(files, activeFile)
    this.emitConsole(
      `Running ${activeFile ?? 'workspace'} with ${
        this.activeEngine === this.reactEngine ? 'React preview' : 'browser preview'
      }.`,
    )

    if (this.activeEngine === this.htmlEngine) {
      await this.reactEngine.reset(files)
    } else {
      await this.htmlEngine.reset(files)
    }

    await this.activeEngine.run(files, activeFile)
  }

  async reset(files = this.files): Promise<void> {
    this.files = files
    await Promise.all([
      this.htmlEngine.reset(files),
      this.reactEngine.reset(files),
    ])
    this.emitPreview(null)
  }

  async destroy(): Promise<void> {
    await Promise.all([
      this.htmlEngine.destroy(),
      this.reactEngine.destroy(),
    ])
    this.didWireEngines = false
    this.consoleCallbacks.clear()
    this.previewCallbacks.clear()
  }

  onConsole(callback: (line: string) => void): () => void {
    this.consoleCallbacks.add(callback)

    return () => this.consoleCallbacks.delete(callback)
  }

  onPreview(callback: (url: string | null) => void): () => void {
    this.previewCallbacks.add(callback)

    return () => this.previewCallbacks.delete(callback)
  }

  private detectEngine(files: FileMap, activeFile?: string): ExecutionEngine {
    if (activeFile && /\.(js|ts|html)$/.test(activeFile)) {
      return this.htmlEngine
    }

    if (activeFile && /\.(jsx|tsx)$/.test(activeFile)) {
      return this.reactEngine
    }

    const filePaths = Object.keys(files)

    if (
      filePaths.some((path) => /\.(jsx|tsx)$/.test(path)) ||
      filePaths.some((path) => /(^|\/)App\.(js|ts)$/.test(path))
    ) {
      return this.reactEngine
    }

    return this.htmlEngine
  }

  private emitConsole(line: string) {
    for (const callback of this.consoleCallbacks) {
      callback(line)
    }
  }

  private emitPreview(url: string | null) {
    for (const callback of this.previewCallbacks) {
      callback(url)
    }
  }
}
