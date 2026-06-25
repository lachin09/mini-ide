import { MiniIDEActions } from './components/MiniIDEActions'
import {
  MiniIDEClearConsoleButton,
  MiniIDEResetButton,
  MiniIDERunButton,
} from './components/MiniIDEButtons'
import { MiniIDEEditor } from './components/MiniIDEEditor'
import { MiniIDEFiles } from './components/MiniIDEFiles'
import { MiniIDELayout } from './components/MiniIDELayout'
import { MiniIDEPreview } from './components/MiniIDEPreview'
import { MiniIDETerminal } from './components/MiniIDETerminal'
import { MiniIDERoot } from './containers/MiniIDERoot'

export const MiniIDE = {
  Root: MiniIDERoot,
  Layout: MiniIDELayout,
  Files: MiniIDEFiles,
  Editor: MiniIDEEditor,
  Preview: MiniIDEPreview,
  Terminal: MiniIDETerminal,
  Actions: MiniIDEActions,
  RunButton: MiniIDERunButton,
  ResetButton: MiniIDEResetButton,
  ClearConsoleButton: MiniIDEClearConsoleButton,
}
