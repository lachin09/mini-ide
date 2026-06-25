import type { FileMap } from '../../core/ide/models/ideTypes'
import { MiniIDE } from './publicApi'

export type LessonIDEPresetProps = {
  files: FileMap
  activeFile?: string
}

export function JavaScriptLessonIDE({ activeFile, files }: LessonIDEPresetProps) {
  return (
    <MiniIDE.Root activeFile={activeFile} engine="javascript" files={files}>
      <MiniIDE.Layout>
        <MiniIDE.Actions>
          <MiniIDE.RunButton />
          <MiniIDE.ResetButton />
          <MiniIDE.ClearConsoleButton />
        </MiniIDE.Actions>
        <MiniIDE.Files />
        <MiniIDE.Editor />
        <MiniIDE.Terminal />
      </MiniIDE.Layout>
    </MiniIDE.Root>
  )
}

export function HtmlLessonIDE({ activeFile, files }: LessonIDEPresetProps) {
  return (
    <MiniIDE.Root activeFile={activeFile} engine="html" files={files}>
      <MiniIDE.Layout>
        <MiniIDE.Actions>
          <MiniIDE.RunButton />
          <MiniIDE.ResetButton />
          <MiniIDE.ClearConsoleButton />
        </MiniIDE.Actions>
        <MiniIDE.Files />
        <MiniIDE.Editor />
        <MiniIDE.Preview />
        <MiniIDE.Terminal />
      </MiniIDE.Layout>
    </MiniIDE.Root>
  )
}

export function ReactLessonIDE({ activeFile, files }: LessonIDEPresetProps) {
  return (
    <MiniIDE.Root activeFile={activeFile} engine="react-ts" files={files}>
      <MiniIDE.Layout>
        <MiniIDE.Actions>
          <MiniIDE.RunButton />
          <MiniIDE.ResetButton />
          <MiniIDE.ClearConsoleButton />
        </MiniIDE.Actions>
        <MiniIDE.Files />
        <MiniIDE.Editor />
        <MiniIDE.Preview />
        <MiniIDE.Terminal />
      </MiniIDE.Layout>
    </MiniIDE.Root>
  )
}
