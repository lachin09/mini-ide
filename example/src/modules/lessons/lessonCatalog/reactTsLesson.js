export const reactTsLesson = {
  id: 'react-ts',
  title: 'React with TypeScript',
  summary: 'Add clear types to component props.',
  engine: 'react-ts',
  activeFile: '/src/App.tsx',
  showFiles: true,
  showPreview: true,
  pages: [
    {
      title: 'TypeScript documents component inputs',
      body: [
        'React with TypeScript lets you describe the shape of props. This catches mistakes early and makes components easier to use.',
        'A prop type should describe what the component needs, not every possible field in your app.',
      ],
      example: 'type BadgeProps = {\n  label: string\n}\n\nfunction Badge({ label }: BadgeProps) {\n  return <span>{label}</span>\n}',
    },
    {
      title: 'Types protect reuse',
      body: [
        'When a component is reused, TypeScript checks that each caller passes the right props. Missing required props and wrong value types become editor errors.',
        'Use simple types first: string, number, boolean, arrays, and small object shapes.',
      ],
      example: 'type User = {\n  name: string\n  points: number\n}',
    },
    {
      title: 'Practice',
      body: ['Type the props for a ProfileCard component and render two profiles.'],
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
      code: 'type ProfileCardProps = {\n  name: string\n  role: string\n}\n\nfunction ProfileCard({ name, role }: ProfileCardProps) {\n  return (\n    <article className="rounded border border-slate-300 p-4">\n      <h2 className="text-xl font-bold">{name}</h2>\n      <p>{role}</p>\n    </article>\n  )\n}\n\nexport default function App() {\n  return (\n    <main className="grid gap-4 p-6">\n      <ProfileCard name="Nigar" role="Frontend learner" />\n      <ProfileCard name="Murad" role="React learner" />\n    </main>\n  )\n}',
    },
  },
}
