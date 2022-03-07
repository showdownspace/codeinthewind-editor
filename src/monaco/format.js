import prettier from 'prettier'

const plugins = {}

const options = {
  html: { parser: 'html', printWidth: 10000 },
  tailwindcss: { parser: 'css', printWidth: 100 },
  javascript: {
    parser: 'babel',
    printWidth: 100,
    semi: false,
    singleQuote: true,
  },
}

function bigSign(bigIntValue) {
  return (bigIntValue > 0n) - (bigIntValue < 0n)
}

function sortClasses(
  classStr,
  { state, ignoreFirst = false, ignoreLast = false }
) {
  if (typeof classStr !== 'string' || classStr === '') {
    return classStr
  }

  // Ignore class attributes containing `{{`, to match Prettier behaviour:
  // https://github.com/prettier/prettier/blob/main/src/language-html/embed.js#L83-L88
  if (classStr.includes('{{')) {
    return classStr
  }

  let result = ''
  let parts = classStr.split(/(\s+)/)
  let classes = parts.filter((_, i) => i % 2 === 0)
  let whitespace = parts.filter((_, i) => i % 2 !== 0)

  if (classes[classes.length - 1] === '') {
    classes.pop()
  }

  let prefix = ''
  if (ignoreFirst) {
    prefix = `${classes.shift() ?? ''}${whitespace.shift() ?? ''}`
  }

  let suffix = ''
  if (ignoreLast) {
    suffix = `${whitespace.pop() ?? ''}${classes.pop() ?? ''}`
  }

  classes = state.jitContext
    .getClassOrder(classes)
    .sort(([, a], [, z]) => {
      if (a === z) return 0
      if (a === null) return -1
      if (z === null) return 1
      return bigSign(a - z)
    })
    .map(([className]) => className)

  for (let i = 0; i < classes.length; i++) {
    result += `${classes[i]}${whitespace[i] ?? ''}`
  }

  return prefix + result + suffix
}

function transformHtml(ast, state) {
  for (let attr of ast.attrs ?? []) {
    if (attr.name === 'class' && typeof attr.value === 'string') {
      attr.value = sortClasses(attr.value, { state })
    }
  }
  for (let child of ast.children ?? []) {
    transformHtml(child, state)
  }
}

function transformCss(ast, state) {
  ast.walk((node) => {
    node.params = sortClasses(node.params, {
      state,
      ignoreLast: /\s+(?:!important|#{!important})\s*$/.test(node.params),
    })
  })
}

async function getPlugin(state, language) {
  if (language === 'html') {
    let htmlParser = await import('prettier/parser-html')
    let parse = htmlParser.parsers.html.parse
    htmlParser.parsers.html.parse = (text, parsers, options) => {
      let ast = parse(text, parsers, options)
      transformHtml(ast, state)
      return ast
    }
    return htmlParser
  }

  if (language === 'tailwindcss') {
    let cssParser = await import('prettier/parser-postcss')
    let parse = cssParser.parsers.css.parse
    cssParser.parsers.css.parse = (text, parsers, options) => {
      let ast = parse(text, parsers, options)
      transformCss(ast, state)
      return ast
    }
    return cssParser
  }

  if (language === 'javascript') {
    let babelParser = await import('prettier/parser-babel')
    return babelParser
  }
}

export async function format(state, text, language) {
  if (!plugins[language]) {
    plugins[language] = getPlugin(state, language)
  }
  return prettier.format(text, {
    ...options[language],
    plugins: [await plugins[language]],
  })
}
