# `@academy/mini-ide`

Reusable Mini IDE components for programming lessons.

The library is an IDE kit, not one fixed IDE screen. Lesson authors choose the
parts they need: editor, files, preview, terminal, buttons, and layout.

Default components include basic inline styles, so the package does not require
your app to use Tailwind or any project-level stylesheet. Any `className`
examples below are optional consumer-side layout overrides.

```tsx
import { MiniIDE } from '@academy/mini-ide'

<MiniIDE.Root engine="html" files={files}>
  <MiniIDE.Editor />
  <MiniIDE.Preview />
  <MiniIDE.Terminal />
  <MiniIDE.Actions>
    <MiniIDE.RunButton />
    <MiniIDE.ResetButton />
  </MiniIDE.Actions>
</MiniIDE.Root>
```

## What It Supports

| Lesson type | Engine | Supported files |
| --- | --- | --- |
| HTML/CSS | `html` | `.html`, `.css` |
| JavaScript | `javascript` | `.html`, `.css`, `.js` |
| TypeScript | `typescript` | `.html`, `.css`, `.ts` |
| React JSX | `react` | `.jsx`, `.js`, `.css` |
| React TSX | `react-ts` | `.tsx`, `.ts`, `.css` |
| Tailwind | any browser engine | Tailwind classes in HTML/JSX/TSX |

Tailwind is injected into the sandboxed preview through the Tailwind browser
runtime.
TypeScript, JSX, and TSX are transpiled before running.

## Core Idea

Every IDE starts with `MiniIDE.Root`.

`Root` owns the files, selected file, terminal output, run state, preview URL,
and execution engine.

Everything inside `Root` is optional.

```tsx
<MiniIDE.Root engine="javascript" files={files}>
  {/* You decide what goes here */}
</MiniIDE.Root>
```

## File Format

Files are passed as a `FileMap`.

```tsx
import type { FileMap } from '@academy/mini-ide'

const files: FileMap = {
  '/index.html': {
    path: '/index.html',
    language: 'html',
    code: '<h1>Hello</h1>',
  },
  '/styles.css': {
    path: '/styles.css',
    language: 'css',
    code: 'h1 { color: royalblue; }',
  },
  '/main.js': {
    path: '/main.js',
    language: 'javascript',
    code: 'console.log("Hello from JS")',
  },
}
```

Supported `language` values:

```ts
'html' | 'css' | 'javascript' | 'typescript' | 'jsx' | 'tsx' | 'json' | 'plaintext'
```

## Public Components

```tsx
MiniIDE.Root
MiniIDE.Layout
MiniIDE.Files
MiniIDE.Editor
MiniIDE.Preview
MiniIDE.Terminal
MiniIDE.Actions
MiniIDE.RunButton
MiniIDE.ResetButton
MiniIDE.ClearConsoleButton
```

## Example App

This repository includes a cloned lesson module in `example/`. It demonstrates
how another app can keep lesson pages, lesson catalog data, navigation, and
practice rules outside the library while using MiniIDE for the editor runtime.

From this package directory, install dependencies once:

```bash
npm install
npm --prefix example install
```

Then run the example dev server:

```bash
npm run example:dev
```

Vite prints a local URL in the terminal, usually:

```txt
http://localhost:5173
```

Build the example:

```bash
npm run example:build
```

If port `5173` is already busy, Vite will print the next available port. Open
the exact URL from the terminal output.

The example Vite config aliases `@academy/mini-ide` to local source for package
development. A real consumer app should install the published package and import
from `@academy/mini-ide` directly.

## Share On GitHub

This package is ready to live as its own open-source repository. From the
`learning-app` project root, you can copy only the package folder into a new
repository:

```bash
cp -R packages/mini-ide ~/mini-ide
cd ~/mini-ide
git init
git add .
git commit -m "Initial open-source MiniIDE package"
```

Create an empty repository on GitHub, then connect it:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mini-ide.git
git branch -M main
git push -u origin main
```

Before pushing, check the package:

```bash
npm install
npm --prefix example install
npm run build
npm run example:build
npm pack --dry-run
```

The published npm package includes `dist`, `README.md`, and `LICENSE`. The
GitHub repository should keep `src`, `example`, docs, and config files so other
programmers can read and run the example.

## Enable Or Disable Parts

Because the API uses composition, programmers enable features by rendering them.
If they do not render a component, that feature is not shown.

Full IDE:

```tsx
<MiniIDE.Root engine="react-ts" files={files}>
  <MiniIDE.Layout>
    <MiniIDE.Files />
    <MiniIDE.Editor />
    <MiniIDE.Preview />
    <MiniIDE.Terminal />
    <MiniIDE.Actions>
      <MiniIDE.RunButton />
      <MiniIDE.ResetButton />
      <MiniIDE.ClearConsoleButton />
    </MiniIDE.Actions>
  </MiniIDE.Layout>
</MiniIDE.Root>
```

Editor only:

```tsx
<MiniIDE.Root engine="html" files={files}>
  <MiniIDE.Editor />
</MiniIDE.Root>
```

Editor plus preview, no terminal:

```tsx
<MiniIDE.Root engine="html" files={files}>
  <MiniIDE.Editor />
  <MiniIDE.Preview />
  <MiniIDE.RunButton />
</MiniIDE.Root>
```

Console lesson, no preview:

```tsx
<MiniIDE.Root engine="javascript" files={files}>
  <MiniIDE.Editor />
  <MiniIDE.Terminal />
  <MiniIDE.Actions>
    <MiniIDE.RunButton />
    <MiniIDE.ClearConsoleButton />
  </MiniIDE.Actions>
</MiniIDE.Root>
```

## HTML Lesson Example

```tsx
import { MiniIDE, type FileMap } from '@academy/mini-ide'

const files: FileMap = {
  '/index.html': {
    path: '/index.html',
    language: 'html',
    code: `<main class="card">
  <h1>Profile Card</h1>
  <p>Edit the CSS and run again.</p>
</main>`,
  },
  '/styles.css': {
    path: '/styles.css',
    language: 'css',
    code: `.card {
  max-width: 360px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 16px;
  background: #111827;
  color: white;
  font-family: system-ui;
}`,
  },
}

export function HtmlLesson() {
  return (
    <MiniIDE.Root engine="html" files={files} activeFile="/index.html">
      <MiniIDE.Layout className="grid-cols-1 grid-rows-[auto_1fr_20rem] md:grid-cols-2 md:grid-rows-[auto_1fr]">
        <MiniIDE.Actions className="md:col-span-2">
          <MiniIDE.RunButton />
          <MiniIDE.ResetButton />
        </MiniIDE.Actions>
        <MiniIDE.Editor />
        <MiniIDE.Preview />
      </MiniIDE.Layout>
    </MiniIDE.Root>
  )
}
```

## JavaScript Lesson Example

```tsx
const files = {
  '/index.html': {
    path: '/index.html',
    language: 'html',
    code: '<main>Open the terminal after running.</main>',
  },
  '/main.js': {
    path: '/main.js',
    language: 'javascript',
    code: `const scores = [92, 81, 74]
const average = scores.reduce((total, score) => total + score, 0) / scores.length

console.log('Average:', average)`,
  },
}

<MiniIDE.Root engine="javascript" files={files} activeFile="/main.js">
  <MiniIDE.Editor />
  <MiniIDE.Terminal />
  <MiniIDE.RunButton />
</MiniIDE.Root>
```

## TypeScript Lesson Example

```tsx
const files = {
  '/index.html': {
    path: '/index.html',
    language: 'html',
    code: '<main>TypeScript output appears in the terminal.</main>',
  },
  '/main.ts': {
    path: '/main.ts',
    language: 'typescript',
    code: `type Course = { title: string; minutes: number }

const course: Course = { title: 'TypeScript basics', minutes: 25 }
console.log(course.title, course.minutes)`,
  },
}

<MiniIDE.Root engine="typescript" files={files} activeFile="/main.ts">
  <MiniIDE.Editor />
  <MiniIDE.Terminal />
  <MiniIDE.RunButton />
</MiniIDE.Root>
```

## React TSX Lesson Example

React lessons should normally include an entry file such as `/src/main.tsx`.

```tsx
const files = {
  '/src/main.tsx': {
    path: '/src/main.tsx',
    language: 'tsx',
    code: `import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)`,
  },
  '/src/App.tsx': {
    path: '/src/App.tsx',
    language: 'tsx',
    code: `import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold">Count: {count}</h1>
      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => {
          setCount(count + 1)
          console.log('Clicked')
        }}
      >
        Increment
      </button>
    </main>
  )
}`,
  },
}

<MiniIDE.Root engine="react-ts" files={files} activeFile="/src/App.tsx">
  <MiniIDE.Files />
  <MiniIDE.Editor />
  <MiniIDE.Preview />
  <MiniIDE.Terminal />
  <MiniIDE.RunButton />
</MiniIDE.Root>
```

## Presets

Presets are ready-made layouts. They are useful for common lessons.

```tsx
import {
  JavaScriptLessonIDE,
  HtmlLessonIDE,
  ReactLessonIDE,
} from '@academy/mini-ide'

<JavaScriptLessonIDE files={files} />
<HtmlLessonIDE files={files} />
<ReactLessonIDE files={files} />
```

Presets are only wrappers around the same compound components. Use `MiniIDE.Root`
directly when you need a custom layout.

## Responsive Layouts

The default presets are mobile-first:

- on phones, panels stack vertically;
- on tablets and desktops, panels become multi-column IDE layouts;
- panels use scroll containers and `min-w-0` to avoid horizontal overflow.

For custom layouts, pass Tailwind classes to `MiniIDE.Layout`:

```tsx
<MiniIDE.Layout className="grid-cols-1 md:grid-cols-[12rem_1fr_1fr]">
  <MiniIDE.Files />
  <MiniIDE.Editor />
  <MiniIDE.Preview />
</MiniIDE.Layout>
```

## State And Hooks

Each `MiniIDE.Root` creates an isolated Zustand store. Multiple IDEs can exist on
the same page without sharing state.

Use `useMiniIDESelector` to build your own UI:

```tsx
import { useMiniIDESelector } from '@academy/mini-ide'

function MyRunButton() {
  const run = useMiniIDESelector((state) => state.run)
  const isRunning = useMiniIDESelector((state) => state.isRunning)

  return (
    <button disabled={isRunning} onClick={() => void run()}>
      {isRunning ? 'Running...' : 'Run lesson'}
    </button>
  )
}
```

Useful state:

```ts
state.files
state.initialFiles
state.activeFile
state.consoleLines
state.isRunning
state.previewUrl
```

Useful actions:

```ts
state.setFile(path, code)
state.setActiveFile(path)
state.run()
state.reset()
state.clearConsole()
```

## Reset Behavior

`ResetButton` restores:

- original files;
- original active file;
- terminal output;
- preview state;
- running state.

This makes lesson reset deterministic.

## Security

Student code does not run in the parent application window.

The preview uses a sandboxed iframe:

```tsx
<iframe sandbox="allow-scripts" />
```

Important decisions:

- no `allow-same-origin`, so the iframe gets an opaque origin;
- iframe code cannot read parent DOM, cookies, or localStorage;
- console output is forwarded through `postMessage`;
- each engine instance uses a unique channel id;
- generated preview URLs are revoked when replaced or destroyed.

Do not put secrets in lesson files. Browser code is visible to students.

## Engine Architecture

The UI depends on an execution engine interface:

```ts
interface ExecutionEngine {
  initialize(files: FileMap): Promise<void>
  run(files?: FileMap): Promise<void>
  reset(files?: FileMap): Promise<void>
  destroy(): Promise<void>
  onConsole(callback: (line: string) => void): () => void
  onPreview(callback: (url: string | null) => void): () => void
}
```

Current engines:

- `HtmlExecutionEngine`: HTML, CSS, Tailwind, JavaScript, TypeScript.
- `ReactExecutionEngine`: React, JSX, TSX, CSS, Tailwind, local imports.
- `WebContainerExecutionEngine`: reserved for future Node.js lessons.

You can inject a custom engine:

```tsx
<MiniIDE.Root engine="html" files={files} executionEngine={myEngine}>
  <MiniIDE.Editor />
  <MiniIDE.RunButton />
</MiniIDE.Root>
```

## Folder Structure

```txt
src/
  core/
    ide/
      models/          Domain types.
      interfaces/      Execution engine contract.
      services/        File-map and transpilation utilities.
      engines/         Runtime implementations.
  features/
    mini-ide/
      components/      Default UI blocks.
      containers/      Root provider and context.
      hooks/           Headless hooks.
      store/           Zustand store factory.
  index.ts             Public export surface.
```

## Production Notes

- Build with `npm run build` before publishing.
- React and React DOM are peer dependencies; Monaco, Zustand, and TypeScript are
  runtime dependencies.
- TypeScript is lazy-loaded only for TS/TSX lessons.
- For large production React lessons, a Sandpack-backed engine can be added
  behind the same `ExecutionEngine` interface.
- For future Node.js lessons, implement `WebContainerExecutionEngine`.
- For Supabase lessons, inject dependencies and public environment values through
  root options. Never expose private service keys in browser lessons.
