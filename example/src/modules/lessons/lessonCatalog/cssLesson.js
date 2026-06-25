export const cssLesson = {
  id: 'css',
  title: 'CSS selectors',
  summary: 'Style HTML by selecting elements precisely.',
  engine: 'html',
  activeFile: '/styles.css',
  showFiles: true,
  showPreview: true,
  pages: [
    {
      title: 'CSS changes presentation',
      body: [
        'CSS controls color, spacing, size, layout, borders, and responsive behavior. HTML says what the content is; CSS says how it should look.',
        'A rule has a selector and declarations. The selector chooses elements. The declarations define visual changes.',
      ],
      example: 'h1 {\n  color: royalblue;\n  font-size: 32px;\n}',
    },
    {
      title: 'Classes are reusable hooks',
      body: [
        'Element selectors affect every matching tag. Class selectors target only elements with that class, which makes your styles easier to reuse.',
        'Use class names that describe purpose or role. Keep your selectors simple before reaching for complicated combinations.',
      ],
      example: '.card {\n  padding: 24px;\n  border: 1px solid #d1d5db;\n  border-radius: 8px;\n}',
    },
    {
      title: 'Practice',
      body: ['Style the card. Change the heading color, add spacing, and make the button feel clickable.'],
    },
  ],
  files: {
    '/index.html': {
      path: '/index.html',
      language: 'html',
      code: '<section class="card">\n  <h1>CSS practice</h1>\n  <p>Selectors connect styles to HTML.</p>\n  <button class="action">Save</button>\n</section>',
    },
    '/styles.css': {
      path: '/styles.css',
      language: 'css',
      code: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 32px;\n}\n\n.card {\n  max-width: 360px;\n}\n\n.action {\n  cursor: pointer;\n}',
    },
  },
}
