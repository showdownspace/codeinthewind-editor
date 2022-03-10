import { useRef, useEffect, useState } from 'react'
import { createMonacoEditor } from '../monaco'
import * as monaco from 'monaco-editor'
import { onDidChangeTheme, getTheme } from '../utils/theme'
import SplitPane from 'react-split-pane'
import clsx from 'clsx'

export default function Editor({
  initialContent = {},
  onChange,
  worker,
  activeTab,
  editorRef: inRef,
  cssOutputModelRef,
  tailwindVersion,
}) {
  const editorContainerRef = useRef()
  const editorRef = useRef()
  const editorState = useRef({})
  const cssOutputEditorContainerRef = useRef()
  const cssOutputModel = useRef()
  const cssOutputButtonHeight = 48
  const [size, setSize] = useState({ current: cssOutputButtonHeight })
  const [cssOutputVisible, setCssOutputVisible] = useState(false)

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

    // CSS Output
    let model = monaco.editor.createModel('', 'tailwindcss')
    cssOutputModel.current = model
    cssOutputModelRef(model)

    return () => {
      editorRef.current.dispose()
      cssOutputModel.current.dispose()
    }
  }, [])

  useEffect(() => {
    if (activeTab !== 'css') return

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
        // language: 'tailwindcss',
        renderLineHighlight: false,
        model: cssOutputModel.current,
      }
    )

    const observer = new ResizeObserver(() => {
      cssOutputEditor.layout()
    })
    observer.observe(cssOutputEditorContainerRef.current)

    return () => {
      observer.disconnect()
      cssOutputEditor.dispose()
    }
  }, [activeTab])

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

  return (
    <div className="mt-12 relative flex-auto">
      <SplitPane
        split="horizontal"
        size={size.current}
        minSize={cssOutputButtonHeight}
        maxSize={0}
        onChange={(newSize) => setSize({ ...size, current: newSize })}
        primary="second"
        pane1Style={{ display: 'flex', flexDirection: 'column' }}
        pane2Style={activeTab === 'css' ? {} : { height: 0 }}
        resizerStyle={{ zIndex: 10 }}
      >
        <div className="border-t border-gray-200 dark:border-white/10 flex-auto flex">
          <div className="relative flex-auto">
            <div
              ref={editorContainerRef}
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
        {activeTab === 'css' && (
          <div className="flex-auto flex flex-col">
            <button
              type="button"
              className="py-3 pl-6 pr-4 text-left text-sm leading-6 bg-white font-semibold focus:outline-none text-gray-700 hover:text-gray-900 focus:text-gray-900 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white flex items-center justify-between"
              onClick={() => {
                if (size.current <= cssOutputButtonHeight) {
                  setSize({ ...size, current: 300 })
                } else {
                  setSize({ ...size, current: cssOutputButtonHeight })
                }
              }}
            >
              Compiled CSS
              <svg
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d={
                    cssOutputVisible
                      ? 'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                      : 'M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
                  }
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className={clsx(
                'relative flex-auto border-t border-gray-200 dark:border-gray-800',
                !cssOutputVisible && 'hidden'
              )}
            >
              <div
                ref={cssOutputEditorContainerRef}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}
      </SplitPane>
    </div>
  )
}
