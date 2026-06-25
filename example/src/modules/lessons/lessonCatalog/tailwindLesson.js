export const tailwindLesson = {
  id: 'tailwind',
  title: 'Tailwind CSS utilities',
  summary: 'Style directly with small utility classes.',
  engine: 'html',
  activeFile: '/index.html',
  showFiles: false,
  showPreview: true,
  pages: [
    {
      title: 'Utilities are single-purpose classes',
      body: [
        'Tailwind CSS gives you small classes for spacing, color, layout, borders, and typography. You compose them directly in your markup.',
        'Instead of writing a custom .card class first, you can build the design from utilities like p-6, rounded-lg, border, and text-xl.',
      ],
      example: '<div class="rounded-lg border p-6 shadow-sm">\n  <h1 class="text-2xl font-bold">Card</h1>\n</div>',
    },
    {
      title: 'Read classes left to right',
      body: [
        'A Tailwind class usually says exactly what it changes. For example, text-blue-600 changes text color, mt-4 adds margin-top, and grid creates a grid layout.',
        'Use utilities to make the current element clear. If the class list becomes noisy, split the UI into smaller elements or components.',
      ],
      example: '<button class="rounded-md bg-blue-600 px-4 py-2 text-white">\n  Save\n</button>',
    },
    {
      title: 'Practice',
      body: [
        'Style a pricing card using Tailwind utilities. Add spacing, border, rounded corners, a heading, price text, and a button.',
      ],
    },
  ],
  files: {
    '/index.html': {
      path: '/index.html',
      language: 'html',
      code: '<section class="mx-auto mt-10 max-w-sm rounded-lg border border-slate-200 p-6 shadow-sm">\n  <h1 class="text-2xl font-bold text-slate-900">Starter</h1>\n  <p class="mt-2 text-slate-600">A simple Tailwind pricing card.</p>\n  <p class="mt-6 text-4xl font-bold">$19</p>\n  <button class="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white">Choose plan</button>\n</section>',
    },
  },
}
