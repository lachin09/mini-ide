import { MiniIDEActions } from './components/MiniIDEActions'
import {
  MiniIDEClearConsoleButton,
  MiniIDEFormatButton,
  MiniIDEResetButton,
  MiniIDERunButton,
} from './components/MiniIDEButtons'
import { MiniIDEEditor } from './components/MiniIDEEditor'
import { MiniIDEFiles } from './components/MiniIDEFiles'
import { MiniIDELayout } from './components/MiniIDELayout'
import { MiniIDEPreview } from './components/MiniIDEPreview'
import { MiniIDEPlayground } from './components/MiniIDEPlayground'
import { MiniIDEResizeHandle } from './components/MiniIDEResizeHandle'
import { MiniIDETerminal } from './components/MiniIDETerminal'
import { MiniIDERoot } from './containers/MiniIDERoot'

export const MiniIDE = {
  Root: MiniIDERoot,
  Layout: MiniIDELayout,
  Playground: MiniIDEPlayground,
  Files: MiniIDEFiles,
  Editor: MiniIDEEditor,
  Preview: MiniIDEPreview,
  ResizeHandle: MiniIDEResizeHandle,
  Terminal: MiniIDETerminal,
  Actions: MiniIDEActions,
  RunButton: MiniIDERunButton,
  ResetButton: MiniIDEResetButton,
  ClearConsoleButton: MiniIDEClearConsoleButton,
  FormatButton: MiniIDEFormatButton,
}
