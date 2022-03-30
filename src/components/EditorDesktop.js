import { useRef, useEffect, useState } from 'react'
import { createMonacoEditor } from '../monaco'
import * as monaco from 'monaco-editor'
import { onDidChangeTheme, getTheme } from '../utils/theme'
import SplitPane from 'react-split-pane'
import clsx from 'clsx'
import Alert from '@reach/alert'

export default function Editor({
  initialContent = {},
  onChange,
  worker,
  activeTab,
  editorRef: inRef,
  cssOutputEditorRef: setCssOutputEditorRef,
  tailwindVersion,
  onFilterCssOutput,
  cssOutputFilter,
}) {
  const editorContainerRef = useRef()
  const editorRef = useRef()
  const editorState = useRef({})
  const cssOutputEditorContainerRef = useRef()
  const cssOutputEditorRef = useRef()
  const cssOutputButtonHeight = 48
  const [size, setSize] = useState({ current: cssOutputButtonHeight })
  const [cssOutputVisible, setCssOutputVisible] = useState(false)
  const [isCopyButtonVisible, setIsCopyButtonVisible] = useState(false)
  const [isCssOutputCopyButtonVisible, setIsCssOutputCopyButtonVisible] =
    useState(false)
  const [copyCount, setCopyCount] = useState(0)

  useEffect(() => {
    const editor = createMonacoEditor({
      container: editorContainerRef.current,
      initialContent,
      onChange,
      worker,
      tailwindVersion,
    })

    editorRef.current = editor
    inRef(editor)

    return () => {
      editorRef.current.dispose()
    }
  }, [])

  useEffect(() => {
    let cssOutputEditor = monaco.editor.create(
      cssOutputEditorContainerRef.current,
      {
        fontFamily:
          'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 14,
        lineHeight: 21,
        minimap: { enabled: false },
        theme: getTheme() === 'dark' ? 'tw-dark' : 'tw-light',
        fixedOverflowWidgets: true,
        readOnly: true,
        language: 'tailwindcss',
        renderLineHighlight: false,
        padding: { top: 49 },
      }
    )

    cssOutputEditorRef.current = cssOutputEditor
    setCssOutputEditorRef(cssOutputEditor)

    const observer = new ResizeObserver(() => {
      cssOutputEditor.layout()
    })
    observer.observe(cssOutputEditorContainerRef.current)

    return () => {
      observer.disconnect()
      cssOutputEditor.dispose()
    }
  }, [])

  useEffect(() => {
    editorRef.current.setOnChange(onChange)
  }, [onChange])

  const initial = useRef(true)
  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    editorRef.current.reset(initialContent)
  }, [initialContent])

  useEffect(() => {
    editorRef.current.setTailwindVersion(tailwindVersion)
  }, [tailwindVersion])

  useEffect(() => {
    function handleThemeChange(theme) {
      monaco.editor.setTheme(theme === 'dark' ? 'tw-dark' : 'tw-light')
    }
    const dispose = onDidChangeTheme(handleThemeChange)
    return () => dispose()
  }, [])

  // TODO: polyfill?
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      editorRef.current.editor.layout()
    })
    observer.observe(editorContainerRef.current)
    return () => {
      observer.disconnect()
    }
  }, [])

  // TODO: prevent initial run?
  useEffect(() => {
    const { editor, documents } = editorRef.current
    const currentState = editor.saveViewState()
    const currentModel = editor.getModel()

    if (currentModel === documents.html.getModel()) {
      editorState.current.html = currentState
    } else if (currentModel === documents.css.getModel()) {
      editorState.current.css = currentState
    } else if (currentModel === documents.config.getModel()) {
      editorState.current.config = currentState
    }

    documents[activeTab].activate()
    editor.restoreViewState(editorState.current[activeTab])
    editor.focus()
  }, [activeTab])

  useEffect(() => {
    if (size.current > cssOutputButtonHeight && !cssOutputVisible) {
      setCssOutputVisible(true)
    } else if (size.current <= cssOutputButtonHeight && cssOutputVisible) {
      setCssOutputVisible(false)
    }
  }, [size.current, cssOutputVisible])

  useEffect(() => {
    if (copyCount === 0) return
    let handle = window.setTimeout(() => {
      setCopyCount(0)
    }, 1500)
    return () => {
      window.clearTimeout(handle)
    }
  }, [copyCount])

  return (
    <div className="mt-12 relative flex-auto">
      <SplitPane
        split="horizontal"
        size={size.current}
        minSize={cssOutputButtonHeight}
        maxSize={-1}
        onChange={(newSize) => setSize({ ...size, current: newSize })}
        primary="second"
        pane1Style={{ display: 'flex', flexDirection: 'column' }}
        resizerStyle={{ zIndex: 10, background: 'none' }}
      >
        <div className="border-t border-gray-200 dark:border-white/10 flex-auto flex -mb-2">
          <div
            className="relative flex-auto"
            onMouseMove={() => {
              if (!isCopyButtonVisible) {
                setIsCopyButtonVisible(true)
              }
            }}
            onMouseLeave={() => setIsCopyButtonVisible(false)}
            onKeyDownCapture={() => {
              if (isCopyButtonVisible) {
                setIsCopyButtonVisible(false)
              }
            }}
          >
            <div
              ref={editorContainerRef}
              className="absolute inset-0 w-full h-full"
            />
            <CopyButton
              editorRef={editorRef}
              className="absolute top-2.5 right-[calc(14px+0.625rem)]"
              isVisible={isCopyButtonVisible}
            />
          </div>
        </div>
        <div className="flex-auto flex flex-col ring-1 ring-gray-900/[0.07] rounded-t-lg overflow-hidden dark:rounded-none dark:ring-0 shadow-[0_2px_11px_rgba(0,0,0,0.1),0_3px_6px_rgba(0,0,0,0.05)]">
          <button
            type="button"
            className="flex-none group h-12 px-6 text-left text-sm leading-6 bg-white font-semibold focus:outline-none text-gray-700 hover:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center justify-between border-y border-t-transparent border-b-gray-900/10 dark:bg-gradient-to-b dark:from-[#242F41] dark:to-gray-800 dark:shadow-highlight/4 dark:ring-1 dark:ring-inset dark:ring-white/[0.08] dark:rounded-t-lg dark:border-0"
            onClick={() => {
              if (size.current <= cssOutputButtonHeight) {
                setSize({ ...size, current: 300 })
              } else {
                setSize({ ...size, current: cssOutputButtonHeight })
              }
            }}
          >
            Generated CSS
            <svg
              className={clsx(
                'w-6 h-6 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200',
                !cssOutputVisible && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="m17 10-5 5-5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div
            className={clsx(
              'relative flex-auto',
              !cssOutputVisible && 'hidden'
            )}
            onMouseMove={() => {
              if (!isCssOutputCopyButtonVisible) {
                setIsCssOutputCopyButtonVisible(true)
              }
            }}
            onMouseLeave={() => setIsCssOutputCopyButtonVisible(false)}
          >
            <div className="absolute z-10 bg-white/80 backdrop-blur top-0 left-0 right-[14px] select-none flex pl-6 pr-2.5 py-2.5 border-t border-gray-900/[0.03] dark:bg-gray-800/80 justify-between">
              <div className="flex space-x-3">
                {[
                  ['All'],
                  ['Base', 'base'],
                  ['Components', 'components'],
                  ['Utilities', 'utilities'],
                ].map(([label, key], index) => (
                  <button
                    key={label}
                    type="button"
                    className={clsx(
                      'rounded-full text-xs leading-6 py-0.5 px-3 font-semibold',
                      cssOutputFilter.includes(key) ||
                        (index === 0 && cssOutputFilter.length === 0)
                        ? 'bg-sky-50 text-sky-500 dark:bg-gray-100/[0.08] dark:text-white'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300'
                    )}
                    onClick={(event) => {
                      if (index === 0) {
                        onFilterCssOutput([])
                      } else {
                        if (event.metaKey) {
                          if (cssOutputFilter.includes(key)) {
                            onFilterCssOutput(
                              cssOutputFilter.filter((x) => x !== key)
                            )
                          } else {
                            onFilterCssOutput([...cssOutputFilter, key])
                          }
                        } else {
                          onFilterCssOutput([key])
                        }
                      }
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <CopyButton
                editorRef={cssOutputEditorRef}
                className="relative"
                isVisible={isCssOutputCopyButtonVisible}
              />
            </div>
            <div
              ref={cssOutputEditorContainerRef}
              className="absolute inset-0 w-full h-full css-output-editor"
            />
          </div>
        </div>
      </SplitPane>
    </div>
  )
}

function CopyButton({ editorRef, className, isVisible }) {
  let [copyCount, setCopyCount] = useState(0)

  useEffect(() => {
    if (copyCount === 0) return
    let handle = window.setTimeout(() => {
      setCopyCount(0)
    }, 1500)
    return () => {
      window.clearTimeout(handle)
    }
  }, [copyCount])

  return (
    <button
      type="button"
      className={clsx(
        'rounded-full bg-gray-50 text-gray-500 text-xs font-semibold leading-6 py-0.5 pl-2 pr-2.5 flex items-center hover:bg-gray-100 transition-opacity select-none dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600',
        !isVisible &&
          'opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto',
        className
      )}
      onClick={() => {
        navigator.clipboard
          .writeText(
            (editorRef.current.editor || editorRef.current)
              .getModel()
              .getValue() || '\n'
          )
          .then(() => {
            setCopyCount((c) => c + 1)
          })
          .finally(() => {
            editorRef.current.focus()
          })
      }}
    >
      <svg
        viewBox="0 0 20 20"
        className={clsx(
          'w-5 h-5 text-gray-400 flex-none mr-1',
          copyCount > 0 && 'opacity-0'
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 4.75H5.75a2 2 0 0 0-2 2v8.5a2 2 0 0 0 2 2h8.5a2 2 0 0 0 2-2v-8.5a2 2 0 0 0-2-2H13" />
        <path d="M12 6.25H8a1 1 0 0 1-1-1v-1.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.5a1 1 0 0 1-1 1ZM7.75 10.25h4.5M7.75 13.25h4.5" />
      </svg>
      <span className={clsx(copyCount > 0 && 'opacity-0')}>
        Copy
        <span className="sr-only">, then focus editor</span>
      </span>
      {copyCount > 0 && (
        <Alert className="absolute inset-0 flex items-center justify-center">
          Copied!
        </Alert>
      )}
    </button>
  )
}
