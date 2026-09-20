import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '_linkcheck.cjs']),

  // Browser-side application code.
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['scripts/**'],
    extends: [
      js.configs.recommended,
      // Without this, JSX does not count as a variable reference, so every
      // `<motion.div>` left `motion` reported as an unused import — 30 of the
      // 50 errors in this repo were that false positive.
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // This codebase does not use prop-types; types are documented in JSDoc.
      'react/prop-types': 'off',
      // Several components deliberately export a helper or constant alongside
      // the component. That only costs Fast Refresh granularity during dev and
      // has no effect on the production build, so it is a hint, not an error.
      'react-refresh/only-export-components': 'warn',
    },
  },

  // Build/data tooling runs in Node, not the browser.
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
