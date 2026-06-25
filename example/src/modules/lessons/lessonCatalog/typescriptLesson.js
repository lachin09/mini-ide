export const typescriptLesson = {
  id: 'typescript',
  title: 'TypeScript basics',
  summary: 'Add types so JavaScript mistakes are easier to catch.',
  engine: 'typescript',
  activeFile: '/index.ts',
  showFiles: false,
  showPreview: false,
  pages: [
    {
      title: 'TypeScript is JavaScript with types',
      body: [
        'TypeScript lets you describe what kind of value a variable, parameter, or return value should have.',
        'Types help the editor warn you before the code runs. They are especially useful when your code grows and values move between functions.',
      ],
      example: 'const name: string = "Leyla"\nconst age: number = 20\nconsole.log(name, age)',
    },
    {
      title: 'Type function inputs',
      body: [
        'Function parameter types make the function contract clear. A caller can see what values are allowed.',
        'Return types are often inferred, but writing them during lessons can make your intent easier to read.',
      ],
      example: 'function add(a: number, b: number): number {\n  return a + b\n}',
    },
    {
      title: 'Practice',
      body: [
        'Create a typed function that receives a price and quantity, then returns the total. Log the total in the console.',
      ],
    },
  ],
  files: {
    '/index.ts': {
      path: '/index.ts',
      language: 'typescript',
      code: 'function getTotal(price: number, quantity: number): number {\n  return price * quantity\n}\n\nconsole.log(getTotal(15, 3))',
    },
  },
}
