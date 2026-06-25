import type { ExecutionEngine } from '../interfaces/ExecutionEngine'
import type { FileMap } from '../models/ideTypes'
import { transpileExecutableFile } from '../services/transpileCode'

type ConsoleCallback = (line: string) => void
type PreviewCallback = (url: string | null) => void

type RunnerMessage = {
  channelId?: string
  level?: 'log' | 'warn' | 'error' | 'info'
  values?: string[]
}

export class HtmlExecutionEngine implements ExecutionEngine {
  private files: FileMap = {}
  private previewUrl: string | null = null
  private readonly channelId = crypto.randomUUID()
  private readonly consoleCallbacks = new Set<ConsoleCallback>()
  private readonly previewCallbacks = new Set<PreviewCallback>()
  private readonly handleMessage = (event: MessageEvent<RunnerMessage>) => {
    if (event.data?.channelId !== this.channelId) {
      return
    }

    const level = event.data.level ?? 'log'
    const values = event.data.values ?? []
    const message = values.join(' ')

    this.emitConsole(level === 'log' ? message : `[${level}] ${message}`)
  }

  async initialize(files: FileMap): Promise<void> {
    this.files = files
    window.addEventListener('message', this.handleMessage)
  }

  async run(files = this.files): Promise<void> {
    this.files = files
    this.revokePreviewUrl()

    const documentSource = await this.createDocument(files)
    const blob = new Blob([documentSource], { type: 'text/html' })
    this.previewUrl = URL.createObjectURL(blob)
    this.emitPreview(this.previewUrl)
  }

  async reset(files = this.files): Promise<void> {
    this.files = files
    this.revokePreviewUrl()
    this.emitPreview(null)
  }

  async destroy(): Promise<void> {
    window.removeEventListener('message', this.handleMessage)
    this.revokePreviewUrl()
    this.consoleCallbacks.clear()
    this.previewCallbacks.clear()
  }

  onConsole(callback: ConsoleCallback): () => void {
    this.consoleCallbacks.add(callback)

    return () => this.consoleCallbacks.delete(callback)
  }

  onPreview(callback: PreviewCallback): () => void {
    this.previewCallbacks.add(callback)

    return () => this.previewCallbacks.delete(callback)
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

  private revokePreviewUrl() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = null
    }
  }

  private async createDocument(files: FileMap): Promise<string> {
    const html = files['/index.html']?.code ?? '<div id="app"></div>'
    const css = Object.values(files)
      .filter((file) => file.language === 'css' || file.path.endsWith('.css'))
      .map((file) => file.code)
      .join('\n')
    const executableFiles = Object.values(files)
      .filter((file) =>
        ['javascript', 'typescript'].includes(file.language ?? '') ||
        file.path.endsWith('.js') ||
        file.path.endsWith('.ts')
      )
    const js = (await Promise.all(executableFiles.map((file) => transpileExecutableFile(file))))
      .join('\n')

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style>${css}</style>
  </head>
  <body>
    ${html}
    <script>
      const __miniIdeChannelId = ${JSON.stringify(this.channelId)};
      const __serialize = (value) => {
        if (typeof value === 'string') return value;
        try { return JSON.stringify(value); } catch { return String(value); }
      };
      for (const level of ['log', 'warn', 'error', 'info']) {
        const original = console[level].bind(console);
        console[level] = (...values) => {
          window.parent.postMessage({
            channelId: __miniIdeChannelId,
            level,
            values: values.map(__serialize)
          }, '*');
          original(...values);
        };
      }
      window.addEventListener('error', (event) => {
        window.parent.postMessage({
          channelId: __miniIdeChannelId,
          level: 'error',
          values: [event.message]
        }, '*');
      });
    </script>
    <script type="module">${js}</script>
  </body>
</html>`
  }
}
