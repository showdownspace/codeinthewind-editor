import { useState, useRef, useEffect, useCallback } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import Worker from 'worker-loader!../workers/postcss.worker.js'
import { requestResponse } from '../utils/workers'
import { debounce } from 'debounce'
import { Editor } from '../components/Editor'
import SplitPane from 'react-split-pane'
import useMedia from 'react-use/lib/useMedia'
import { validateJavaScript } from '../utils/validateJavaScript'
import { useDebouncedState } from '../hooks/useDebouncedState'
import { Preview } from '../components/Preview'
import Error from 'next/error'
import { ErrorOverlay } from '../components/ErrorOverlay'
import Router from 'next/router'
import { Header } from '../components/Header'
import { Share } from '../components/Share'
import { TabBar } from '../components/TabBar'
import { sizeToObject } from '../utils/size'
import { getLayoutQueryString } from '../utils/getLayoutQueryString'
import { get } from '../utils/database'
import { toValidTailwindVersion } from '../utils/toValidTailwindVersion'
import Head from 'next/head'
import { getDefaultContent } from '../utils/getDefaultContent'

const HEADER_HEIGHT = 60 - 1
const TAB_BAR_HEIGHT = 40
const RESIZER_SIZE = 1
const DEFAULT_RESPONSIVE_SIZE = { width: 540, height: 720 }

function Pen({
  initialContent,
  initialPath,
  initialLayout,
  initialResponsiveSize,
  initialActiveTab,
}) {
  const previewRef = useRef()
  const worker = useRef()
  const [size, setSize] = useState({ percentage: 0.5, layout: initialLayout })
  const [resizing, setResizing] = useState(false)
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [activePane, setActivePane] = useState(
    initialLayout === 'preview' ? 'preview' : 'editor'
  )
  const isLg = useMedia('(min-width: 1024px)')
  const [dirty, setDirty] = useState(false)
  const [renderEditor, setRenderEditor] = useState(false)
  const [error, setError, setErrorImmediate, cancelSetError] =
    useDebouncedState(undefined, 1000)
  const editorRef = useRef()
  const cssOutputEditorRef = useRef()
  const [responsiveDesignMode, setResponsiveDesignMode] = useState(
    initialResponsiveSize ? true : false
  )
  const [shouldClearOnUpdate, setShouldClearOnUpdate] = useState(true)
  const [isLoading, setIsLoading, setIsLoadingImmediate] = useDebouncedState(
    false,
    1000
  )
  const [responsiveSize, setResponsiveSize] = useState(
    initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE
  )
  const [tailwindVersion, setTailwindVersion] = useState(
    toValidTailwindVersion(initialContent.version)
  )
  const [jit, setJit] = useState(false)
  const cssOutput = useRef('')
  const [cssOutputFilter, setCssOutputFilter] = useState([])

  useEffect(() => {
    setDirty(true)
  }, [
    activeTab,
    size.layout,
    responsiveSize.width,
    responsiveSize.height,
    responsiveDesignMode,
    tailwindVersion,
  ])

  useEffect(() => {
    if (dirty) {
      function handleUnload(e) {
        e.preventDefault()
        e.returnValue = ''
      }
      window.addEventListener('beforeunload', handleUnload)
      return () => {
        window.removeEventListener('beforeunload', handleUnload)
      }
    }
  }, [dirty])

  useEffect(() => {
    setDirty(false)
    setTailwindVersion(toValidTailwindVersion(initialContent.version))
    if (
      shouldClearOnUpdate &&
      previewRef.current &&
      previewRef.current.contentWindow
    ) {
      previewRef.current.contentWindow.postMessage(
        {
          clear: true,
        },
        '*'
      )
      inject({ html: initialContent.html })
      compileNow({
        html: initialContent.html,
        css: initialContent.css,
        config: initialContent.config,
        tailwindVersion: toValidTailwindVersion(initialContent.version),
      })
    }
  }, [initialContent.ID])

  const updateCssOutputPanel = useCallback(
    (css, options) => {
      let result = css
      let re =
        /\s*\/\*\s*__play_start_(base|components|utilities)__\s*\*\/(.*?)\/\*\s*__play_end_\1__\s*\*\//gs
      if (cssOutputFilter.length === 0) {
        result = result.replace(re, (_match, _layerName, layerCss) => layerCss)
      } else {
        let chunks = []
        let match
        while ((match = re.exec(result)) !== null) {
          let [, layerName, layerCss] = match
          if (cssOutputFilter.includes(layerName)) {
            let trimmedCss = layerCss.trim()
            if (trimmedCss) {
              chunks.push(trimmedCss)
            }
          }
        }
        result = chunks.join('\n\n')
      }
      result = result.trim().replace(/\n{3,}/g, '\n\n')
      if (result.trim() !== '') {
        result = result + '\n'
      }
      cssOutputEditorRef.current.setValue(result)
      let model = cssOutputEditorRef.current.getModel()
      if (options?.forceTokenization) {
        // This prevents a "flash of unhighlighted code" in the editor
        // but it's very slow on large CSS so we only do it in JIT mode
        // where the CSS is likely to be an ok size
        model.forceTokenization(model.getLineCount())
      }
      cssOutputEditorRef.current.setScrollPosition({ scrollTop: 0 })
    },
    [cssOutputFilter]
  )

  const inject = useCallback(
    (content, options) => {
      previewRef.current.contentWindow.postMessage(content, '*')
      if (content.css) {
        cssOutput.current = content.css
      }
      if (
        options?.updateCssOutput &&
        content.css &&
        cssOutputEditorRef.current
      ) {
        updateCssOutputPanel(content.css, {
          forceTokenization: Boolean(options?.jit),
        })
      }
    },
    [updateCssOutputPanel]
  )

  useEffect(() => {
    if (!cssOutputEditorRef.current) {
      return
    }
    updateCssOutputPanel(cssOutput.current, { forceTokenization: Boolean(jit) })
  }, [cssOutputFilter])

  async function compileNow(content) {
    if (content.config) {
      let validateResult = await validateJavaScript(content.config)
      if (!validateResult.isValid) {
        return setError({ ...validateResult.error, file: 'Config' })
      }
    }
    cancelSetError()
    setIsLoading(true)
    const { css, html, jit, canceled, error } = await requestResponse(
      worker.current,
      content
    )
    if (canceled) {
      return
    }
    setIsLoadingImmediate(false)
    if (error) {
      setError(error)
      return
    }
    setErrorImmediate()
    setJit(Boolean(jit))
    if (css || html) {
      inject(
        { css, html },
        { updateCssOutput: !content.transient, jit: Boolean(jit) }
      )
    }
  }

  const compile = useCallback(debounce(compileNow, 200), [inject])

  const onChange = useCallback(
    (document, content, options) => {
      setDirty(true)
      if (document === 'html' && !jit) {
        inject({ html: content.html }, { jit })
      } else {
        compile({
          html: content.html,
          css: content.css,
          config: content.config,
          skipIntelliSense: document === 'html',
          tailwindVersion,
          transient: options?.transient,
        })
      }
    },
    [inject, compile, jit, tailwindVersion]
  )

  useEffect(() => {
    worker.current = new Worker()
    return () => {
      worker.current.terminate()
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    function updateSize() {
      setSize((size) => {
        const windowSize =
          size.layout === 'horizontal'
            ? document.documentElement.clientHeight - HEADER_HEIGHT
            : document.documentElement.clientWidth

        if (isLg && size.layout !== 'preview') {
          const min = size.layout === 'vertical' ? 320 : 320 + TAB_BAR_HEIGHT
          const max =
            size.layout === 'vertical'
              ? windowSize - min - RESIZER_SIZE
              : windowSize - 320 - RESIZER_SIZE

          return {
            ...size,
            min,
            max,
            current: Math.max(
              Math.min(Math.round(windowSize * size.percentage), max),
              min
            ),
          }
        }

        const newSize =
          (isLg && size.layout !== 'preview') ||
          (!isLg && activePane === 'editor')
            ? windowSize
            : 0

        return {
          ...size,
          current: newSize,
          min: newSize,
          max: newSize,
        }
      })
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => {
      window.removeEventListener('resize', updateSize)
    }
  }, [isLg, setSize, size.layout, activePane])

  useEffect(() => {
    if (isLg) {
      if (size.layout !== 'preview') {
        setRenderEditor(true)
      }
    } else if (activePane === 'editor') {
      setRenderEditor(true)
    }
  }, [activePane, isLg, size.layout])

  useEffect(() => {
    if (resizing) {
      document.body.classList.add(
        size.layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    } else {
      document.body.classList.remove(
        size.layout === 'vertical' ? 'cursor-ew-resize' : 'cursor-ns-resize'
      )
    }
  }, [resizing])

  const updateCurrentSize = useCallback((newSize) => {
    setSize((size) => {
      const windowSize =
        size.layout === 'vertical'
          ? document.documentElement.clientWidth
          : document.documentElement.clientHeight - HEADER_HEIGHT
      const percentage = newSize / windowSize
      return {
        ...size,
        current: newSize,
        percentage:
          percentage === 1 || percentage === 0 ? size.percentage : percentage,
      }
    })
  }, [])

  const onShareStart = useCallback(() => {
    setDirty(false)
  }, [])

  const onShareComplete = useCallback(
    (path) => {
      setShouldClearOnUpdate(false)
      Router.push(path).then(() => {
        setShouldClearOnUpdate(true)
      })
    },
    [size.layout, responsiveDesignMode, responsiveSize]
  )

  // initial state resets
  useEffect(() => {
    setSize((size) => ({ ...size, layout: initialLayout }))
  }, [initialLayout])
  useEffect(() => {
    setResponsiveDesignMode(Boolean(initialResponsiveSize))
    setResponsiveSize(initialResponsiveSize || DEFAULT_RESPONSIVE_SIZE)
  }, [initialResponsiveSize])
  useEffect(() => {
    setActiveTab(initialActiveTab)
  }, [initialActiveTab])

  return (
    <>
      <Head>
        <meta
          property="og:url"
          content={`https://play.tailwindcss.com${
            initialContent.ID ? `/${initialContent.ID}` : ''
          }`}
        />
        <meta
          name="twitter:card"
          content={initialContent.ID ? 'summary' : 'summary_large_image'}
        />
        <meta
          name="twitter:image"
          content={
            initialContent.ID
              ? 'https://play.tailwindcss.com/social-square.jpg'
              : 'https://play.tailwindcss.com/social-card.jpg'
          }
        />
        {!initialContent.ID && (
          <meta
            property="og:image"
            content="https://play.tailwindcss.com/social-card.jpg"
          />
        )}
      </Head>
      <Header
        layout={size.layout}
        onChangeLayout={(layout) => setSize((size) => ({ ...size, layout }))}
        responsiveDesignMode={responsiveDesignMode}
        onToggleResponsiveDesignMode={() =>
          setResponsiveDesignMode(!responsiveDesignMode)
        }
        tailwindVersion={tailwindVersion}
        onChangeTailwindVersion={(version) => {
          setTailwindVersion(version)
          compileNow({ _recompile: true, tailwindVersion: version })
        }}
      >
        <Share
          editorRef={editorRef}
          onShareStart={onShareStart}
          onShareComplete={onShareComplete}
          dirty={dirty}
          initialPath={initialPath}
          layout={size.layout}
          responsiveSize={responsiveDesignMode ? responsiveSize : undefined}
          activeTab={activeTab}
          tailwindVersion={tailwindVersion}
        />
      </Header>
      <main className="flex-auto relative border-t border-gray-200 dark:border-gray-800">
        {initialContent && typeof size.current !== 'undefined' ? (
          <>
            {(!isLg || size.layout !== 'preview') && (
              <TabBar
                width={
                  size.layout === 'vertical' && isLg ? size.current : '100%'
                }
                isLoading={isLoading}
                showPreviewTab={!isLg}
                activeTab={
                  isLg || activePane === 'editor' ? activeTab : 'preview'
                }
                onChange={(tab) => {
                  if (tab === 'preview') {
                    setActivePane('preview')
                  } else {
                    setActivePane('editor')
                    setActiveTab(tab)
                  }
                }}
                onTidy={() => {
                  editorRef.current.editor.trigger(
                    '',
                    'editor.action.formatDocument'
                  )
                  editorRef.current.editor.focus()
                }}
              />
            )}
            <SplitPane
              split={size.layout === 'horizontal' ? 'horizontal' : 'vertical'}
              minSize={size.min}
              maxSize={size.max}
              size={size.current}
              onChange={updateCurrentSize}
              paneStyle={{ marginTop: -1 }}
              pane1Style={{ display: 'flex', flexDirection: 'column' }}
              onDragStarted={() => setResizing(true)}
              onDragFinished={() => setResizing(false)}
              allowResize={isLg && size.layout !== 'preview'}
              resizerClassName={
                isLg && size.layout !== 'preview'
                  ? 'Resizer'
                  : 'Resizer-collapsed'
              }
            >
              {renderEditor && (
                <Editor
                  editorRef={(ref) => (editorRef.current = ref)}
                  cssOutputEditorRef={(ref) =>
                    (cssOutputEditorRef.current = ref)
                  }
                  initialContent={initialContent}
                  onChange={onChange}
                  worker={worker}
                  activeTab={activeTab}
                  tailwindVersion={tailwindVersion}
                  cssOutputFilter={cssOutputFilter}
                  onFilterCssOutput={setCssOutputFilter}
                />
              )}
              <div className="absolute inset-0 w-full h-full">
                <Preview
                  ref={previewRef}
                  responsiveDesignMode={isLg && responsiveDesignMode}
                  responsiveSize={responsiveSize}
                  onChangeResponsiveSize={setResponsiveSize}
                  iframeClassName={resizing ? 'pointer-events-none' : ''}
                  onLoad={() => {
                    inject({
                      html: initialContent.html,
                      ...(initialContent.compiledCss
                        ? { css: initialContent.compiledCss }
                        : {}),
                    })
                    compileNow({
                      css: initialContent.css,
                      config: initialContent.config,
                      html: initialContent.html,
                      tailwindVersion: initialContent.version,
                    })
                  }}
                />
                <ErrorOverlay error={error} />
              </div>
            </SplitPane>
          </>
        ) : null}
      </main>
    </>
  )
}

export default function App({ errorCode, ...props }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }
  return <Pen {...props} />
}

export async function getServerSideProps({ params, res, query }) {
  const layoutProps = {
    initialLayout: ['vertical', 'horizontal', 'preview'].includes(query.layout)
      ? query.layout
      : 'vertical',
    initialResponsiveSize: sizeToObject(query.size),
    initialActiveTab: ['html', 'css', 'config'].includes(query.file)
      ? query.file
      : 'html',
  }

  console.log(params.slug)

  if (
    !params.slug ||
    (params.slug.length === 1 && params.slug[0] === 'index')
  ) {
    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )
    return {
      props: {
        initialContent: await getDefaultContent(),
        ...layoutProps,
      },
    }
  }

  if (params.slug.length !== 1) {
    return {
      props: {
        errorCode: 404,
      },
    }
  }

  try {
    const { Item: initialContent } = await get({
      ID: params.slug[0],
    })

    res.setHeader(
      'cache-control',
      'public, max-age=0, must-revalidate, s-maxage=31536000'
    )

    return {
      props: {
        initialContent,
        initialPath: `/${initialContent.ID}${getLayoutQueryString({
          layout: query.layout,
          responsiveSize: query.size,
          file: query.file,
        })}`,
        ...layoutProps,
      },
    }
  } catch (error) {
    return {
      props: {
        errorCode: error.status || 500,
      },
    }
  }
}
