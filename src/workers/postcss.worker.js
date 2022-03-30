import { TextDocument } from 'vscode-languageserver-textdocument'
import {
  doComplete,
  resolveCompletionItem,
  doValidate,
  doHover,
  getDocumentColors,
  completionsFromClassList,
  getColor,
} from 'tailwindcss-language-service'
import {
  asCompletionResult as asMonacoCompletionResult,
  asCompletionItem as asMonacoCompletionItem,
  asDiagnostics as asMonacoDiagnostics,
  asHover as asMonacoHover,
  asRange as asMonacoRange,
} from '../monaco/lspToMonaco'
import {
  asCompletionItem as asLspCompletionItem,
  asRange as asLspRange,
} from '../monaco/monacoToLsp'
import CompileWorker from 'worker-loader!./compile.worker.js'
import { createWorkerQueue } from '../utils/workers'
import './subworkers'
import { getVariants } from '../utils/getVariants'
import { parseConfig } from './parseConfig'
import { toValidTailwindVersion } from '../utils/toValidTailwindVersion'
import { isObject } from '../utils/object'
import { format } from '../monaco/format'

const compileWorker = createWorkerQueue(CompileWorker)

let state

let lastHtml
let lastCss
let lastConfig

addEventListener('message', async (event) => {
  if (event.data.lsp) {
    let result

    function fallback(fn, fallbackValue) {
      if (!state || !state.enabled) return fallbackValue
      return fn()
    }

    const document = TextDocument.create(
      event.data.lsp.uri,
      event.data.lsp.language,
      1,
      event.data.lsp.text
    )

    switch (event.data.lsp.type) {
      case 'complete':
        result = await fallback(
          async () =>
            asMonacoCompletionResult(
              await doComplete(
                state,
                document,
                {
                  line: event.data.lsp.position.lineNumber - 1,
                  character: event.data.lsp.position.column - 1,
                },
                event.data.lsp.context
              )
            ),
          []
        )
        break
      case 'completeString':
        result = fallback(() =>
          asMonacoCompletionResult(
            completionsFromClassList(
              state,
              document.getText(),
              asLspRange(event.data.lsp.range)
            )
          )
        )
        break
      case 'resolveCompletionItem':
        result = await fallback(async () => {
          let item = await resolveCompletionItem(
            state,
            asLspCompletionItem(event.data.lsp.item)
          )
          if (item.documentation?.value) {
            item.documentation.value = item.documentation.value.replace(
              /^```css/,
              '```tailwindcss'
            )
          }
          return asMonacoCompletionItem(item)
        })
        break
      case 'hover':
        result = await fallback(async () => {
          const hover = await doHover(state, document, {
            line: event.data.lsp.position.lineNumber - 1,
            character: event.data.lsp.position.column - 1,
          })
          if (hover && hover.contents.language === 'css') {
            hover.contents.language = 'tailwindcss'
          }
          return asMonacoHover(hover)
        })
        break
      case 'validate':
        result = await fallback(
          async () => asMonacoDiagnostics(await doValidate(state, document)),
          []
        )
        break
      case 'documentColors':
        result = await fallback(
          async () =>
            (
              await getDocumentColors(state, document)
            ).map(({ color, range }) => ({
              range: asMonacoRange(range),
              color,
            })),
          []
        )
        break
    }

    return postMessage({ _id: event.data._id, result })
  }

  if (event.data.prettier) {
    try {
      return postMessage({
        _id: event.data._id,
        result: await format(
          state,
          event.data.prettier.text,
          event.data.prettier.language
        ),
      })
    } catch (error) {
      return postMessage({
        _id: event.data._id,
        error,
      })
    }
  }

  if (
    (typeof event.data.css !== 'undefined' &&
      typeof event.data.config !== 'undefined' &&
      typeof event.data.html !== 'undefined') ||
    event.data._recompile
  ) {
    const html = event.data._recompile ? lastHtml : event.data.html
    const css = event.data._recompile ? lastCss : event.data.css
    const config = event.data._recompile ? lastConfig : event.data.config

    const isFreshBuild = !event.data.transient

    lastHtml = html
    lastCss = css
    lastConfig = config

    const result = await compileWorker.emit({
      ...event.data,
      _isFreshBuild: isFreshBuild,
      html,
      css,
      config,
    })

    if (!result.error && !result.canceled) {
      if ('buildId' in result) {
        self.BUILD_ID = result.buildId
      }
      if (result.state) {
        let tailwindVersion = toValidTailwindVersion(event.data.tailwindVersion)
        let [
          { default: postcss },
          { default: postcssSelectorParser },
          { generateRules },
          { createContext },
          { default: expandApplyAtRules },
          { default: resolveConfig },
        ] = await Promise.all([
          import('postcss'),
          import('postcss-selector-parser'),
          result.state.jit
            ? tailwindVersion === '2'
              ? import('tailwindcss-v2/lib/jit/lib/generateRules')
              : import('tailwindcss/lib/lib/generateRules')
            : {},
          result.state.jit
            ? tailwindVersion === '2'
              ? import('tailwindcss-v2/lib/jit/lib/setupContextUtils')
              : import('tailwindcss/lib/lib/setupContextUtils')
            : {},
          result.state.jit
            ? tailwindVersion === '2'
              ? import('tailwindcss-v2/lib/jit/lib/expandApplyAtRules')
              : import('tailwindcss/lib/lib/expandApplyAtRules')
            : {},
          tailwindVersion === '2'
            ? import('tailwindcss-v2/resolveConfig')
            : tailwindVersion === '3'
            ? import('tailwindcss/resolveConfig')
            : import('tailwindcss-v1/resolveConfig'),
          result.state.jit
            ? tailwindVersion === '2'
              ? import('tailwindcss-v2/lib/jit/lib/setupTrackingContext')
              : import('tailwindcss/lib/lib/setupTrackingContext')
            : {},
        ])

        state = result.state
        state.modules = {
          postcss: { module: postcss },
          postcssSelectorParser: { module: postcssSelectorParser },
          ...(result.state.jit
            ? {
                jit: {
                  generateRules: {
                    module: generateRules,
                  },
                  expandApplyAtRules: {
                    module: expandApplyAtRules,
                  },
                },
              }
            : {}),
        }
        state.config = resolveConfig(await parseConfig(config, tailwindVersion))
        if (result.state.jit) {
          state.jitContext = createContext(state.config)
          if (state.jitContext.getClassList) {
            state.classList = state.jitContext
              .getClassList()
              .filter((className) => className !== '*')
              .map((className) => {
                return [className, { color: getColor(state, className) }]
              })
          }
        }
      }
      state.variants = getVariants(state)
      state.screens = isObject(state.config.screens)
        ? Object.keys(state.config.screens)
        : []
      state.editor.getConfiguration = () => ({
        editor: {
          tabSize: 2,
        },
        tailwindCSS: {
          validate: true,
          classAttributes: ['class'],
          lint: {
            cssConflict: 'warning',
            invalidApply: 'error',
            invalidScreen: 'error',
            invalidVariant: 'error',
            invalidConfigPath: 'error',
            invalidTailwindDirective: 'error',
            recommendedVariantOrder: 'warning',
          },
        },
      })
      state.enabled = true
      postMessage({
        _id: event.data._id,
        css: result.css,
        html: result.html,
        jit: result.jit,
      })
    } else {
      postMessage({ ...result, _id: event.data._id })
    }
  }
})
