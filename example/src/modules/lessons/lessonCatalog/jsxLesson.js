export const jsxLesson = {
  id: 'jsx',
  title: 'JSX markup',
  summary: 'Write UI markup inside JavaScript expressions.',
  engine: 'react',
  activeFile: '/src/App.jsx',
  showFiles: true,
  showPreview: true,
  pages: [
    {
      title: 'JSX looks like HTML but is JavaScript',
      body: [
        'JSX lets React components return UI. It looks like HTML, but it is transformed into JavaScript before it runs.',
        'Because JSX is JavaScript, use className instead of class, close every tag, and wrap multiple sibling elements in one parent.',
      ],
      example: 'export default function App() {\n  return <h1 className="title">Hello JSX</h1>\n}',
    },
    {
      title: 'Use braces for dynamic values',
      body: [
        'Curly braces let you place JavaScript expressions inside JSX. Use them for variables, calculations, function calls, and conditional output.',
        'Keep JSX readable. If an expression becomes long, calculate it above the return statement.',
      ],
      example: 'const name = "Ayan"\nreturn <p>Welcome, {name}</p>',
    },
    {
      title: 'Practice',
      body: ['Render a greeting card with a name variable, a short message, and a list of two goals.'],
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
      code: 'export default function App() {\n  const name = "Ayan"\n\n  return (\n    <main className="p-6">\n      <h1>Hello, {name}</h1>\n      <p>Write JSX that mixes markup and JavaScript values.</p>\n    </main>\n  )\n}',
    },
  },
}
