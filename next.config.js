const { createLoader } = require('simple-functional-loader')
const path = require('path')
const fs = require('fs')

const externals = {
  'fs-extra': 'self.fsextra',
  resolve: 'self.resolve',
  'fs.realpath': 'self.fsrealpath',
  purgecss: 'self.purgecss',
  chokidar: 'self.chokidar',
  tmp: 'self.tmp',
  'vscode-emmet-helper-bundled': 'null',
}

const moduleOverrides = {
  colorette: path.resolve(__dirname, 'src/modules/colorette.js'),
  fs: path.resolve(__dirname, 'src/modules/fs.js'),
  'is-glob': path.resolve(__dirname, 'src/modules/is-glob.js'),
  'glob-parent': path.resolve(__dirname, 'src/modules/glob-parent.js'),
  'fast-glob': path.resolve(__dirname, 'src/modules/fast-glob.js'),
}

function getExternal({ context, request }, callback) {
  if (/node_modules/.test(context) && externals[request]) {
    return callback(null, externals[request])
  }
  callback()
}

const files = [
  {
    pattern: /modern-normalize/,
    file: require.resolve('modern-normalize'),
  },
  {
    pattern: /normalize/,
    file: require.resolve('normalize.css'),
  },
  {
    pattern: /preflight/,
    tailwindVersion: 1,
    file: path.resolve(
      __dirname,
      'node_modules/tailwindcss-v1/lib/plugins/css/preflight.css'
    ),
  },
  {
    pattern: /preflight/,
    tailwindVersion: 2,
    file: path.resolve(
      __dirname,
      'node_modules/tailwindcss-v2/lib/plugins/css/preflight.css'
    ),
  },
  {
    pattern: /preflight/,
    tailwindVersion: 3,
    file: path.resolve(
      __dirname,
      'node_modules/tailwindcss/lib/css/preflight.css'
    ),
  },
]

function createReadFileReplaceLoader(tailwindVersion) {
  return createLoader(function (source) {
    return source.replace(/_fs\.default\.readFileSync\(.*?'utf8'\)/g, (m) => {
      for (let i = 0; i < files.length; i++) {
        if (
          files[i].pattern.test(m) &&
          (!files[i].tailwindVersion ||
            files[i].tailwindVersion === tailwindVersion)
        ) {
          return (
            '`' +
            fs.readFileSync(files[i].file, 'utf8').replace(/`/g, '\\`') +
            '`'
          )
        }
      }
      return m
    })
  })
}

module.exports = {
  async headers() {
    return [
      {
        source: '/plugins/:path*',
        headers: [
          {
            key: 'cache-control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  webpack: (config, { isServer, webpack, dev }) => {
    config.resolve.alias = { ...config.resolve.alias, ...moduleOverrides }

    config.module.rules
      .filter((rule) => rule.oneOf)
      .forEach((rule) => {
        rule.oneOf.forEach((r) => {
          if (
            r.issuer &&
            r.issuer.and &&
            r.issuer.and.length === 1 &&
            r.issuer.and[0].source &&
            r.issuer.and[0].source.replace(/\\/g, '') ===
              path.resolve(process.cwd(), 'src/pages/_app')
          ) {
            r.issuer.or = [
              ...r.issuer.and,
              /[\\/]node_modules[\\/]monaco-editor[\\/]/,
            ]
            delete r.issuer.and
          }
        })
      })

    if (!isServer) {
      if (config.externals) {
        config.externals.push(getExternal)
      } else {
        config.externals = [getExternal]
      }
    }

    config.module.rules.push({
      test: {
        or: [
          require.resolve('monaco-editor/esm/vs/language/css/css.worker.js'),
          require.resolve('monaco-editor/dev/vs/language/css/cssWorker.js'),
        ],
      },
      use: [
        createLoader(function (source) {
          return source.replace(
            'case "css":',
            'case "css":\ncase "tailwindcss":'
          )
        }),
      ],
    })

    config.module.rules.push({
      test: require.resolve('tailwindcss-v1/lib/plugins/preflight.js'),
      use: [createReadFileReplaceLoader(1)],
    })

    config.module.rules.push({
      test: require.resolve('tailwindcss-v2/lib/plugins/preflight.js'),
      use: [createReadFileReplaceLoader(2)],
    })

    config.module.rules.push({
      test: /tailwindcss\/lib\/corePlugins\.js/,
      use: [createReadFileReplaceLoader(3)],
    })

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.TAILWIND_MODE': JSON.stringify('build'),
        'process.env.TAILWIND_DISABLE_TOUCH': true,
      })
    )

    config.module.rules.push({
      resourceQuery: /fields/,
      use: createLoader(function (source) {
        let fields = new URLSearchParams(this.resourceQuery)
          .get('fields')
          .split(',')

        let res = JSON.stringify(JSON.parse(source), (key, value) => {
          if (['', ...fields].includes(key)) {
            if (key === 'main') {
              return path.relative(
                path.resolve(__dirname, 'node_modules'),
                path.resolve(path.dirname(this.resourcePath), value)
              )
            }
            return value
          }
          return undefined
        })

        return res
      }),
    })

    let browsers = require('browserslist')([
      '> 1%',
      'not edge <= 18',
      'not ie 11',
      'not op_mini all',
    ])

    config.module.rules.push({
      test: require.resolve('browserslist'),
      use: [
        createLoader(function (_source) {
          return `
            module.exports = () => (${JSON.stringify(browsers)})
          `
        }),
      ],
    })

    config.module.rules.push({
      test: require.resolve('caniuse-lite/dist/unpacker/index.js'),
      use: [
        createLoader(function (_source) {
          let agents = require('caniuse-lite/dist/unpacker/agents.js').agents

          for (let name in agents) {
            for (let key in agents[name]) {
              if (key !== 'prefix' && key !== 'prefix_exceptions') {
                delete agents[name][key]
              }
            }
          }

          let features = require('caniuse-lite').feature(
            require('caniuse-lite/data/features/css-featurequeries.js')
          )

          return `
            export const agents = ${JSON.stringify(agents)}
            export function feature() {
              return ${JSON.stringify(features)}
            }
          `
        }),
      ],
    })

    config.module.rules.push({
      test: require.resolve('autoprefixer/data/prefixes.js'),
      use: [
        createLoader(function (_source) {
          let result = require('autoprefixer/data/prefixes.js')

          for (let key in result) {
            result[key].browsers = result[key].browsers.filter((b) =>
              browsers.includes(b)
            )
            if (result[key].browsers.length === 0) {
              delete result[key]
            }
          }

          return `module.exports = ${JSON.stringify(result)}`
        }),
      ],
    })

    config.output.globalObject = 'self'

    if (!dev && isServer) {
      let originalEntry = config.entry

      config.entry = async () => {
        const entries = { ...(await originalEntry()) }
        entries['scripts/buildBuiltinPlugins'] =
          './src/scripts/buildBuiltinPlugins.js'
        return entries
      }
    }

    let workers = [
      {
        label: 'editor.worker',
        id: 'vs/editor/editor',
        entry: 'vs/editor/editor.worker',
      },
      {
        label: 'html.worker',
        id: 'vs/language/html/htmlWorker',
        entry: 'vs/language/html/html.worker',
      },
      {
        label: 'css.worker',
        id: 'vs/language/css/cssWorker',
        entry: 'vs/language/css/css.worker',
      },
      {
        label: 'ts.worker',
        id: 'vs/language/typescript/tsWorker',
        entry: 'vs/language/typescript/ts.worker',
      },
    ]

    config.plugins.push(
      ...workers.map(
        ({ label, id, entry }) =>
          new AddWorkerEntryPointPlugin({
            id,
            label,
            entry: require.resolve(path.join('monaco-editor/esm', entry)),
            filename: isServer ? `${label}.js` : `static/chunks/${label}.js`,
            chunkFilename: isServer
              ? `${label}.js`
              : `static/chunks/${label}.js`,
            plugins: [
              new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
            ],
          })
      )
    )

    return config
  },
}

/**
 * AddWorkerEntryPointPlugin
 * https://github.com/microsoft/monaco-editor/blob/57e51563851acfda93b532aa7812159943527c7b/monaco-editor-webpack-plugin/src/plugins/AddWorkerEntryPointPlugin.ts
 */
function getCompilerHook(
  compiler,
  { id, label, entry, filename, chunkFilename, plugins }
) {
  const webpack = compiler.webpack

  return function (compilation, callback) {
    const outputOptions = {
      filename,
      chunkFilename,
      publicPath: compilation.outputOptions.publicPath,
      // HACK: globalObject is necessary to fix https://github.com/webpack/webpack/issues/6642
      globalObject: 'this',
    }
    const childCompiler = compilation.createChildCompiler(id, outputOptions, [
      new webpack.webworker.WebWorkerTemplatePlugin(),
      new webpack.LoaderTargetPlugin('webworker'),
    ])
    const SingleEntryPlugin = webpack.EntryPlugin
    new SingleEntryPlugin(compiler.context, entry, label).apply(childCompiler)
    plugins.forEach((plugin) => plugin.apply(childCompiler))

    childCompiler.runAsChild((err) => callback(err))
  }
}

class AddWorkerEntryPointPlugin {
  constructor({
    id,
    label,
    entry,
    filename,
    chunkFilename = undefined,
    plugins,
  }) {
    this.options = { id, label, entry, filename, chunkFilename, plugins }
  }

  apply(compiler) {
    const webpack = compiler.webpack
    const compilerHook = getCompilerHook(compiler, this.options)
    const majorVersion = webpack.version.split('.')[0]
    if (parseInt(majorVersion) < 4) {
      compiler.plugin('make', compilerHook)
    } else {
      compiler.hooks.make.tapAsync('AddWorkerEntryPointPlugin', compilerHook)
    }
  }
}
