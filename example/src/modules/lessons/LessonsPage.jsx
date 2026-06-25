import { useMemo, useState } from 'react'

import { LessonContent } from './components/LessonContent'
import { LessonNavigation } from './components/LessonNavigation'
import { LessonPager } from './components/LessonPager'
import { LessonPracticeIDE } from './components/LessonPracticeIDE'
import { lessons } from './lessonCatalog'

export const LessonsPage = () => {
  const [lessonId, setLessonId] = useState(lessons[0].id)
  const [pageIndex, setPageIndex] = useState(0)
  const lesson = useMemo(
    () => lessons.find((item) => item.id === lessonId) ?? lessons[0],
    [lessonId],
  )
  const currentPage = lesson.pages[pageIndex] ?? lesson.pages[0]
  const isPracticePage = pageIndex === lesson.pages.length - 1

  function selectLesson(nextLessonId) {
    setLessonId(nextLessonId)
    setPageIndex(0)
  }

  return (
    <div className="example-shell">
      <header className="example-header">
        <h1>MiniIDE lesson module example</h1>
        <p>
          This example app keeps lesson content in the host application and uses
          MiniIDE only for the practice workspace.
        </p>
      </header>

      <div className="lesson-page">
        <LessonNavigation
          activeLessonId={lesson.id}
          lessons={lessons}
          onSelectLesson={selectLesson}
        />

        <main className="lesson-main">
          <header className="lesson-header">
            <p>
              Page {pageIndex + 1} of {lesson.pages.length}
            </p>
            <h2>{lesson.title}</h2>
          </header>

          <LessonContent page={currentPage} />

          {isPracticePage ? <LessonPracticeIDE key={lesson.id} lesson={lesson} /> : null}

          <LessonPager
            isFirstPage={pageIndex === 0}
            isLastPage={isPracticePage}
            onPrevious={() => setPageIndex((current) => Math.max(current - 1, 0))}
            onNext={() =>
              setPageIndex((current) => Math.min(current + 1, lesson.pages.length - 1))
            }
          />
        </main>
      </div>
    </div>
  )
}
