import type { ExecutionEngine } from '../interfaces/ExecutionEngine'
import type { FileMap } from '../models/ideTypes'
import { transpileExecutableFile } from '../services/transpileCode'

export class ReactExecutionEngine implements ExecutionEngine {
  private files: FileMap = {}
  private previewUrl: string | null = null
  private readonly channelId = crypto.randomUUID()
  private readonly consoleCallbacks = new Set<(line: string) => void>()
  private readonly previewCallbacks = new Set<(url: string | null) => void>()
  private readonly handleMessage = (
    event: MessageEvent<{
      channelId?: string
      level?: 'log' | 'warn' | 'error' | 'info'
      values?: string[]
    }>,
  ) => {
    if (event.data?.channelId !== this.channelId) {
      return
    }

    const level = event.data.level ?? 'log'
    const message = event.data.values?.join(' ') ?? ''
    this.emitConsole(level === 'log' ? message : `[${level}] ${message}`)
  }

  async initialize(files: FileMap): Promise<void> {
    this.files = files
    window.addEventListener('message', this.handleMessage)
  }

  async run(files = this.files): Promise<void> {
    this.files = files
    this.revokeUrls()

    const documentSource = await this.createDocument(files)
    const blob = new Blob([documentSource], { type: 'text/html' })
    this.previewUrl = URL.createObjectURL(blob)
    this.emitPreview(this.previewUrl)
  }

  async reset(files = this.files): Promise<void> {
    this.files = files
    this.revokeUrls()
    this.emitPreview(null)
  }

  async destroy(): Promise<void> {
    window.removeEventListener('message', this.handleMessage)
    this.revokeUrls()
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

  private async createDocument(files: FileMap): Promise<string> {
    const moduleCache = new Map<string, string>()
    const entryPath = this.getEntryPath(files)
    const entryUrl = entryPath
      ? await this.createModuleDataUrl(entryPath, files, moduleCache)
      : null
    const css = Object.values(files)
      .filter((file) => file.language === 'css' || file.path.endsWith('.css'))
      .map((file) => file.code)
      .join('\n')

    if (!entryUrl) {
      this.emitConsole('[error] React entry file was not found.')
    }

    return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <script type="importmap">
      {
        "imports": {
          "react": "https://esm.sh/react@19.2.3",
          "react-dom/client": "https://esm.sh/react-dom@19.2.3/client",
          "react/jsx-runtime": "https://esm.sh/react@19.2.3/jsx-runtime"
        }
      }
    </script>
    <style>${css}</style>
  </head>
  <body>
    <div id="root"></div>
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
      window.addEventListener('unhandledrejection', (event) => {
        window.parent.postMessage({
          channelId: __miniIdeChannelId,
          level: 'error',
          values: [event.reason?.message ?? String(event.reason)]
        }, '*');
      });
    </script>
    ${entryUrl ? `<script type="module" src="${entryUrl}"></script>` : ''}
  </body>
</html>`
  }

  private async createModuleDataUrl(
    path: string,
    files: FileMap,
    cache: Map<string, string>,
  ): Promise<string | null> {
    const cachedUrl = cache.get(path)

    if (cachedUrl) {
      return cachedUrl
    }

    const file = files[path]

    if (!file) {
      return null
    }

    let source = await transpileExecutableFile(file)
    source = source.replace(/^\s*import\s+['"][^'"]+\.css['"];?\s*$/gm, '')

    const importReplacements = new Map<string, string>()
    const importPattern = /(?:from\s+|import\s+)['"](\.[^'"]+)['"]/g
    const matches = [...source.matchAll(importPattern)]

    for (const match of matches) {
      const specifier = match[1]
      const resolvedPath = this.resolveImportPath(path, specifier, files)

      if (!resolvedPath) {
        continue
      }

      const resolvedUrl = await this.createModuleDataUrl(resolvedPath, files, cache)

      if (resolvedUrl) {
        importReplacements.set(specifier, resolvedUrl)
      }
    }

    for (const [specifier, resolvedUrl] of importReplacements) {
      source = source.replaceAll(`from '${specifier}'`, `from '${resolvedUrl}'`)
      source = source.replaceAll(`from "${specifier}"`, `from '${resolvedUrl}'`)
      source = source.replaceAll(`import '${specifier}'`, `import '${resolvedUrl}'`)
      source = source.replaceAll(`import "${specifier}"`, `import '${resolvedUrl}'`)
    }

    const dataUrl = `data:application/javascript;charset=utf-8,${encodeURIComponent(source)}`
    cache.set(path, dataUrl)

    return dataUrl
  }

  private getEntryPath(files: FileMap): string {
    return (
      ['/src/main.tsx', '/src/main.jsx', '/main.tsx', '/main.jsx', '/src/App.tsx', '/src/App.jsx']
        .find((path) => files[path]) ?? Object.keys(files).find((path) => /\.(tsx|jsx|ts|js)$/.test(path)) ?? ''
    )
  }

  private resolveImportPath(fromPath: string, specifier: string, files: FileMap): string | null {
    const fromParts = fromPath.split('/').slice(0, -1)
    const resolvedParts = [...fromParts]

    for (const part of specifier.split('/')) {
      if (!part || part === '.') {
        continue
      }

      if (part === '..') {
        resolvedParts.pop()
      } else {
        resolvedParts.push(part)
      }
    }

    const basePath = resolvedParts.join('/').startsWith('/')
      ? resolvedParts.join('/')
      : `/${resolvedParts.join('/')}`
    const candidates = [
      basePath,
      `${basePath}.ts`,
      `${basePath}.tsx`,
      `${basePath}.js`,
      `${basePath}.jsx`,
      `${basePath}/index.ts`,
      `${basePath}/index.tsx`,
      `${basePath}/index.js`,
      `${basePath}/index.jsx`,
    ]

    return candidates.find((path) => files[path]) ?? null
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

  private revokeUrls() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl)
      this.previewUrl = null
    }

  }
}
