/* eslint-env node */
import babel from 'rollup-plugin-babel';
import dss from 'rollup-plugin-dss';
import path from 'path';
import serve from 'rollup-plugin-serve';
import resolveDir from '@haensl/rollup-plugin-local-resolve';
import alias from 'rollup-plugin-alias';
import url from 'rollup-plugin-url';
import postcss from 'rollup-plugin-postcss';
import shorthandExpand from 'postcss-shorthand-expand';
import postcssFocusVisible from 'postcss-focus-visible';
import del from 'rollup-plugin-delete';
import json from 'rollup-plugin-json';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import copy from 'rollup-plugin-cpy';
import html from './rollup/html.js';

const DEV_MODE = !!process.env.ROLLUP_WATCH;
const OUT_DIR = 'build'
const STATIC_DIR = 'static';
const ASSET_FILE_NAME = STATIC_DIR + '/[name]-[hash][extname]';
const JS_FILE_NAME = STATIC_DIR + '/[name]-[hash].js';

export default {
  input: 'src/index.jsx',
  output: {
    dir: OUT_DIR,
    format: 'es',
    assetFileNames: ASSET_FILE_NAME,
    chunkFileNames: JS_FILE_NAME,
    entryFileNames: JS_FILE_NAME,
    sourcemap: DEV_MODE
  },
  plugins: [
    del({
      targets: OUT_DIR
    }),
    alias({
      'unistore/preact': path.resolve('./node_modules/unistore/src/integrations/preact.js'),
      unistore: path.resolve('./node_modules/unistore/src/index.js'),
      '@use-it/event-listener': path.resolve('./node_modules/@use-it/event-listener/dist/event-listener.m.js'),
      // for @use-it/event-listener
      react: path.resolve('./node_modules/preact/hooks/src/index.js'),
      'preact/hooks': path.resolve('./node_modules/preact/hooks/src/index.js'),
      'preact/compat': path.resolve('./node_modules/preact/compat/src/index.js'),
      preact: path.resolve('./node_modules/preact/src/index.js'),
      'date-fns': path.resolve('./node_modules/date-fns/esm/index.js'),
      'body-scroll-lock': path.resolve('./node_modules/body-scroll-lock/lib/bodyScrollLock.es6.js'),
      'focus-visible': path.resolve('./node_modules/focus-visible/src/focus-visible.js'),
      'wicg-inert': path.resolve('./node_modules/wicg-inert/src/inert.js')
    }),
    // preact & unistore import directories and files without extensions
    resolveDir(),
    babel({
      babelrc: false,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ['babel-plugin-classnames', {
          packageName: path.resolve('./src/utils/scoped-classnames.js')
        }],
        ['@babel/plugin-transform-react-jsx', {
          pragma: 'h',
          pragmaFrag: 'Fragment',
          useBuiltIns: true
        }]
      ]
    }),
    postcss({
      plugins: [
        shorthandExpand()
      ]
    }),
    dss(),
    // focus-visible polyfill rewrite
    {
      generateBundle(_, bundles) {
        for (const bundle in bundles) {
          if (bundle.endsWith('.css')) {
            bundles[bundle].source =
              postcssFocusVisible.process(bundles[bundle].source);
          }
        }
      }
    },
    url({
      publicPath: '/',
      fileName: ASSET_FILE_NAME,
      limit: 0 // don't inline files
    }),
    json(),
    html({
      template: './src/index.html',
      onerror: `document.getElementById('load-fail').className = 'error'`
    }),
    copy({
      files: 'public/**/*',
      dest: OUT_DIR
    }),
    !DEV_MODE && compiler({
      language_in: 'ECMASCRIPT_2019',
      language_out: 'ECMASCRIPT_2019'
    }),
    DEV_MODE && serve({
      verbose: false,
      contentBase: 'build',
      historyApiFallback: true,
      host: '0.0.0.0',
      port: 3000
    })
  ],
  onwarn(warning, rollupWarn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    rollupWarn(warning);
  }
};
