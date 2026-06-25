import type { FileMap, IDEFile, IDEFileLanguage } from '../models/ideTypes'

const languageByExtension: Record<string, IDEFileLanguage> = {
  css: 'css',
  html: 'html',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
}

export function cloneFileMap(files: FileMap): FileMap {
  return Object.fromEntries(
    Object.entries(files).map(([path, file]) => [path, { ...file }]),
  )
}

export function getDefaultActiveFile(files: FileMap, requestedPath?: string): string {
  if (requestedPath && files[requestedPath]) {
    return requestedPath
  }

  return Object.keys(files)[0] ?? ''
}

export function inferFileLanguage(path: string): IDEFileLanguage {
  const extension = path.split('.').pop()?.toLowerCase() ?? ''

  return languageByExtension[extension] ?? 'plaintext'
}

export function normalizeFile(path: string, file: IDEFile): IDEFile {
  return {
    ...file,
    path,
    language: file.language ?? inferFileLanguage(path),
  }
}

export function normalizeFileMap(files: FileMap): FileMap {
  return Object.fromEntries(
    Object.entries(files).map(([path, file]) => [path, normalizeFile(path, file)]),
  )
}
