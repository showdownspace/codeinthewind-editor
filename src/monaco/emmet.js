import * as monaco from 'monaco-editor'
import { emmetHTML } from 'emmet-monaco-es'
import expand from 'emmet'
import { HTML_URI } from './html'
import { requestResponse } from '../utils/workers'

export function setupEmmet(worker) {
  const _registerCompletionItemProvider =
    monaco.languages.registerCompletionItemProvider
  monaco.languages.registerCompletionItemProvider = (
    lang,
    { triggerCharacters, provideCompletionItems }
  ) => {
    return _registerCompletionItemProvider(lang, {
      triggerCharacters: [...triggerCharacters, '/', ...'0123456789'.split('')],
      provideCompletionItems: async (model, position) => {
        const result = provideCompletionItems(model, position)
        if (!result) return result

        const suggestions = result.suggestions.map((suggestion) => {
          let transformed = suggestion.label
            .replace(/(\d+)\/(\d+)/g, '$1EMMETSLASH$2')
            .replace(/(\d+)\.(\d+(?:[^a-z0-9]|$))/gi, '$1EMMETDOT$2')

          let filter = getFilters(transformed)
          if (filter) {
            transformed = transformed.substr(
              0,
              transformed.length - filter.length - 1
            )
          }

          if (/EMMET(SLASH|DOT)/.test(transformed)) {
            const expandText = expand(
              transformed,
              getExpandOptions('html', filter)
            )
              .replace(/EMMETSLASH/g, '/')
              .replace(/EMMETDOT/g, '.')

            suggestion.insertText = expandText
            suggestion.documentation = expandText
              .replace(/([^\\])\$\{\d+\}/g, '$1|')
              .replace(/\$\{\d+:([^\}]+)\}/g, '$1')
          }

          return suggestion
        })

        if (suggestions.length > 0 && worker) {
          const range = {
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: position.column,
          }

          const line = model.getValueInRange(range)

          if (line.includes('.')) {
            const partialClass = line
              .replace(/(\d+)\.($|\d+(?:[^a-z0-9]|$))/gi, '$1__DOT__$2')
              .split('.')
              .pop()
              .replace(/__DOT__/g, '.')

            const { result } = await requestResponse(worker, {
              lsp: {
                type: 'completeString',
                text: partialClass,
                language: 'html',
                uri: HTML_URI,
                range: {
                  ...range,
                  startColumn: range.endColumn - partialClass.length,
                },
              },
            })

            if (result) {
              suggestions.push(
                ...result.suggestions.map((suggestion) => ({
                  ...suggestion,
                  command: { id: 'editor.action.triggerSuggest', title: '' },
                }))
              )
            }
          }
        }

        return { ...result, suggestions }
      },
      async resolveCompletionItem(_model, _position, item, _token) {
        if (item.detail === 'Emmet abbreviation') return item

        let { result } = await requestResponse(worker, {
          lsp: {
            type: 'resolveCompletionItem',
            item,
          },
        })

        return result
      },
    })
  }

  const emmet = emmetHTML(monaco)

  monaco.languages.registerCompletionItemProvider =
    _registerCompletionItemProvider

  return emmet
}

const emmetSnippetField = (index, placeholder) =>
  `\${${index}${placeholder ? ':' + placeholder : ''}}`

// https://github.com/troy351/emmet-monaco-es/blob/2befdf544e9edc04e7bee6ccab3c4600a86fea1a/src/emmetHelper.ts#L609
function getExpandOptions(syntax, filter) {
  const type = syntax === 'css' ? 'stylesheet' : 'markup'

  const filters = filter ? filter.split(',').map((x) => x.trim()) : []
  const bemEnabled = filters.includes('bem')
  const commentEnabled = filters.includes('c')

  const combinedOptions = {
    'output.formatSkip': ['html'],
    'output.formatForce': ['body'],
    'output.field': emmetSnippetField,
    'output.inlineBreak': 0,
    'output.compactBoolean': false,
    'output.reverseAttributes': false,
    'markup.href': true,
    'comment.enabled': commentEnabled,
    'comment.trigger': ['id', 'class'],
    'comment.before': '',
    'comment.after': '\n<!-- /[#ID][.CLASS] -->',
    'bem.enabled': bemEnabled,
    'bem.element': '__',
    'bem.modifier': '_',
    'jsx.enabled': syntax === 'jsx',
    'stylesheet.shortHex': true,
    'stylesheet.between': syntax === 'stylus' ? ' ' : ': ',
    'stylesheet.after': syntax === 'sass' || syntax === 'stylus' ? '' : ';',
    'stylesheet.intUnit': 'px',
    'stylesheet.floatUnit': 'em',
    'stylesheet.unitAliases': {
      e: 'em',
      p: '%',
      x: 'ex',
      r: 'rem',
    },
    'stylesheet.fuzzySearchMinScore': 0.3,
    'output.format': true,
    'output.selfClosingStyle': 'html',
  }

  return {
    type,
    options: combinedOptions,
    variables: {},
    snippets: {},
    syntax,
    // context: null,
    text: undefined,
    maxRepeat: 1000,
    // cache: null
  }
}

const bemFilterSuffix = 'bem'
const filterDelimitor = '|'
const trimFilterSuffix = 't'
const commentFilterSuffix = 'c'
const maxFilters = 3

// https://github.com/troy351/emmet-monaco-es/blob/2befdf544e9edc04e7bee6ccab3c4600a86fea1a/src/emmetHelper.ts#L419
function getFilters(text, pos = text.length) {
  let filter

  for (let i = 0; i < maxFilters; i++) {
    if (text.endsWith(`${filterDelimitor}${bemFilterSuffix}`, pos)) {
      pos -= bemFilterSuffix.length + 1
      filter = filter ? bemFilterSuffix + ',' + filter : bemFilterSuffix
    } else if (text.endsWith(`${filterDelimitor}${commentFilterSuffix}`, pos)) {
      pos -= commentFilterSuffix.length + 1
      filter = filter ? commentFilterSuffix + ',' + filter : commentFilterSuffix
    } else if (text.endsWith(`${filterDelimitor}${trimFilterSuffix}`, pos)) {
      pos -= trimFilterSuffix.length + 1
      filter = filter ? trimFilterSuffix + ',' + filter : trimFilterSuffix
    } else {
      break
    }
  }

  return filter
}
