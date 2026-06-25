import { createContext, useContext } from 'react'
import type { StoreApi } from 'zustand'
import { useStore } from 'zustand'

import type { ExecutionEngine } from '../../../core/ide/interfaces/ExecutionEngine'
import type { IDEStore } from '../store/createIDEStore'

export type MiniIDEContextValue = {
  executionEngine: ExecutionEngine
  store: StoreApi<IDEStore>
}

export const MiniIDEContext = createContext<MiniIDEContextValue | null>(null)

export function useMiniIDEContext(): MiniIDEContextValue {
  const context = useContext(MiniIDEContext)

  if (!context) {
    throw new Error('MiniIDE components must be rendered inside <MiniIDE.Root>.')
  }

  return context
}

export function useMiniIDESelector<T>(selector: (state: IDEStore) => T): T {
  return useStore(useMiniIDEContext().store, selector)
}
