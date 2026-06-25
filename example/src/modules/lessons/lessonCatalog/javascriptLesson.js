export const javascriptLesson = {
  id: 'javascript',
  title: 'JavaScript basics',
  summary: 'Use values, variables, and functions to make code do work.',
  engine: 'javascript',
  activeFile: '/index.js',
  showFiles: false,
  showPreview: false,
  pages: [
    {
      title: 'JavaScript stores values',
      body: [
        'JavaScript is the language that adds behavior to web pages and applications. You use it to store data, make decisions, repeat work, and respond to user actions.',
        'A variable gives a value a name. Use const when the name will not be reassigned, and let when the value needs to change later.',
      ],
      example: 'const name = "Ayan"\nlet points = 10\nconsole.log(name, points)',
    },
    {
      title: 'Functions package behavior',
      body: [
        'A function is a reusable block of work. It can receive inputs, calculate something, and return a result.',
        'Good functions usually do one clear job. Start by naming the job, then decide which inputs the function needs.',
      ],
      example: 'function double(number) {\n  return number * 2\n}\n\nconsole.log(double(4))',
    },
    {
      title: 'Practice',
      body: ['Create a function that receives a name and returns a greeting. Log the result in the console.'],
    },
  ],
  files: {
    '/index.js': {
      path: '/index.js',
      language: 'javascript',
      code: 'function createGreeting(name) {\n  return `Salam, ${name}!`\n}\n\nconsole.log(createGreeting("Ayan"))',
    },
  },
}
