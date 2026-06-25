export const reactLesson = {
  id: 'react',
  title: 'React components',
  summary: 'Split UI into reusable component functions.',
  engine: 'react',
  activeFile: '/src/App.jsx',
  showFiles: true,
  showPreview: true,
  pages: [
    {
      title: 'Components are UI functions',
      body: [
        'A React component is a function that returns JSX. Components let you split a screen into named, reusable pieces.',
        'Start component names with a capital letter. React treats lowercase tags as browser elements and capitalized tags as components.',
      ],
      example: 'function WelcomeCard() {\n  return <h2>Welcome back</h2>\n}',
    },
    {
      title: 'Props pass data in',
      body: [
        'Props are inputs to a component. They let the same component render different content without copying the whole component.',
        'Keep components small enough that their name explains what they render.',
      ],
      example: 'function Badge({ label }) {\n  return <span>{label}</span>\n}',
    },
    {
      title: 'Practice',
      body: ['Create a reusable CourseCard component and render it twice with different titles.'],
    },
  ],
  files: {
    '/src/main.jsx': {
      path: '/src/main.jsx',
      language: 'jsx',
      code: 'import { createRoot } from "react-dom/client"\nimport App from "./App.jsx"\n\ncreateRoot(document.getElementById("root")).render(<App />)',
    },
    '/src/App.jsx': {
      path: '/src/App.jsx',
      language: 'jsx',
      code: 'function CourseCard({ title, level }) {\n  return (\n    <article className="rounded border border-slate-300 p-4">\n      <h2 className="text-xl font-bold">{title}</h2>\n      <p>{level}</p>\n    </article>\n  )\n}\n\nexport default function App() {\n  return (\n    <main className="grid gap-4 p-6">\n      <CourseCard title="React components" level="Beginner" />\n      <CourseCard title="Props practice" level="Beginner" />\n    </main>\n  )\n}',
    },
  },
}
