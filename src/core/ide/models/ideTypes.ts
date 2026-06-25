export type IDEEngineType = 'html' | 'javascript' | 'typescript' | 'react' | 'react-ts' | 'node'

export type IDEFileLanguage =
  | 'html'
  | 'css'
  | 'javascript'
  | 'typescript'
  | 'jsx'
  | 'tsx'
  | 'json'
  | 'plaintext'

export type IDEFile = {
  path: string
  code: string
  language?: IDEFileLanguage
  readonly?: boolean
}

export type FileMap = Record<string, IDEFile>

export type IDEDependencies = Record<string, string>

export type IDEEnvironment = Record<string, string>

export type ConsoleLevel = 'log' | 'warn' | 'error' | 'info'

export type IDEConsoleEvent = {
  level: ConsoleLevel
  message: string
}

export type IDEState = {
  files: FileMap
  initialFiles: FileMap
  folders: string[]
  initialFolders: string[]
  activeFile: string
  initialActiveFile: string
  consoleLines: string[]
  isRunning: boolean
  previewUrl: string | null
}

export type MiniIDEOptions = {
  engine: IDEEngineType
  files: FileMap
  activeFile?: string
  folders?: string[]
  dependencies?: IDEDependencies
  env?: IDEEnvironment
}
