# Contributing

Thanks for helping improve MiniIDE.

## Local Setup

```bash
npm install
npm --prefix example install
npm run build
npm run example:build
```

## Development Flow

- Keep public exports in `src/index.ts`.
- Keep browser execution logic behind the `ExecutionEngine` interface.
- Prefer composable components over one fixed IDE layout.
- Do not add app-specific imports or aliases to package source.
- Run `npm run build` before opening a pull request.

## Example App

Use the example app to verify lesson-author workflows:

```bash
npm run example:dev
```
