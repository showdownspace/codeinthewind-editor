import { useState, useRef, useEffect } from 'react'
import { createMonacoEditor } from '../monaco'
import * as monaco from 'monaco-editor'
import { onDidChangeTheme } from '../utils/theme'
import clsx from 'clsx'
import Alert from '@reach/alert'

export default function Editor({
  initialContent = {},
  onChange,
  worker,
  activeTab,
  editorRef: inRef,
  tailwindVersion,
}) {
  const editorContainerRef = useRef()
  const editorRef = useRef()
  const editorState = useRef({})
  const [isCopyButtonVisible, setIsCopyButtonVisible] = useState(false)
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
      window.setTimeout(() => editorRef.current.editor.layout(), 0)
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
    if (copyCount === 0) return
    let handle = window.setTimeout(() => {
      setCopyCount(0)
    }, 1500)
    return () => {
      window.clearTimeout(handle)
    }
  }, [copyCount])

  return (
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
      <button
        type="button"
        className={clsx(
          'absolute top-4 right-4 rounded-full bg-gray-50 text-gray-500 text-xs font-semibold leading-6 py-0.5 pl-2 pr-2.5 flex items-center hover:bg-gray-100 transition-opacity select-none dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600',
          !isCopyButtonVisible &&
            'opacity-0 pointer-events-none focus:opacity-100 focus:pointer-events-auto'
        )}
        onClick={() => {
          navigator.clipboard
            .writeText(editorRef.current.editor.getModel().getValue())
            .then(() => {
              setCopyCount((c) => c + 1)
            })
            .finally(() => {
              editorRef.current.editor.focus()
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
          <span className="sr-only">
            , {{ html: 'HTML', css: 'CSS', config: 'Config' }[activeTab]}, then
            focus editor
          </span>
        </span>
        {copyCount > 0 && (
          <Alert className="absolute inset-0 flex items-center justify-center">
            Copied!
          </Alert>
        )}
      </button>
    </div>
  )
}
