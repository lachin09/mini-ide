import { useEffect, useMemo, useRef } from 'react'

import { createExecutionEngine } from '../../../core/ide/engines/createExecutionEngine'
import type { ExecutionEngine } from '../../../core/ide/interfaces/ExecutionEngine'
import type { MiniIDEOptions } from '../../../core/ide/models/ideTypes'
import { MiniIDEContext } from './MiniIDEContext'
import { createIDEStore } from '../store/createIDEStore'

export type MiniIDERootProps = MiniIDEOptions & {
  children: React.ReactNode
  executionEngine?: ExecutionEngine
}

export function MiniIDERoot({
  activeFile,
  children,
  engine,
  executionEngine,
  files,
  folders,
}: MiniIDERootProps) {
  const engineRef = useRef<ExecutionEngine>(executionEngine ?? createExecutionEngine(engine))
  const storeRef = useRef(
    createIDEStore({
      activeFile,
      engine,
      executionEngine: engineRef.current,
      files,
      folders,
    }),
  )

  const contextValue = useMemo(
    () => ({
      executionEngine: engineRef.current,
      store: storeRef.current,
    }),
    [],
  )

  useEffect(() => {
    const store = storeRef.current
    const currentEngine = engineRef.current
    const unsubscribeConsole = currentEngine.onConsole((line) => {
      store.getState().appendConsoleLine(line)
    })
    const unsubscribePreview = currentEngine.onPreview((url) => {
      store.getState().setPreviewUrl(url)
    })

    void currentEngine.initialize(store.getState().files)

    return () => {
      unsubscribeConsole()
      unsubscribePreview()
      void currentEngine.destroy()
    }
  }, [])

  return (
    <MiniIDEContext.Provider value={contextValue}>
      {children}
    </MiniIDEContext.Provider>
  )
}
