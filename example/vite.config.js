import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // During package development the example consumes the local source.
      // After publishing, remove this alias and install @academy/mini-ide from npm.
      '@academy/mini-ide': resolve(currentDir, '../src'),
    },
  },
})
