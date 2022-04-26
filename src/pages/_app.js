import '../css/main.css'
import Head from 'next/head'

const TITLE = 'Tailwind Play'
const DESCRIPTION =
  "An advanced online playground for Tailwind CSS that lets you use all of Tailwind's build-time features directly in the browser."
const FAVICON_VERSION = 3

if (typeof window !== 'undefined') {
  require('../workers/subworkers')
}

if (typeof window !== 'undefined') {
  /**
   * Work around https://github.com/tailwindlabs/play.tailwindcss.com/issues/47
   */
  const issue47Workaround = async () => {
    if (process.env.NODE_ENV === 'production') {
      return
    }
    for (let i = 0; i < 100; i++) {
      const text =
        document
          .querySelector('nextjs-portal')
          ?.shadowRoot?.querySelector('.nextjs-container-errors-header')
          ?.textContent ?? ''
      if (text.includes('Parsing successful!')) {
        const close = document
          .querySelector('nextjs-portal')
          ?.shadowRoot?.querySelector('[aria-label="Close"]')
        if (close) {
          close.click()
          return
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  issue47Workaround()
}

function v(href) {
  return `${href}?v=${FAVICON_VERSION}`
}

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={v('/favicons/apple-touch-icon.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={v('/favicons/favicon-32x32.png')}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={v('/favicons/favicon-16x16.png')}
        />
        <link rel="manifest" href={v('/favicons/site.webmanifest')} />
        <link
          rel="mask-icon"
          href={v('/favicons/safari-pinned-tab.svg')}
          color="#38bdf8"
        />
        <link rel="shortcut icon" href={v('/favicons/favicon.ico')} />
        <meta name="apple-mobile-web-app-title" content="Tailwind Play" />
        <meta name="application-name" content="Tailwind Play" />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta
          name="msapplication-config"
          content={v('/favicons/browserconfig.xml')}
        />
        <meta name="theme-color" content="#ffffff" />

        <title>{TITLE}</title>
        <meta content={DESCRIPTION} name="description" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={TITLE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:site" content="@tailwindlabs" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
