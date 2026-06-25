import type { ExecutionEngine } from '../interfaces/ExecutionEngine'
import type { IDEEngineType } from '../models/ideTypes'
import { AutoExecutionEngine } from './AutoExecutionEngine'
import { HtmlExecutionEngine } from './HtmlExecutionEngine'
import { ReactExecutionEngine } from './ReactExecutionEngine'
import { WebContainerExecutionEngine } from './WebContainerExecutionEngine'

export function createExecutionEngine(engine: IDEEngineType): ExecutionEngine {
  if (engine === 'auto') {
    return new AutoExecutionEngine()
  }

  if (engine === 'html' || engine === 'javascript' || engine === 'typescript') {
    return new HtmlExecutionEngine()
  }

  if (engine === 'react' || engine === 'react-ts') {
    return new ReactExecutionEngine()
  }

  return new WebContainerExecutionEngine()
}
