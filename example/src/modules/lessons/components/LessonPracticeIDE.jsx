import { MiniIDE } from '@academy/mini-ide'

function getLessonLayout(lesson) {
  if (lesson.showPreview) {
    return lesson.showFiles
      ? 'lesson-ide lesson-ide--files-preview'
      : 'lesson-ide lesson-ide--preview'
  }

  if (lesson.showFiles) {
    return 'lesson-ide lesson-ide--files'
  }

  return 'lesson-ide'
}

function getActionClassName(lesson) {
  if (lesson.showPreview) {
    return lesson.showFiles
      ? 'lesson-ide-actions lesson-ide-actions--files-preview'
      : 'lesson-ide-actions lesson-ide-actions--preview'
  }

  return lesson.showFiles
    ? 'lesson-ide-actions lesson-ide-actions--files'
    : 'lesson-ide-actions'
}

export function LessonPracticeIDE({ lesson }) {
  return (
    <MiniIDE.Root activeFile={lesson.activeFile} engine={lesson.engine} files={lesson.files}>
      <MiniIDE.Layout className={getLessonLayout(lesson)}>
        <MiniIDE.Actions className={getActionClassName(lesson)}>
          <MiniIDE.RunButton />
          <MiniIDE.ResetButton />
          <MiniIDE.ClearConsoleButton />
        </MiniIDE.Actions>
        {lesson.showFiles && (
          <MiniIDE.Files className={lesson.showPreview ? 'lesson-ide-files--preview' : ''} />
        )}
        <MiniIDE.Editor />
        {lesson.showPreview ? (
          <MiniIDE.Preview className="lesson-ide-preview" />
        ) : (
          // Terminal-only lessons still need a hidden preview iframe because the
          // current execution engine runs browser JavaScript inside that iframe.
          <MiniIDE.Preview className="lesson-ide-hidden-runner" />
        )}
        <MiniIDE.Terminal className="lesson-ide-terminal" />
      </MiniIDE.Layout>
    </MiniIDE.Root>
  )
}
