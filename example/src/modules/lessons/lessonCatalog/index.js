import { cssLesson } from './cssLesson'
import { htmlLesson } from './htmlLesson'
import { javascriptLesson } from './javascriptLesson'
import { jsxLesson } from './jsxLesson'
import { reactLesson } from './reactLesson'
import { reactTsLesson } from './reactTsLesson'
import { tailwindLesson } from './tailwindLesson'
import { tsxLesson } from './tsxLesson'
import { typescriptLesson } from './typescriptLesson'

// A lesson config is the single source of truth for what the student sees.
// Add a new topic by creating one more lesson file and adding it to this list.
export const lessons = [
  htmlLesson,
  cssLesson,
  javascriptLesson,
  typescriptLesson,
  jsxLesson,
  reactLesson,
  reactTsLesson,
  tsxLesson,
  tailwindLesson,
]
