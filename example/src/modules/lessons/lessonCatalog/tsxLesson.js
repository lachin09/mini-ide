export const tsxLesson = {
  id: 'tsx',
  title: 'TSX expressions',
  summary: 'Combine typed values with JSX markup.',
  engine: 'react-ts',
  activeFile: '/src/App.tsx',
  showFiles: true,
  showPreview: true,
  pages: [
    {
      title: 'TSX is JSX with TypeScript',
      body: [
        'TSX lets a React component return JSX while TypeScript checks the values used inside it.',
        'The most useful habit is typing your data before mapping it into UI.',
      ],
      example: 'type Task = {\n  id: number\n  title: string\n  done: boolean\n}',
    },
    {
      title: 'Map typed arrays into UI',
      body: [
        'When an array has a type, TypeScript knows which fields exist on each item. That makes rendering lists safer.',
        'Always provide a stable key when rendering a list.',
      ],
      example: '{tasks.map((task) => (\n  <li key={task.id}>{task.title}</li>\n))}',
    },
    {
      title: 'Practice',
      body: ['Create a typed task list. Show the task title and whether it is done.'],
    },
  ],
  files: {
    '/src/main.tsx': {
      path: '/src/main.tsx',
      language: 'tsx',
      code: 'import { createRoot } from "react-dom/client"\nimport App from "./App.tsx"\n\ncreateRoot(document.getElementById("root")!).render(<App />)',
    },
    '/src/App.tsx': {
      path: '/src/App.tsx',
      language: 'tsx',
      code: 'type Task = {\n  id: number\n  title: string\n  done: boolean\n}\n\nconst tasks: Task[] = [\n  { id: 1, title: "Learn TSX", done: true },\n  { id: 2, title: "Render a list", done: false },\n]\n\nexport default function App() {\n  return (\n    <main className="p-6">\n      <h1 className="text-2xl font-bold">Tasks</h1>\n      <ul className="mt-4 grid gap-2">\n        {tasks.map((task) => (\n          <li key={task.id}>{task.title}: {task.done ? "done" : "not done"}</li>\n        ))}\n      </ul>\n    </main>\n  )\n}',
    },
  },
}
