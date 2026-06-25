export function LessonContent({ page }) {
  return (
    <section className="space-y-4">
      <h3>{page.title}</h3>
      {page.body.map((paragraph) => (
        <p key={paragraph}>
          {paragraph}
        </p>
      ))}
      {page.example ? (
        <pre className="lesson-example-code">
          <code>{page.example}</code>
        </pre>
      ) : null}
    </section>
  )
}
