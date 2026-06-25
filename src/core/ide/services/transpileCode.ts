import type { IDEFile } from '../models/ideTypes'

function shouldTranspile(file: IDEFile): boolean {
  return (
    file.language === 'typescript' ||
    file.language === 'tsx' ||
    file.language === 'jsx' ||
    file.path.endsWith('.ts') ||
    file.path.endsWith('.tsx') ||
    file.path.endsWith('.jsx')
  )
}

export async function transpileExecutableFile(file: IDEFile): Promise<string> {
  if (
    shouldTranspile(file)
  ) {
    const ts = await import('typescript')

    return ts.transpileModule(file.code, {
      compilerOptions: {
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText
  }

  return file.code
}
