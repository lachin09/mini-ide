import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MiniIDE',
      fileName: 'mini-ide',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: [
        '@monaco-editor/react',
        'monaco-editor',
        'react',
        'react-dom',
        'react/jsx-runtime',
        'typescript',
        'zustand',
        'zustand/vanilla',
      ],
      output: {
        globals: {
          '@monaco-editor/react': 'MonacoEditorReact',
          'monaco-editor': 'MonacoEditor',
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'ReactJSXRuntime',
          typescript: 'ts',
          zustand: 'zustand',
          'zustand/vanilla': 'zustandVanilla',
        },
      },
    },
    sourcemap: true,
  },
})
