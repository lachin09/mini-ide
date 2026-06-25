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
  const didSetupRef = useRef(false)
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

  if (!didSetupRef.current) {
    didSetupRef.current = true
    const store = storeRef.current
    const currentEngine = engineRef.current

    currentEngine.onConsole((line) => {
      store.getState().appendConsoleLine(line)
    })
    currentEngine.onPreview((url) => {
      store.getState().setPreviewUrl(url)
    })

    void currentEngine.initialize(store.getState().files).then(() => {
      if (autoRun) {
        void store.getState().run()
      }
    })
  }

  useEffect(() => {
    const currentEngine = engineRef.current

    return () => {
      void currentEngine.destroy()
    }
  }, [])

  return (
    <MiniIDEContext.Provider value={contextValue}>
      {children}
    </MiniIDEContext.Provider>
  )
}
