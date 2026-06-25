export const htmlLesson = {
  id: 'html',
  title: 'HTML elements',
  summary: 'Build the document structure that browsers read.',
  engine: 'html',
  activeFile: '/index.html',
  showFiles: false,
  showPreview: true,
  pages: [
    {
      title: 'HTML describes meaning',
      body: [
        'HTML is not for decoration. It gives meaning to content: headings, paragraphs, links, images, lists, buttons, forms, and page sections.',
        'A browser reads your tags and builds a document tree. Good HTML makes the page easier to style, easier to access, and easier for search engines to understand.',
      ],
      example: '<h1>Profile</h1>\n<p>My name is Leyla.</p>\n<button>Follow</button>',
    },
    {
      title: 'Use tags for their job',
      body: [
        'Use one main heading for the page topic. Use paragraphs for text. Use lists when order or grouping matters. Use buttons for actions and links for navigation.',
        'When the tag matches the job, your page behaves better before you write a single line of CSS or JavaScript.',
      ],
      example: '<section>\n  <h2>Today tasks</h2>\n  <ul>\n    <li>Read HTML</li>\n    <li>Write markup</li>\n  </ul>\n</section>',
    },
    {
      title: 'Practice',
      body: [
        'Create a small profile card. Include a heading, one paragraph, a list of skills, and one button.',
      ],
    },
  ],
  files: {
    '/index.html': {
      path: '/index.html',
      language: 'html',
      code: '<section class="p-6">\n  <h1>My profile</h1>\n  <p>I am learning frontend development.</p>\n\n  <h2>Skills</h2>\n  <ul>\n    <li>HTML</li>\n    <li>CSS</li>\n  </ul>\n\n  <button>Contact me</button>\n</section>',
    },
  },
}
