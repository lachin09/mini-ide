import { useMiniIDESelector } from '../containers/MiniIDEContext'
import { MiniIDEButton } from './MiniIDEButton'

export function MiniIDERunButton() {
  const isRunning = useMiniIDESelector((state) => state.isRunning)
  const run = useMiniIDESelector((state) => state.run)

  return (
    <MiniIDEButton disabled={isRunning} onClick={() => void run()}>
      {isRunning ? 'Running...' : 'Run'}
    </MiniIDEButton>
  )
}

export function MiniIDEResetButton() {
  const reset = useMiniIDESelector((state) => state.reset)

  return (
    <MiniIDEButton onClick={() => void reset()}>
      Reset
    </MiniIDEButton>
  )
}

export function MiniIDEClearConsoleButton() {
  const clearConsole = useMiniIDESelector((state) => state.clearConsole)

  return (
    <MiniIDEButton onClick={clearConsole}>
      Clear Console
    </MiniIDEButton>
  )
}

export function MiniIDEFormatButton() {
  const requestFormat = useMiniIDESelector((state) => state.requestFormat)

  return (
    <MiniIDEButton onClick={requestFormat}>
      Format
    </MiniIDEButton>
  )
}
