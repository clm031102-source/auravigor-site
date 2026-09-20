import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/**', 'node_modules/**', '.vite/**', 'coverage/**', '.shots/**']),
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    extends: [js.configs.recommended],
  },
  {
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
    extends: [tseslint.configs.recommended],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    extends: [reactHooks.configs.flat.recommended],
  },
  {
    files: ['src/**/*.tsx'],
    extends: [jsxA11y.flatConfigs.recommended],
  },
  {
    files: ['eslint.config.js', 'vite.config.ts', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    // Playwright evaluates this callback in the browser, not in the Node process.
    files: ['scripts/screenshots.mjs'],
    languageOptions: { globals: { window: 'readonly' } },
  },
  {
    // Existing M0 menu anchors act as buttons. Keep this visible until T14/T16;
    // T01 must not change application logic. The lint script allows one warning.
    files: ['src/ui/Header.tsx'],
    rules: { 'jsx-a11y/anchor-is-valid': 'warn' },
  },
  prettier,
]);
