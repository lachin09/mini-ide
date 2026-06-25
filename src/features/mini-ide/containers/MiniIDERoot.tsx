import { useEffect, useMemo, useRef } from 'react'

import { createExecutionEngine } from '../../../core/ide/engines/createExecutionEngine'
import type { ExecutionEngine } from '../../../core/ide/interfaces/ExecutionEngine'
import type { MiniIDEOptions } from '../../../core/ide/models/ideTypes'
import { MiniIDEContext } from './MiniIDEContext'
import { createIDEStore } from '../store/createIDEStore'

export type MiniIDERootProps = MiniIDEOptions & {
  children: React.ReactNode
  autoRun?: boolean
  executionEngine?: ExecutionEngine
}

export function MiniIDERoot({
  activeFile,
  autoRun = false,
  children,
  engine,
  executionEngine,
  files,
  folders,
}: MiniIDERootProps) {
  const engineRef = useRef<ExecutionEngine>(executionEngine ?? createExecutionEngine(engine))
  const destroyTimerRef = useRef<number | null>(null)
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
    if (destroyTimerRef.current !== null) {
      window.clearTimeout(destroyTimerRef.current)
      destroyTimerRef.current = null
    }

    const unsubscribeConsole = currentEngine.onConsole((line) => {
      store.getState().appendConsoleLine(line)
    })
    const unsubscribePreview = currentEngine.onPreview((url) => {
      store.getState().setPreviewUrl(url)
    })
    let didCancel = false

    void currentEngine.initialize(store.getState().files).then(() => {
      if (!didCancel && autoRun) {
        void store.getState().run()
      }
    })

    return () => {
      didCancel = true
      unsubscribeConsole()
      unsubscribePreview()
      destroyTimerRef.current = window.setTimeout(() => {
        destroyTimerRef.current = null
        void currentEngine.destroy()
      }, 0)
    }
  }, [autoRun])

  return (
    <MiniIDEContext.Provider value={contextValue}>
      {children}
    </MiniIDEContext.Provider>
  )
}
