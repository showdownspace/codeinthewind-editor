import * as monaco from 'monaco-editor'
import { supplementMarkers } from './supplementMarkers'
import { renderColorDecorators } from './renderColorDecorators'
import { requestResponse } from '../utils/workers'
import { debounce } from 'debounce'
import { setupEmmet } from './emmet'
import { names as namedColors, fromRatio } from '@ctrl/tinycolor'

const colorNames = Object.keys(namedColors)

export const HTML_URI = 'file:///HTML'

export function setupHtmlMode(content, onChange, worker, getEditor) {
  const disposables = []

  disposables.push(setupEmmet(worker.current))

  disposables.push(
    monaco.languages.registerCompletionItemProvider('html', {
      triggerCharacters: [' ', '"', ':', '!', '/'],
      provideCompletionItems: async function (model, position, context) {
        if (!worker.current) return { suggestions: [] }
        const { result } = await requestResponse(worker.current, {
          lsp: {
            type: 'complete',
            text: model.getValue(),
            language: 'html',
            uri: HTML_URI,
            position,
            context,
          },
        })
        return result ? result : { suggestions: [] }
      },
      async resolveCompletionItem(item, _token) {
        const model = getEditor().getModel()
        const selections = getEditor().getSelections()
        let lines = model.getValue().split('\n')

        for (let i = 0; i < selections.length; i++) {
          const index = selections[i].positionLineNumber - 1
          lines[index] =
            lines[index].substr(0, item.range.startColumn - 1) +
            item.label +
            lines[index].substr(selections[i].positionColumn - 1)
        }

        onChange(lines.join('\n'))

        if (!item._resolved) {
          let { result } = await requestResponse(worker.current, {
            lsp: {
              type: 'resolveCompletionItem',
              item,
            },
          })
          Object.assign(item, result, { _resolved: true })
        }

        const error = new Error('Canceled')
        error.name = error.message
        throw error
      },
    })
  )

  disposables.push(
    monaco.languages.registerHoverProvider('html', {
      provideHover: async (model, position) => {
        let { result } = await requestResponse(worker.current, {
          lsp: {
            type: 'hover',
            text: model.getValue(),
            language: 'html',
            uri: HTML_URI,
            position,
          },
        })
        return result
      },
    })
  )

  let colorProvider

  disposables.push({
    dispose() {
      if (colorProvider) {
        colorProvider.dispose()
      }
    },
  })

  function registerColorProvider() {
    if (colorProvider) {
      colorProvider.dispose()
    }

    colorProvider = monaco.languages.registerColorProvider('html', {
      provideDocumentColors: async (model) => {
        let { result: colors } = await requestResponse(worker.current, {
          lsp: {
            type: 'documentColors',
            text: model.getValue(),
            language: 'html',
            uri: HTML_URI,
          },
        })

        let editableColors = colors.filter((color) => {
          let text = model.getValueInRange(color.range)
          return new RegExp(
            `-\\[(${colorNames.join('|')}|((?:#|rgba?\\(|hsla?\\())[^\\]]+)\\]$`
          ).test(text)
        })

        let nonEditableColors = colors.filter(
          (color) => !editableColors.includes(color)
        )
        renderColorDecorators(getEditor(), model, nonEditableColors)

        return editableColors
      },
      provideColorPresentations(model, params) {
        let className = model.getValueInRange(params.range)
        let match = className.match(
          new RegExp(
            `-\\[(${colorNames.join(
              '|'
            )}|(?:(?:#|rgba?\\(|hsla?\\())[^\\]]+)\\]$`,
            'i'
          )
        )

        if (match === null) return []

        let currentColor = match[1]

        let isNamedColor = colorNames.includes(currentColor)
        let color = fromRatio({
          r: params.color.red,
          g: params.color.green,
          b: params.color.blue,
          a: params.color.alpha,
        })

        let hexValue = color.toHex8String(
          !isNamedColor &&
            (currentColor.length === 4 || currentColor.length === 5)
        )
        if (hexValue.length === 5) {
          hexValue = hexValue.replace(/f$/, '')
        } else if (hexValue.length === 9) {
          hexValue = hexValue.replace(/ff$/, '')
        }

        let prefix = className.substr(0, match.index)

        return [
          hexValue,
          color.toRgbString().replace(/ /g, ''),
          color.toHslString().replace(/ /g, ''),
        ].map((value) => ({ label: `${prefix}-[${value}]` }))
      },
    })
  }

  const model = monaco.editor.createModel(
    content || '',
    'html',
    monaco.Uri.parse(HTML_URI)
  )
  model.updateOptions({ indentSize: 2, tabSize: 2 })
  disposables.push(model)

  // reset preview when suggest widget is closed
  let timeoutId
  function attachOnDidHide() {
    const editor = getEditor()
    if (editor && editor._contentWidgets['editor.widget.suggestWidget']) {
      let visible = false

      let widget =
        editor._contentWidgets['editor.widget.suggestWidget'].widget._widget

      disposables.push(
        widget.onDidShow(() => {
          visible = true

          let list = widget.element.domNode
          let details = widget._details.widget.domNode

          let observer = new MutationObserver(() => {
            if (list.style.top === details.parentNode.style.top) {
              details.parentNode.style.marginTop = '0'
              if (
                parseInt(list.style.left, 10) >
                parseInt(details.parentNode.style.left, 10)
              ) {
                details.parentNode.style.marginLeft = '0'
                details.parentNode.style.marginRight = '8px'
              } else {
                details.parentNode.style.marginLeft = '8px'
                details.parentNode.style.marginRight = '0'
              }
            } else {
              details.parentNode.style.marginTop = '8px'
              details.parentNode.style.marginLeft = '0'
              details.parentNode.style.marginRight = '0'
            }
          })
          observer.observe(details.parentNode, {
            attributes: true,
            attributeFilter: ['style'],
          })
          disposables.push({
            dispose: () => {
              observer.disconnect()
            },
          })
        })
      )
      disposables.push(
        editor._contentWidgets[
          'editor.widget.suggestWidget'
        ].widget._widget.onDidHide(() => {
          setTimeout(() => (visible = false), 0)
          if (editor.getModel() === model) {
            onChange()
          }
        })
      )
      disposables.push(
        editor.onDidChangeModel(({ oldModelUrl }) => {
          if (visible && oldModelUrl.toString() === HTML_URI) {
            onChange()
          }
        })
      )
    } else {
      timeoutId = window.setTimeout(attachOnDidHide, 10)
    }
  }
  attachOnDidHide()
  disposables.push({
    dispose: () => {
      window.clearTimeout(timeoutId)
    },
  })

  const updateDecorations = debounce(async () => {
    registerColorProvider()

    let { result } = await requestResponse(worker.current, {
      lsp: {
        type: 'validate',
        text: model.getValue(),
        language: 'html',
        uri: HTML_URI,
      },
    })

    if (model.isDisposed()) return

    if (result) {
      monaco.editor.setModelMarkers(model, 'default', supplementMarkers(result))
    } else {
      monaco.editor.setModelMarkers(model, 'default', [])
    }
  }, 100)

  disposables.push(
    model.onDidChangeContent(() => {
      onChange()
      updateDecorations()
    })
  )

  return {
    getModel: () => model,
    updateDecorations,
    activate: () => {
      getEditor().setModel(model)
    },
    dispose() {
      disposables.forEach((disposable) => disposable.dispose())
    },
  }
}
