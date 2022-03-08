import { useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { getTheme } from '../utils/theme'

export default function CssOutputEditor({ editorRef: inRef }) {
  const editorContainerRef = useRef()
  const editorRef = useRef()

  useEffect(() => {
    let editor = monaco.editor.create(editorContainerRef.current, {
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
    })

    editorRef.current = editor
    inRef(editor)

    const observer = new ResizeObserver(() => {
      window.setTimeout(() => editor.layout(), 0)
    })
    observer.observe(editorContainerRef.current)

    return () => {
      observer.disconnect()
      editor.dispose()
    }
  }, [])

  return (
    <div className="relative flex-auto">
      <div
        ref={editorContainerRef}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  )
}
