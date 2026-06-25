export function LessonPager({ isFirstPage, isLastPage, onNext, onPrevious }) {
  return (
    <div className="lesson-pager">
      <button
        type="button"
        className="lesson-pager-button lesson-pager-button--secondary"
        disabled={isFirstPage}
        onClick={onPrevious}
      >
        Previous
      </button>
      <button
        type="button"
        className="lesson-pager-button lesson-pager-button--primary"
        disabled={isLastPage}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  )
}
