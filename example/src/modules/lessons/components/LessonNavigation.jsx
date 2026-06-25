export function LessonNavigation({ activeLessonId, lessons, onSelectLesson }) {
  return (
    <aside className="space-y-2">
      {lessons.map((lesson) => (
        <button
          key={lesson.id}
          type="button"
          className={`lesson-nav-button ${
            lesson.id === activeLessonId ? 'lesson-nav-button--active' : ''
          }`}
          onClick={() => onSelectLesson(lesson.id)}
        >
          <span className="lesson-nav-title">{lesson.title}</span>
          <span className="lesson-nav-summary">{lesson.summary}</span>
        </button>
      ))}
    </aside>
  )
}
