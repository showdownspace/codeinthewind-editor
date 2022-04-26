import clsx from 'clsx'
import { store, useCodeInTheWindStore } from './store'

export * from './store'

export function CodeInTheWindStatus() {
  const { state, message, details } = useCodeInTheWindStore()
  const Component = details ? 'button' : 'div'
  return (
    <Component
      className={clsx(
        'px-3 py-1 rounded text-white',
        state === 'idle' && 'bg-gray-600',
        state === 'loading' && 'bg-sky-600',
        state === 'error' && 'bg-red-600'
      )}
      {...(details ? { onClick: () => alert(details) } : {})}
    >
      {message}
      {details ? (
        <span className="text-sm opacity-70"> (click for details)</span>
      ) : null}
    </Component>
  )
}

if (typeof window !== 'undefined') {
  import('./stateWorker')
    .then((w) => w.go())
    .catch((error) => {
      console.error(error)
      store.state = {
        state: 'error',
        message: 'Worker encountered an error',
        details:
          'Your code changes will not be saved. Please copy your code and refresh the page to try again.\n\n' +
          String(error) +
          '\n\nSee the console for more details.',
      }
    })
}
