import { klona } from 'klona/full'
import { VIRTUAL_SOURCE_PATH, VIRTUAL_HTML_FILENAME } from '../constants'
import extractClasses from './extractClasses'

const deps = {
  1: [
    () => import('tailwindcss-v1'),
    () => import('postcss-v7'),
    () => import('autoprefixer-postcss7'),
    () => import('tailwindcss-v1/lib/featureFlags'),
  ],
  2: [
    () => import('tailwindcss-v2'),
    () => import('postcss'),
    () => import('autoprefixer'),
    () => import('tailwindcss-v2/lib/featureFlags'),
    () => import('tailwindcss-v2/resolveConfig'),
  ],
  3: [
    () => import('tailwindcss'),
    () => import('postcss'),
    () => import('autoprefixer'),
    () => import('tailwindcss/lib/featureFlags'),
    () => import('tailwindcss/resolveConfig'),
  ],
}

const applyModule1 = require('tailwindcss-v1/lib/flagged/applyComplexClasses')
const applyModule2 = require('tailwindcss-v2/lib/lib/substituteClassApplyAtRules')

const apply1 = applyModule1.default
const apply2 = applyModule2.default

// https://github.com/tailwindlabs/tailwindcss/blob/315e3a2445d682b2da9ca93fda77252fe32879ff/src/cli.js#L26-L42
function formatNodes(root) {
  indentRecursive(root)
  if (root.first) {
    root.first.raws.before = ''
  }
}

function indentRecursive(node, indent = 0) {
  node.each &&
    node.each((child, i) => {
      if (
        !child.raws.before ||
        !child.raws.before.trim() ||
        child.raws.before.includes('\n')
      ) {
        child.raws.before = `\n${
          node.type !== 'rule' && i > 0 ? '\n' : ''
        }${'  '.repeat(indent)}`
      }
      child.raws.after = `\n${'  '.repeat(indent)}`
      indentRecursive(child, indent + 1)
    })
}

export async function processCss(
  configInput,
  htmlInput,
  cssInput,
  tailwindVersion = '2',
  skipIntelliSense = false
) {
  let jit = false
  const config = klona(configInput)
  const [tailwindcss, postcss, autoprefixer, featureFlags, resolveConfig] = (
    await Promise.all(deps[tailwindVersion].map((x) => x()))
  ).map((x) => x.default || x)

  self[VIRTUAL_HTML_FILENAME] = htmlInput

  let separator =
    typeof config.separator === 'undefined' ? ':' : config.separator
  separator = `${separator}`

  if (
    (tailwindVersion === '2' && config.mode === 'jit') ||
    tailwindVersion === '3'
  ) {
    if (tailwindVersion === '3') {
      config.content = [VIRTUAL_HTML_FILENAME]
    } else {
      config.purge = [VIRTUAL_HTML_FILENAME]
    }
    jit = true
  } else {
    config.separator = `__TWSEP__${separator}__TWSEP__`
    config.purge = false
  }

  let jitContext
  if (jit && !skipIntelliSense) {
    jitContext =
      require('tailwindcss-v2/lib/jit/lib/setupContextUtils').createContext(
        resolveConfig(config)
      )
  }

  const applyComplexClasses =
    tailwindVersion === '1' ? applyModule1 : applyModule2

  applyComplexClasses.default = (config, ...args) => {
    if (tailwindVersion === '3') {
      return require('tailwindcss/lib/lib/expandApplyAtRules').default(
        jitContext
      )
    }

    if (jit) {
      return require('tailwindcss-v2/lib/jit/lib/expandApplyAtRules').default(
        jitContext
      )
    }

    let configClone = klona(config)
    configClone.separator = separator

    let fn =
      tailwindVersion === '1'
        ? apply1(configClone, ...args)
        : apply2(configClone, ...args)

    return async (css) => {
      css.walkRules((rule) => {
        const newSelector = rule.selector.replace(
          /__TWSEP__(.*?)__TWSEP__/g,
          '$1'
        )
        if (newSelector !== rule.selector) {
          rule.before(
            postcss.comment({
              text: '__ORIGINAL_SELECTOR__:' + rule.selector,
            })
          )
          rule.selector = newSelector
        }
      })

      await fn(css)

      css.walkComments((comment) => {
        if (comment.text.startsWith('__ORIGINAL_SELECTOR__:')) {
          comment.next().selector = comment.text.replace(
            /^__ORIGINAL_SELECTOR__:/,
            ''
          )
          comment.remove()
        }
      })

      return css
    }
  }

  function addLayerBoundaryComments(root) {
    let supportedLayers = ['base', 'components', 'utilities']
    if (tailwindVersion !== '3') {
      supportedLayers.push('screens')
    }
    root.walkAtRules(/(tailwind|layer)/, (atRule) => {
      let layer = atRule.params.trim()
      if (supportedLayers.includes(layer)) {
        if (layer === 'screens') {
          layer = 'utilities'
        }
        atRule.before(postcss.comment({ text: `__play_start_${layer}__` }))
        atRule.after(postcss.comment({ text: `__play_end_${layer}__` }))
      }
    })
  }

  function addTailwindScreensDirective(root) {
    let hasDirective = false
    root.walkAtRules('tailwind', (node) => {
      if (node.params.trim() === 'screens') {
        hasDirective = true
        return false
      }
    })
    if (!hasDirective) {
      root.append('@tailwind screens;')
    }
  }

  function addNodeLayerComments(root) {
    root.each((node) => {
      let layer = node.raws?.tailwind?.parentLayer
      if (layer) {
        node.before(postcss.comment({ text: `__play_start_${layer}__` }))
        node.after(postcss.comment({ text: `__play_end_${layer}__` }))
      }
    })
  }

  let css
  let lspRoot

  if (!jit) {
    let result = await postcss(
      [
        tailwindVersion !== '3' && addTailwindScreensDirective,
        addLayerBoundaryComments,
        tailwindcss(config),
        autoprefixer(),
      ].filter(Boolean)
    ).process(cssInput, {
      from: undefined,
    })
    css = result.css
    lspRoot = result.root
  } else {
    css = (
      await postcss(
        [
          tailwindVersion !== '3' && addTailwindScreensDirective,
          addLayerBoundaryComments,
          tailwindcss(config),
          formatNodes,
          autoprefixer(),
          addNodeLayerComments,
        ].filter(Boolean)
      ).process(cssInput, {
        from: VIRTUAL_SOURCE_PATH,
      })
    ).css

    if (!skipIntelliSense && tailwindVersion !== '3') {
      lspRoot = (
        await postcss([
          tailwindcss({ ...config, mode: 'aot', purge: false, variants: [] }),
          autoprefixer(),
        ]).process(cssInput, {
          from: undefined,
        })
      ).root
    }
  }

  let state

  if (lspRoot || (tailwindVersion === '3' && !skipIntelliSense)) {
    state = {}
    state.jit = jit
    if (lspRoot) {
      state.classNames = await extractClasses(lspRoot)
    }
    state.separator = separator
    state.version =
      tailwindVersion === '1'
        ? require('tailwindcss-v1/package.json?fields=version').version
        : tailwindVersion === '2'
        ? require('tailwindcss-v2/package.json?fields=version').version
        : require('tailwindcss/package.json?fields=version').version
    state.editor = {
      userLanguages: {},
      capabilities: {},
    }
    state.featureFlags = featureFlags
  }

  const escapedSeparator = separator.replace(/./g, (m) =>
    /[a-z0-9-_]/i.test(m) ? m : `\\${m}`
  )

  return {
    state,
    css: css.replace(/__TWSEP__.*?__TWSEP__/g, escapedSeparator),
    jit,
    ...(jit ? { html: htmlInput } : {}),
  }
}
