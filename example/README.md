# MiniIDE Lesson Example

This example is a small lesson module built with `@academy/mini-ide`. It shows
how a host app can keep lesson content, lesson navigation, and IDE composition
outside the library.

## Run It

From the package root:

```bash
cd packages/mini-ide
npm run example:dev
```

Or from this folder:

```bash
npm install
npm run dev
```

The dev server prints the local URL, usually `http://localhost:5173`.

## What To Copy

- `src/modules/lessons/lessonCatalog`: one lesson config per topic.
- `src/modules/lessons/components/LessonPracticeIDE.jsx`: maps lesson config to
  MiniIDE components.
- `src/modules/lessons/LessonsPage.jsx`: coordinates selected lesson and page.

The example uses a Vite alias so `@academy/mini-ide` resolves to local package
source during development. In a real app, install the published package and
remove that alias.
