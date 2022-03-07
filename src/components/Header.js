import { Logo } from './Logo'
import clsx from 'clsx'
import { toggleTheme } from '../utils/theme'
import tailwind1 from 'tailwindcss-v1/package.json?fields=version'
import tailwind2 from 'tailwindcss-v2/package.json?fields=version'
import tailwind3 from 'tailwindcss/package.json?fields=version'
import { Listbox } from '@headlessui/react'

const versions = {
  1: tailwind1.version,
  2: tailwind2.version,
  3: tailwind3.version,
}

export function Header({
  layout,
  onChangeLayout,
  responsiveDesignMode,
  onToggleResponsiveDesignMode,
  tailwindVersion,
  onChangeTailwindVersion,
  children,
}) {
  return (
    <header
      className="relative z-20 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4 antialiased"
      style={{ fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"' }}
    >
      <div className="flex-auto flex items-center min-w-0 space-x-6">
        <Logo className="flex-none text-black dark:text-white" />
        {children}
      </div>
      <div className="flex items-center">
        <VersionSwitcher
          value={tailwindVersion}
          onChange={onChangeTailwindVersion}
        />
        <div className="hidden lg:flex items-center ml-6 rounded-md ring-1 ring-gray-900/5 shadow-sm dark:ring-0 dark:bg-gray-800 dark:shadow-highlight/4">
          <HeaderButton
            isActive={layout === 'vertical'}
            label="Switch to vertical split layout"
            onClick={() => onChangeLayout('vertical')}
          >
            <path d="M12 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9" fill="none" />
            <path d="M3 17V5a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2Z" />
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'horizontal'}
            label="Switch to horizontal split layout"
            onClick={() => onChangeLayout('horizontal')}
          >
            <path d="M23 11V3H3v8h20Z" strokeWidth="0" />
            <path
              d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2ZM22 11H4"
              fill="none"
            />
          </HeaderButton>
          <HeaderButton
            isActive={layout === 'preview'}
            label="Switch to preview-only layout"
            onClick={() => onChangeLayout('preview')}
          >
            <path
              d="M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z"
              fill="none"
            />
          </HeaderButton>
          <HeaderButton
            isActive={responsiveDesignMode}
            label="Toggle responsive design mode"
            onClick={onToggleResponsiveDesignMode}
            className="hidden md:block"
          >
            <path
              d="M15 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a1 1 0 0 0-1 1"
              fill="none"
            />
            <path d="M12 17V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2Z" />
          </HeaderButton>
        </div>
        <div className="hidden sm:block mx-6 lg:mx-4 w-px h-6 bg-gray-200 dark:bg-gray-700" />
        <HeaderButton
          className="ml-4 sm:ml-0 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4"
          naturalWidth={24}
          naturalHeight={24}
          width={36}
          height={36}
          label={
            <>
              <span className="dark:hidden">Switch to dark theme</span>
              <span className="hidden dark:inline">Switch to light theme</span>
            </>
          }
          onClick={toggleTheme}
          iconClassName="stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300"
          ringClassName="focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400"
        >
          <g className="dark:opacity-0">
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              d="M12 4v.01M17.66 6.345l-.007.007M20.005 12.005h-.01M17.66 17.665l-.007-.007M12 20.01V20M6.34 17.665l.007-.007M3.995 12.005h.01M6.34 6.344l.007.007"
              fill="none"
            />
          </g>
          <g className="opacity-0 dark:opacity-100">
            <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            <path
              d="M12 3v1M18.66 5.345l-.828.828M21.005 12.005h-1M18.66 18.665l-.828-.828M12 21.01V20M5.34 18.666l.835-.836M2.995 12.005h1.01M5.34 5.344l.835.836"
              fill="none"
            />
          </g>
        </HeaderButton>
      </div>
    </header>
  )
}

function HeaderButton({
  isActive = false,
  label,
  onClick,
  width = 42,
  height = 36,
  naturalWidth = 26,
  naturalHeight = 22,
  className,
  children,
  iconClassName,
  ringClassName,
}) {
  return (
    <button
      type="button"
      className={clsx(
        className,
        'group focus:outline-none focus-visible:ring-2 rounded-md',
        ringClassName ||
          (isActive
            ? 'focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400'
            : 'focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500')
      )}
      onClick={onClick}
    >
      <span className="sr-only">{label}</span>
      <svg
        width={width}
        height={height}
        viewBox={`${(width - naturalWidth) / -2} ${
          (height - naturalHeight) / -2
        } ${width} ${height}`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={
          iconClassName ||
          (isActive
            ? 'fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400'
            : 'fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400')
        }
      >
        {children}
      </svg>
    </button>
  )
}

function VersionSwitcher({ value, onChange }) {
  return (
    <Listbox value={value} onChange={onChange} as="div" className="relative">
      <Listbox.Button className="text-gray-500 text-xs leading-5 font-semibold bg-gray-400/10 rounded-full py-1 px-3 flex items-center hover:bg-gray-400/20 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:shadow-highlight/4">
        v{versions[value]}
        <svg
          width="6"
          height="3"
          className="ml-2 overflow-visible"
          aria-hidden="true"
        >
          <path
            d="M0 0L3 3L6 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Listbox.Button>
      <div className="absolute top-full right-0 mt-2 rounded-lg shadow-lg">
        <Listbox.Options className="overflow-hidden py-1 w-44 rounded-lg bg-white ring-1 ring-gray-900/10 text-sm leading-6 font-semibold text-gray-700 space-y-1 dark:bg-gray-800 dark:ring-0 dark:text-gray-300 dark:shadow-highlight/4">
          {Object.entries(versions)
            .sort((a, z) => parseInt(z, 10) - parseInt(a, 10))
            .map(([version, fullVersion]) => (
              <Listbox.Option
                key={version}
                value={version}
                className={({ selected, active }) =>
                  clsx(
                    'flex items-center justify-between px-3 py-1 cursor-pointer',
                    active && !selected && 'text-gray-900 dark:text-white',
                    active && 'bg-gray-50 dark:bg-gray-600/30',
                    selected && 'text-sky-500 dark:text-sky-400'
                  )
                }
              >
                {({ selected }) => (
                  <>
                    v{fullVersion}
                    {selected && (
                      <svg width="24" height="24" fill="none">
                        <path
                          d="m6 13 4 4 8-10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}
